const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/examDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model
const Student = require("./models/Student");

// Route: Get form page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Route: Fetch seat
app.post("/get-seat", async (req, res) => {
  const { credential } = req.body;

  try {
    const student = await Student.findOne({
      $or: [
        { admitCard: credential },
        { enrollment: credential }
      ]
    });

    if (!student) {
      return res.send("<h2>❌ Student not found</h2>");
    }

    res.send(`
      <h2>✅ Seat Details</h2>
      <p><strong>Seat No:</strong> ${student.seatNo}</p>
      <p><strong>Room No:</strong> ${student.roomNo}</p>
    `);

  } catch (err) {
    res.send("Error occurred");
  }
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});