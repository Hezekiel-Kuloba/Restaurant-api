const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/signup", authController.signup);
router.post("/get-all", userController.getAllUsers)


// Protect all routes after this middleware
router.use(authController.protect);

router
  .post("/get-by-id", userController.getUser)
  .post("/update-password", authController.updatePassword)

  .post(
    "/update-me",
    // userController.uploadUserPhoto,
    // userController.resizeUserPhoto,
    userController.updateUser
  );

router.use(authController.restrictTo("admin"));

router
  .post("/delete", userController.deleteUser)
  .post("/deleteMe", userController.deleteMe)
  .post("/add", userController.createUser)

module.exports = router;
