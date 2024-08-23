const express = require("express");
const blogController = require("./../controllers/blogController");
const authController = require("./../controllers/authController");

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.post("/get-by-id", blogController.getBlog);

router.use(authController.restrictTo("admin"));

router
  .post(
    "/add",
    blogController.uploadBlogImages,
    blogController.resizeBlogImages,
    blogController.createBlog,
  )
  .post("/delete", blogController.deleteBlog)
  .post("/get-all", blogController.getAllBlogs)
  .post(
    "/update",
    blogController.uploadBlogImages,
    blogController.resizeBlogImages,
    blogController.updateBlog
  )
  .post("/get-by-id", blogController.getBlog);

module.exports = router;
