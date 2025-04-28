// This is my database configuration. It uses environment
// variables to establish a Postgres connection.
module.exports = {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    DB: process.env.DB_NAME,
    dialect: "postgres",
    PORT: process.env.DB_PORT,
    pool: {
      max: 5, // This sets the maximum amount of open connections.
      min: 0, // This obviously sets the minimum amount of open connections.
      acquire: 30000, // This sets the maximum amount of time in ms to get a connection before an error occurs.
      idle: 10000 // This sets the maximym amount of time in ms that a connection can idle before the release.
    }
  };