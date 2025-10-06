const app = require("./src/app");
const env = require("./config/env.config.js");
const { sequelize } = require("./src/connections/sequelize/index.js");
const { connectMongoDB } = require("./src/connections/mongoose/index.js");

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Sequelize connected successfully");

    await connectMongoDB();
    const PORT = env.PORT;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
