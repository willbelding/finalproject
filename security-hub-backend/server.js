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

const db = require("./models");
db.sequelize.sync({ alter: true })
  .then(() => console.log('Database synced with model changes'))
  .catch((err) => console.error('Database sync failed:', err));

require("./routes/auth.routes")(app);
require("./routes/device.routes")(app);
app.use("/api", require("./routes/malware.routes"));
app.use("/api", require("./routes/scanHistory"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});