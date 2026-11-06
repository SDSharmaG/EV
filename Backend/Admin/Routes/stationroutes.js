const express = require("express");
const upload = require("../Config/multer");
const Stationcontroller = require("../controller/Stationcontroller");
const router = express.Router();

router.post(
  "/stationregister",
  upload.single("image"),
  Stationcontroller.StationRegister
);
//for detailsinfo
router.get("/stationinfo", Stationcontroller.Stationdetails);
//for get by id
router.get("/getstationbyid/:id", Stationcontroller.getStationById);
//for  Update
router.put(
  "/stationupdate/:id",
  upload.single("image"),
  Stationcontroller.updateStations
);
//for deleteStation
router.delete("/stationdelete/:id", Stationcontroller.deleteStation);
//for total count
router.get("/station/total", Stationcontroller.StationTotal);

module.exports = router;
