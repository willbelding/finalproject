const sql = require('mssql');
require('dotenv').config();

const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUSTCERT === 'true',
    },
    authentication: {
        type: process.env.DB_AUTHENTICATION === 'Windows' ? 'ntlm' : 'default',
        options: {
            userName: process.env.DB_USERNAME,
            password: process.env.DB_PASS || '',
        },
    },
};

const connectToDatabase = async () => {
    try {
        await sql.connect(dbConfig);
        console.log('Connected to the SQL Server database successfully.');
    } catch (err) {
        console.error('Failed to connect to the database:', err.message);
    }
};

module.exports = {
    sql,
    connectToDatabase,
};