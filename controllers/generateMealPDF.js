// Helper function to generate PDF
export function generateMealPDF(meal, res) {
    const doc = new PDFDocument();

    // Set up PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${meal.name}.pdf`);

    // Add title
    doc.fontSize(25).text(meal.name, {
        align: 'center',
        underline: true,
    });

    doc.moveDown();

    // Add image if available
    if (meal.image) {
        const imagePath = path.join(__dirname, meal.image);
        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, {
                fit: [500, 300],
                align: 'center',
                valign: 'center',
            });
            doc.moveDown();
        }
    }

    // Add meal description
    doc.fontSize(16).text(`Description: ${meal.description}`, {
        align: 'left',
    });

    doc.moveDown();

    // Add meal category
    doc.fontSize(16).text(`Category: ${meal.category}`, {
        align: 'left',
    });

    // Finalize the PDF and end the stream
    doc.pipe(res);
    doc.end();
}
