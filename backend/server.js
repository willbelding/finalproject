const express = require('express');
const deviceRoutes = require('./routes/deviceRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Home Guard Security'); // A simple response for the root path
});

// Define routes
app.use('/api', deviceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});