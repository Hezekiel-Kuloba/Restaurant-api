const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const PDFDocument = require('pdfkit');
const axios = require('axios');
const fs = require('fs');

const { GoogleGenerativeAI } = require('@google/generative-ai');
// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const blogRouter = require('./routes/blogRoutes');
const mealRouter = require('./routes/mealRoutes');
const orderRouter = require('./routes/orderRoutes');
const kitchenRouter = require('./routes/kitchenRoutes');
const Order = require('./models/orderModel'); // Adjust the path as necessary
const Meal = require('./models/mealModel');
const Mealpdf = require('./models/pdfModel');


// Start express app
const app = express();

app.enable('trust proxy');


// 1) GLOBAL MIDDLEWARES
// Implement CORS
// app.use(cors());
// Access-Control-Allow-Origin *

app.use(cors({
  //  origin: 'http://192.168.100.9:8080' // Replace with your device's IP address and port
}));


// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.cookies);
  next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/meals', mealRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/kitchen', kitchenRouter);
// API endpoint to add orders
app.post('/api/v1/order-array', async (req, res) => {
  let orders = req.body;

  // Normalize input to always be an array
  if (!Array.isArray(orders)) {
      orders = [orders]; // Wrap single order in an array
  }

  // Validate that we have at least one order
  if (orders.length === 0) {
      return res.status(400).json({ error: 'Invalid input: Expected at least one order.' });
  }

  try {
      // Create orders in bulk
      const createdOrders = await Order.insertMany(orders);
      return res.status(201).json({ message: 'Orders created successfully', data: createdOrders });
  } catch (error) {
      // Handle errors
      console.error('Error creating orders:', error);
      return res.status(500).json({ error: 'An error occurred while creating orders.', details: error.message });
  }
});

app.post('/api/v1/meal-search', async (req, res) => {
  try {
    const { name, category } = req.body;
          const query = {};

      if (name) {
          query.name = new RegExp(name, 'i'); // Case-insensitive regex search
      }

      if (category) {
          query.category = category;
      }

      const meals = await Meal.find(query);
      res.json(meals);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// API endpoint to get meal details
app.post('/api/v1/meal-details', async (req, res) => {
  const { mealName } = req.body;

  if (!mealName) {
      return res.status(400).json({ error: 'Meal name is required' });
  }

  try {
      // Create a prompt to get ingredients and nutritional values
      const prompt = `Provide the ingredients list only and nutritional as values points and how it helps with you health, and how it negatively affects you health and diseases as points (add formatting elements (headings, bulleted lists etc, but do not use * or #) also for the meal ${mealName}. Also if the meal is not available give something closest to that meal and common`;

      // Generate content using the Gemini API
      const result = await model.generateContent(prompt);  
      const response = await result.response;

      // Send the generated details back to the client
      res.json({ details: response.text() });
  } catch (error) {
      console.error('Error generating meal details:', error);
      res.status(500).json({ error: 'Failed to generate meal details' });
  }
});

app.post('/generate-pdf', async (req, res) => {
  const { meals } = req.body; // Expecting an array of meal objects

  if (!meals || meals.length === 0) {
    return res.status(400).json({ error: 'Meals data is required' });
  }

  try {
    // Create a new PDF document
    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'Meals.pdf');

    // Pipe the PDF into a writable stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    
    // Adding a title to the menu
    doc
      .fontSize(30)
      .font('Helvetica-Bold')
      .text('Restaurant Menu', { align: 'center' })
      .moveDown(2);

    // Loop through each meal and add its details to the PDF
    for (const meal of meals) {
      const { mealName, mealImage, mealdescription } = meal;

      // Add meal name
      doc.fontSize(25).text(mealName, {
        align: 'center',
      });
      // Add meal name
      doc.fontSize(25).text(mealdescription, {
        align: 'center',
      });

      // Add meal image
      if (mealImage.startsWith('http')) {
        const response = await axios({
          url: mealImage,
          responseType: 'arraybuffer',
        });

        const imageBuffer = Buffer.from(response.data, 'binary');
        doc.image(imageBuffer, {
          fit: [150, 150],
          align: 'center',
          valign: 'center',
        });
      } else {
        const imageBuffer = Buffer.from(mealImage, 'base64');
        doc.image(imageBuffer, {
          fit: [500, 300],
          align: 'center',
          valign: 'center',
        });
      }

      doc.moveDown(1);
      
      doc.addPage(); 
      if (doc.y > 700) {
        doc.addPage(); // Add a new page if necessary
      } else {
        doc.moveDown(2); // Otherwise, add some space before the next meal
      }
    }

    // Finalize the PDF and end the document
    doc.end();

    // Handle the stream finish event to send the PDF file
    stream.on('finish', () => {
      res.download(filePath, 'Meals.pdf', (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to download the PDF' });
        // } else {
        //   fs.unlinkSync(filePath); // Remove the file after download
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate the PDF' });
  }
});


app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
