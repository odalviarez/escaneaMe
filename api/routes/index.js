const express = require("express");
const { Router } = require("express");
//const router = express.Router();
const userControl = require("../controllers/usersController");
const productControl = require("../controllers/productsController");
const server = express();
const router = Router();

router.use("/register", userControl);
router.use("/products", productControl);


module.exports = router;
