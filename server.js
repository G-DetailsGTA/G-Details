const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* LOG REQUESTS */
app.use((req, res, next) => {
  console.log("🔥", req.method, req.url);
  next();
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/test", (req, res) => {
  res.send("OK");
});

/* =========================
   EMAIL TRANSPORT
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* VERIFY EMAIL ON START */
transporter.verify((err) => {
  if (err) {
    console.log("❌ EMAIL FAILED:", err);
  } else {
    console.log("📧 Gmail ready");
  }
});

/* =========================
   BOOKING ROUTE
========================= */
app.post("/book", (req, res) => {
  console.log("📩 BOOKING RECEIVED:", req.body);

  transporter.sendMail(
    {
      from: `G-Details <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚗 New G-Details Booking",
      html: `
        <h2>New Booking Received</h2>

        <p><strong>Name:</strong> ${req.body.name || ""}</p>
        <p><strong>Phone:</strong> ${req.body.phone || ""}</p>
        <p><strong>Email:</strong> ${req.body.email || ""}</p>

        <p><strong>Car Type:</strong> ${req.body.carType || ""}</p>
        <p><strong>Service:</strong> ${req.body.serviceType || ""}</p>

        <p><strong>Date:</strong> ${req.body.date || ""}</p>
        <p><strong>Time:</strong> ${req.body.time || ""}</p>

        <p><strong>Addons:</strong> ${req.body.addons || ""}</p>

        <p><strong>Message:</strong></p>
        <p>${req.body.message || ""}</p>
      `
    },
    (err, info) => {
      if (err) {
        console.log("❌ EMAIL ERROR:", err);
        return res.json({
          success: false,
          error: err.message
        });
      }

      console.log("📧 SENT:", info.response);

      res.json({
        success: true
      });
    }
  );
});

/* =========================
   START SERVER (IMPORTANT FOR RENDER)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});