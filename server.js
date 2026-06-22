const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log("🔥 SERVER STARTING...");

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("G-Details API Running");
});

/* EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.verify((err) => {
  if (err) {
    console.log("❌ EMAIL FAILED:", err);
  } else {
    console.log("📧 Gmail ready");
  }
});

/* BOOKING ROUTE */
app.post("/book", async (req, res) => {
  console.log("📩 BOOKING RECEIVED:", req.body);

  try {
    await transporter.sendMail({
      from: `"G-Details" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Booking",
      html: `
        <h2>New Booking</h2>
        <p>${JSON.stringify(req.body, null, 2)}</p>
      `
    });

    console.log("📧 EMAIL SENT");
    res.json({ success: true });

  } catch (err) {
    console.log("❌ EMAIL ERROR:", err);
    res.json({ success: false, error: err.message });
  }
});

/* START SERVER (IMPORTANT FOR RENDER) */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Running on port", PORT);
});