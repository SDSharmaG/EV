const express = require("express");
const Admincontroller = require("../controller/Admincontroller");
const router = express.Router();

router.post("/Register", Admincontroller.Register);

router.post("/Login", Admincontroller.Login);

router.post("/Logout", Admincontroller.Logout);

module.exports = router;
