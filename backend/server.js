const express = require('express');
const deviceRoutes = require('./routes/deviceRoutes');
const { connectToDatabase } = require('./database/dbConfig');
require('dotenv').config();

const app = express();

app.use(express.json());

(async () => {
    await connectToDatabase();
})();

app.get('/', (req, res) => {
    res.send('Welcome to the Home Guard Security');
});

app.use('/api', deviceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
