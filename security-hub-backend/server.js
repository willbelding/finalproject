// In this file, I have created a main entry point for the backend server.
// As well as this, Express, routes, database etc are set up.
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// This attempts to sync the database with any changes in a model (check my models
// folder to see the list I have)
const db = require("./models");
db.sequelize.sync({ alter: true })
// Messages are displayed depending on the success.
  .then(() => console.log('Database synced with model changes'))
  .catch((err) => console.error('Database sync failed:', err));

// The various routes I have listed in my "routes" folder are registered.
require("./routes/auth.routes")(app);
require("./routes/device.routes")(app);
app.use("/api", require("./routes/malware.routes"));
app.use("/api", require("./routes/scanHistory"));

// This is reponsible for starting the server on port 5000.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});