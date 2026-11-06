const Station = require("../Model/stationmodel");
const getImageUrl = require("../Config/imageUrl");

// Register a new station
const StationRegister = async (req, res) => {
  try {
    const { name, location, chargers, status, address } = req.body;

    if (!name || !location || !address || !chargers) {
      return res
        .status(400)
        .json({ message: "Name, location, and chargers are required" });
    }

    const newStation = new Station({
      name,
      location,
      chargers,
      address,
      status: status || "Open",
      image: req.file ? req.file.filename : null,
    });

    await newStation.save();

    res.status(201).json({
      id: newStation._id,
      name: newStation.name,
      location: newStation.location,
      chargers: newStation.chargers,
      address: newStation.address,
      status: newStation.status,
      imageUrl: getImageUrl(newStation.image),
      message: "Station Registered Successfully",
    });
  } catch (error) {
    console.error("Error creating station:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all stations
const Stationdetails = async (req, res) => {
  try {
    const stations = await Station.find();

    const formatted = stations.map((station) => ({
      id: station._id,
      name: station.name,
      location: station.location,
      chargers: station.chargers,
      address: station.address,
      status: station.status,
      imageUrl: getImageUrl(station.image),
    }));

    res.status(200).json({
      message: "All station details fetched successfully!",
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching station details:", error);
    res.status(500).json({
      message: "Error fetching station details",
      error: error.message,
    });
  }
};

// Get single station by ID
const getStationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Station ID is required" });
    }

    const station = await Station.findById(id);

    if (!station) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.status(200).json({
      message: "Station fetched successfully",
      data: {
        id: station._id,
        name: station.name,
        location: station.location,
        chargers: station.chargers,
        address: station.address,
        status: station.status,
        imageUrl: getImageUrl(station.image),
      },
    });
  } catch (error) {
    console.error("Error fetching station:", error);
    res
      .status(500)
      .json({ message: "Error fetching station", error: error.message });
  }
};

// Update station
const updateStations = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) updateData.image = req.file.filename;

    if (
      updateData.status &&
      !["Open", "Close", "Maintenance"].includes(updateData.status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedStation) {
      return res.status(404).json({ message: "Station not found" });
    }

    res.status(200).json({
      message: "Station updated successfully",
      data: {
        name: updatedStation.name,
        location: updatedStation.location,
        chargers: updatedStation.chargers,
        address: updatedStation.address,
        status: updatedStation.status,
        imageUrl: getImageUrl(updatedStation.image),
      },
    });
  } catch (error) {
    console.error("Error updating station:", error);
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// Delete station
const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Station ID is required" });

    const deletedStation = await Station.findByIdAndDelete(id);

    if (!deletedStation)
      return res.status(404).json({ message: "Station not found" });

    res.status(200).json({
      message: "Station deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting station:", error);
    res
      .status(500)
      .json({ message: "Error deleting station", error: error.message });
  }
};
const StationTotal = async (req, res) => {
  try {
    const count = await Station.countDocuments(); //to get total count of stations
    res.json({ sucess: true, totalStations: count });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  Stationdetails,
  StationRegister,
  updateStations,
  deleteStation,
  getStationById,
  StationTotal,
};
