const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const Station = require("../Model/stationmodel");
const Offer = require("../Model/offer");
const User = require("../Model/Usermodel");

const backendDirectory = path.join(__dirname, "..");
const uploadsDirectory = path.join(backendDirectory, "uploads");
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const imageCollections = [
  { name: "stations", model: Station, field: "image", directory: uploadsDirectory },
  {
    name: "offers",
    model: Offer,
    field: "image",
    directory: path.join(uploadsDirectory, "Offers"),
  },
  {
    name: "users",
    model: User,
    field: "profileImage",
    directory: path.join(uploadsDirectory, "Users"),
  },
];

const validateEnvironment = () => {
  if (!process.env.MONGO_URI?.startsWith("mongodb+srv://")) {
    throw new Error("Set MONGO_URI to the MongoDB Atlas connection string.");
  }

  if (Object.values(cloudinaryConfig).some((value) => !value)) {
    throw new Error(
      "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
};

const migrateCollection = async ({ name, model, field, directory }) => {
  const documents = await model.find({ [field]: { $type: "string", $ne: "" } });
  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const document of documents) {
    const image = document[field];
    if (/^https?:\/\//i.test(image)) {
      skipped += 1;
      continue;
    }

    const filename = path.basename(image);
    const filePath = path.join(directory, filename);
    if (!filename || !(await fs.promises.stat(filePath).then(() => true, () => false))) {
      console.error(`[${name}] Local image not found for document ${document._id}: ${image}`);
      failed += 1;
      continue;
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: name,
        public_id: String(document._id),
        overwrite: true,
        resource_type: "image",
      });
      if (!result.secure_url) {
        throw new Error("Cloudinary did not return a secure image URL.");
      }

      document[field] = result.secure_url;
      await document.save();
      migrated += 1;
      console.log(`[${name}] Migrated document ${document._id}`);
    } catch (error) {
      console.error(`[${name}] Failed to migrate document ${document._id}: ${error.message}`);
      failed += 1;
    }
  }

  console.log(`[${name}] migrated=${migrated}, skipped=${skipped}, failed=${failed}`);
  return failed;
};

const main = async () => {
  validateEnvironment();
  cloudinary.config(cloudinaryConfig);
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB Atlas.");

  let failures = 0;
  for (const collection of imageCollections) {
    failures += await migrateCollection(collection);
  }

  if (failures > 0) {
    process.exitCode = 1;
    console.error(`Image migration finished with ${failures} failure(s).`);
  } else {
    console.log("Image migration completed successfully.");
  }
};

main()
  .catch((error) => {
    console.error("Image migration failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
