const { sql, poolPromise } = require('../database/dbConfig');

async function getAllDevices() {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Devices');
    return result.recordset;
}

async function addDevice(device) {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('DeviceName', sql.VarChar, device.DeviceName)
        .input('DeviceType', sql.VarChar, device.DeviceType)
        .input('Manufacturer', sql.VarChar, device.Manufacturer)
        .input('IPAddress', sql.VarChar, device.IPAddress)
        .input('LastChecked', sql.DateTime, device.LastChecked)
        .query(`INSERT INTO Devices (DeviceName, DeviceType, Manufacturer, IPAddress, LastChecked) 
                VALUES (@DeviceName, @DeviceType, @Manufacturer, @IPAddress, @LastChecked)`);
    return result;
}

module.exports = { getAllDevices, addDevice };
