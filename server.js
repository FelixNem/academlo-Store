const { app } = require('./app');
//* Database
const { db } = require('./utils/database.utils');
const { initModels } = require('./models/initModels');

const startServer = async () => {
  try {
    await db.authenticate();

    initModels();

    await db.sync();

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Academlo-Store Server is Running!!! on PORT: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
