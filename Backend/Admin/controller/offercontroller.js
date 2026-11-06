const Offer = require("../Model/offer");
const getImageUrl = require("../Config/imageUrl");

// Add new offer
const addoffer = async (req, res) => {
  try {
    const newOffer = new Offer({
      ...req.body,
      image: req.file ? req.file.filename : null,
    });
    await newOffer.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Offer added successfully",
        data: newOffer,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all offers
const getalloffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: offers.map((offer) => ({
        ...offer.toObject(),
        imageUrl: getImageUrl(offer.image, "offers"),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    await Offer.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Offer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addoffer, getalloffers, deleteOffer };
