const mongoose = require("mongoose");

const databaseConnectionString = process.env.MONGO_URI;

const initDatabaseConnection = async () => {
  try {
    await mongoose.connect(databaseConnectionString);
    console.log("Database connected successfully");
  } catch (e) {
    console.log("❌ Db connection error");
    process.exit(1);
  }
};

const startServer = async (port, server) => {
  await initDatabaseConnection();
  server.listen(port, () => {
    console.log(`Server running and listening on port ${port}`);
  });
};

module.exports = startServer;
