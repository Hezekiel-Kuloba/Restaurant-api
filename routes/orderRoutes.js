const express = require("express");
const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
// router.use(authController.protect);

// router.use(authController.restrictTo("admin"));

router
  .post(
    "/add",
    orderController.createOrder,
  )
  .post("/delete", orderController.deleteOrder)
  .post("/get-all", orderController.getAllOrders)

module.exports = router;
