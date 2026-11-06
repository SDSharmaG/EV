const app = require("./app");
const config = require("./Config/config");
const connectDB = require("./Config/db");

connectDB().then(() => {
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
});
