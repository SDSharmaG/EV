const express = require("express");
const { createContact } = require("../controller/contactcontroller");

const router = express.Router();

router.post("/contact", createContact);

module.exports = router;
