const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};
const configuredCloudinaryValues = Object.values(cloudinaryConfig).filter(Boolean);

if (configuredCloudinaryValues.length > 0 && configuredCloudinaryValues.length < 3) {
  throw new Error(
    "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET together."
  );
}

if (configuredCloudinaryValues.length === 3) {
  cloudinary.config(cloudinaryConfig);
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }
    return callback(null, true);
  },
});

const uploadImage = (folder, localDirectory, fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, async (middlewareError) => {
    if (middlewareError) return next(middlewareError);
    if (!req.file) return next();

    try {
      if (configuredCloudinaryValues.length === 3) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, uploadedImage) => {
              if (error) return reject(error);
              return resolve(uploadedImage);
            }
          );
          stream.end(req.file.buffer);
        });

        if (!result?.secure_url) {
          throw new Error("Cloudinary did not return an image URL.");
        }
        req.file.filename = result.secure_url;
        req.file.path = result.secure_url;
      } else {
        const directory = path.join(__dirname, "..", "uploads", localDirectory);
        await fs.promises.mkdir(directory, { recursive: true });
        const extension = path.extname(req.file.originalname);
        const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
        const filePath = path.join(directory, filename);
        await fs.promises.writeFile(filePath, req.file.buffer);
        req.file.filename = filename;
        req.file.path = filePath;
      }

      return next();
    } catch (error) {
      console.error("Image upload failed:", error.message);
      return res.status(502).json({ message: "Image upload failed. Please try again." });
    }
  });
};

module.exports = uploadImage;
