require('dotenv').config();

console.log('Environment Variables:');
console.log(`DB_SERVER: ${process.env.DB_SERVER}`);
console.log(`DB_DATABASE: ${process.env.DB_DATABASE}`);
console.log(`DB_USERNAME: ${process.env.DB_USERNAME}`);
console.log(`DB_PASSWORD: ${process.env.DB_PASSWORD}`);
console.log(`DB_AUTHENTICATION: ${process.env.DB_AUTHENTICATION}`);
console.log(`DB_DOMAIN: ${process.env.DB_DOMAIN}`);

// The Database SQL configuration
const dbConfig = {
    server: process.env.DB_SERVER || 'WILL',
    database: process.env.DB_DATABASE || 'HomeGuardHub',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUSTCERT === 'true',
    },
    authentication: {
        type: process.env.DB_AUTHENTICATION === 'SQL' ? 'default' : 'ntlm',
        options: {
            userName: process.env.DB_USERNAME || 'willbelding',
            password: process.env.DB_PASSWORD || '', 
            domain: process.env.DB_DOMAIN || '',
        },
    },
};

console.log('Database Configuration:', dbConfig);

const connectToDatabase = async () => {
    try {
        await require('mssql').connect(dbConfig);
        console.log('Connected to the SQL Server database successfully.');
    } catch (err) {
        console.error('Failed to connect to the database:', err.message);
    }
};

module.exports = { connectToDatabase };
