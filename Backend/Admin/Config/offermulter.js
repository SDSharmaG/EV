const uploadImage = require("./imageUpload");

module.exports = {
  single: (fieldName) => uploadImage("offers", "offers", fieldName),
};
