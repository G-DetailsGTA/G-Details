const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 THIS IS WHAT SERVES YOUR WEBSITE
app.use(express.static(path.join(__dirname, "public")));

// HOME PAGE (your real website)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* EMAIL SETUP */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* BOOKING */
app.post("/book", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"G-Details" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚗 New Booking - G-Details",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${req.body.name}</p>
        <p><b>Phone:</b> ${req.body.phone}</p>
        <p><b>Service:</b> ${req.body.service}</p>
        <p><b>Date:</b> ${req.body.date}</p>
        <p><b>Time:</b> ${req.body.time}</p>
        <p><b>Message:</b> ${req.body.message}</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 G-Details running"));