const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY, DB_CONFIG } = require('./config');
const db = require('./db');

const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = bcrypt.hashSync(password, 12);
    const result = await db.query(
      "INSERT INTO Users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username.toLowerCase(), email.toLowerCase(), passwordHash]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: "User created successfully" });
    } else {
      res.status(400).send("Username or email already exists");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = async (req, res) => {
  var { email, username, password } = req.body;

  if (email) {
    email = email.toLowerCase();
  }
  if (username) {
    username = username.toLowerCase();
  }

  try {
    const result = await db.query(
      "SELECT password_hash, username, email FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const payload = {
      email: user.email,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 1 day expiration
    };
    const token = jwt.sign(payload, SECRET_KEY);

    res.status(200).json({ token: token, message: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const getUserInfo = async (req, res) => {
  const { email, username } = req.query;

  if (!email && !username) {
    return res.status(400).json({ message: "Query parameter 'email' or 'username' is required" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 OR username = $2",
      [email ? email.toLowerCase() : null, username ? username.toLowerCase() : null]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    const userInfo = {
      username: user.username,
      email: user.email
      // Include other relevant user information
    };

    res.status(200).json({ userInfo: userInfo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user information" });
  }
};

module.exports = { signup, login, getUserInfo };