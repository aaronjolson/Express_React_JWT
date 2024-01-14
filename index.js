const express = require('express');
const cors = require('cors');
const userController = require('./userController');
const authMiddleware = require('./authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("All Systems Functioning Normally.");
});

app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.get("/user", authMiddleware.requiresAuth, userController.getUserInfo);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});