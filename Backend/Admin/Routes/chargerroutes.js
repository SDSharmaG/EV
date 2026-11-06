const express = require("express");
const router = express.Router();
const chargercontroller = require("../controller/Chargercontroller");

//to add new chargers
router.post("/chargeradd", chargercontroller.addCharger);

//to get all chargers
router.get("/chargerdetails", chargercontroller.getChargers);

//to get by id
router.get("/getchargerbyid/:id", chargercontroller.getChargersByStation);

//to update the charger
router.put("/chargerupdate/:id", chargercontroller.updateCharger);

//to delete
router.delete("/chargerdelete/:id", chargercontroller.deleteCharger);

module.exports = router;
