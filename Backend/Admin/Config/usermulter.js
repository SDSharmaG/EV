const uploadImage = require("./imageUpload");

module.exports = {
  single: (fieldName) => uploadImage("users", "Users", fieldName),
};
