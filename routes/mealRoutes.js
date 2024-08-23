const express = require("express");
const mealController = require("./../controllers/mealController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
// router.use(authController.protect);

// router.use(authController.restrictTo("admin"));

router
  .post(
    "/add",
    mealController.createMeal,
  )
  .post("/delete", mealController.deleteMeal)
  .post("/get-all", mealController.getAllMeals)
  .post("/add-meal", mealController.uploadMealPhoto, mealController.createMealWithImage)
  .post(
    "/update",
    mealController.updateMeal
  )

module.exports = router;
