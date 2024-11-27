const sql = require('mssql');
const dbConfig = require('../database/dbConfig');

// Get all devices
exports.getAllDevices = async (req, res) => {
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request().query('SELECT * FROM Devices');
        res.status(200).json(result.recordset); // Return devices data
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).send('Error fetching devices');
    }
};

// Get a device by ID
exports.getDeviceById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT * FROM Devices WHERE Device_ID = @id');
        if (result.recordset.length === 0) {
            return res.status(404).send('Device not found');
        }
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching device:', error);
        res.status(500).send('Error fetching device');
    }
};

// Add a new device
exports.addDevice = async (req, res) => {
    const { deviceName, deviceType, ipAddress } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        await pool.request()
            .input('deviceName', sql.NVarChar, deviceName)
            .input('deviceType', sql.NVarChar, deviceType)
            .input('ipAddress', sql.NVarChar, ipAddress)
            .query('INSERT INTO Devices (DeviceName, DeviceType, IpAddress) VALUES (@deviceName, @deviceType, @ipAddress)');
        res.status(201).send('Device added successfully');
    } catch (error) {
        console.error('Error adding device:', error);
        res.status(500).send('Error adding device');
    }
};

// Update a device
exports.updateDevice = async (req, res) => {
    const { id } = req.params;
    const { deviceName, deviceType, ipAddress } = req.body;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('deviceName', sql.NVarChar, deviceName)
            .input('deviceType', sql.NVarChar, deviceType)
            .input('ipAddress', sql.NVarChar, ipAddress)
            .query('UPDATE Devices SET DeviceName = @deviceName, DeviceType = @deviceType, IpAddress = @ipAddress WHERE Device_ID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Device not found');
        }
        res.status(200).send('Device updated successfully');
    } catch (error) {
        console.error('Error updating device:', error);
        res.status(500).send('Error updating device');
    }
};

// Delete a device
exports.deleteDevice = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await sql.connect(dbConfig);
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Devices WHERE Device_ID = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send('Device not found');
        }
        res.status(200).send('Device deleted successfully');
    } catch (error) {
        console.error('Error deleting device:', error);
        res.status(500).send('Error deleting device');
    }
};
