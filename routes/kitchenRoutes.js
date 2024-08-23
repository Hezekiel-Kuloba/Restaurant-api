const express = require("express");
const kitchenController = require("./../controllers/kitchenController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
// router.use(authController.protect);

// router.use(authController.restrictTo("admin"));

router
  .post(
    "/add",
    kitchenController.createKitchen,
  )
  .post("/delete", kitchenController.deleteKitchen)
  .post("/get-all", kitchenController.getAllKitchens)
  .post(
    "/update",
    kitchenController.updateKitchen
  )

module.exports = router;
