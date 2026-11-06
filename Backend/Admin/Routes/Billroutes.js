const express = require("express");
const router = express.Router();
const {
  getBillPDF,
  getBillbyUser,
  getAllBills,
} = require("../controller/Bookingcontroller");

// Get bills by user
router.get("/user/:userId", getBillbyUser);

// Download bill pdf
router.get("/pdf/:billId", getBillPDF);

//get all bills
router.get("/allbills", getAllBills);

module.exports = router;
