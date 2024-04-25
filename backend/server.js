const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const DataManager = require("./dataManager");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const dataManager = new DataManager(
  "localhost",
  "root",
  "solene1209?",
  "reserve"
);

dataManager.Connect();

// Route de connexion
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  const sql = "SELECT * FROM utilisateurs WHERE nickname = ?";
  dataManager.query(sql, [username], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (data.length === 1) {
      const user = data[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error("Error comparing passwords: " + err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result) {
          return res.json({ message: "Login successful", user });
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  });
});

// Route de création de compte
app.post("/signup", (req, res) => {
  const { nickname, email, password } = req.body;
  if (!nickname || !email || !password) {
    return res.status(400).json({ error: "Nickname, email, and password are required." });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const sql = "INSERT INTO utilisateurs (nickname, email, password) VALUES (?, ?, ?)";
  dataManager.query(sql, [nickname, email, hashedPassword], (err, data) => {
    if (err) {
      console.error("Error querying the database: " + err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({ message: "Signup successful", user: data });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

process.on("exit", () => {
  dataManager.Disconnect();
});
