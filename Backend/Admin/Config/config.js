module.exports = {
  PORT: process.env.PORT || 8080,
  mongoURL: process.env.MONGO_URI || "mongodb://localhost:27017/AdminPage",
  jwtSecret: process.env.JWT_SECRET || "privatesecurity",
};
