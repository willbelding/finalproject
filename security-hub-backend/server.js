const express = require("express");
const cors = require("cors");
const app = express();

require("dotenv").config();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync();  // creates tables if they don't exist

require("./routes/auth.routes")(app);
require("./routes/device.routes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});