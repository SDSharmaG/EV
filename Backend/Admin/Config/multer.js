const uploadImage = require("./imageUpload");

module.exports = {
  single: (fieldName) => uploadImage("stations", "", fieldName),
};
