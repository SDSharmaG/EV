const Charger = require("../Model/chargermodel");
const Station = require("../Model/stationmodel");
const mongoose = require("mongoose");

//  Add Charger
const addCharger = async (req, res) => {
  try {
    const {
      stationId,
      chargername,
      type,
      poweroutput,
      status,
      connectortype,
      rate,
    } = req.body;

    if (!stationId)
      return res.status(400).json({ message: "Station ID is required" });

    // Verify station exists
    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    const newCharger = new Charger({
      stationId,
      chargername,
      type,
      poweroutput,
      status,
      connectortype,
      rate,
    });

    const savedCharger = await newCharger.save();
    res.status(201).json({
      message: "Charger added successfully",
      data: savedCharger,
    });
  } catch (error) {
    console.error("Error adding charger:", error);
    res
      .status(500)
      .json({ message: "Failed to add charger", error: error.message });
  }
};

// ✅ Get All Chargers
const getChargers = async (req, res) => {
  try {
    const chargers = await Charger.find().populate(
      "stationId",
      "name location"
    );
    res.status(200).json({
      message: "Chargers fetched successfully",
      data: chargers,
    });
  } catch (error) {
    console.error("Error fetching chargers:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch chargers", error: error.message });
  }
};

// ✅ Get Chargers by Station (fixed)
const getChargersByStation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Station ID is required" });
    }

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Station ID" });
    }

    // Find chargers for this station and populate station info
    const chargers = await Charger.find({ stationId: id }).populate(
      "stationId",
      "name location"
    );

    if (!chargers.length) {
      return res.status(200).json({
        message: "No chargers found for this station",
        data: [],
      });
    }

    res.status(200).json({
      message: "Chargers fetched successfully for the station",
      data: chargers,
    });
  } catch (error) {
    console.error("Error fetching chargers by station:", error);
    res.status(500).json({
      message: "Failed to fetch chargers",
      error: error.message,
    });
  }
};

// ✅ Update Charger
const updateCharger = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCharger = await Charger.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedCharger)
      return res.status(404).json({ message: "Charger not found" });

    res.status(200).json({
      message: "Charger updated successfully",
      data: updatedCharger,
    });
  } catch (error) {
    console.error("Error updating charger:", error);
    res
      .status(500)
      .json({ message: "Failed to update charger", error: error.message });
  }
};

// ✅ Delete Charger
const deleteCharger = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Charger.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Charger not found" });

    res.status(200).json({ message: "Charger deleted successfully" });
  } catch (error) {
    console.error("Error deleting charger:", error);
    res
      .status(500)
      .json({ message: "Failed to delete charger", error: error.message });
  }
};

module.exports = {
  addCharger,
  getChargers,
  getChargersByStation,
  updateCharger,
  deleteCharger,
};
