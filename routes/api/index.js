const router = require("express").Router();
const thoughtRoutes = require("./thoughtRoutes");
const userRoutes = require("./userRoutes");

// /users
router.use("/users", userRoutes);
// /thoughts
router.use("./thoughts", thoughtRoutes);

module.exports = router;