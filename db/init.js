const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS polls (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS options (
      id SERIAL PRIMARY KEY,
      poll_id INT REFERENCES polls(id),
      text TEXT NOT NULL,
      vote_count INT DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS votes_log (
      id SERIAL PRIMARY KEY,
      poll_id INT,
      option_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("Database initialized");
};

module.exports = {
  pool,
  initDB,
};
