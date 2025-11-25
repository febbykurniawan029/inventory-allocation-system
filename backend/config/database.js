// Konfigurasi database Sequelize.
require("dotenv").config();

const dbConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT || 5432,
  // Matikan logging SQL di production.
  logging: process.env.NODE_ENV === "development" ? console.log : false,
};

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: {
    use_env_variable: 'DATABASE_URL', 
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
};
