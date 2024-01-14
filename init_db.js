const { Pool } = require('pg');

// Database configuration
const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "MYDATA",
  user: "your_username",
  password: "your_password"
};

// Create a pool to manage connections
const pool = new Pool(dbConfig);

// Connect to the database and create USERS table
const createUsersTable = async () => {
  const client = await pool.connect();

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        create_date DATE,
        last_login_date DATE
      )
    `;
    await client.query(createTableQuery);
    console.log("USERS table created successfully.");
  } catch (error) {
    console.error("Error creating USERS table:", error);
  } finally {
    client.release();
  }
};

createUsersTable();