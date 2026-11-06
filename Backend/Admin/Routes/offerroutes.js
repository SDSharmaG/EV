const express = require("express");
const upload = require("../Config/offermulter");
const {
  addoffer,
  getalloffers,
  deleteOffer,
} = require("../controller/offercontroller");
const router = express.Router();

/* ADD OFFER */
router.post("/addoffers", upload.single("image"), addoffer);

/* GET OFFERS */
router.get("/all-offers", getalloffers);

/* DELETE OFFER */
router.delete("/delete/:id", deleteOffer);

module.exports = router;
