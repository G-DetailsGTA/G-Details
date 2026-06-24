const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 SERVE FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// HOME PAGE
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* EMAIL SETUP (FIXED + MORE RELIABLE) */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* DEBUG EMAIL CONNECTION (IMPORTANT) */
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ EMAIL ERROR:", err);
  } else {
    console.log("📧 Gmail ready");
  }
});

/* BOOKING (FIXED PART ONLY) */
app.post("/book", async (req, res) => {
  console.log("📩 BOOKING RECEIVED:", req.body);

  try {
    // FIX: properly collect checkbox addons
    const addons = req.body.addons
      ? Array.isArray(req.body.addons)
        ? req.body.addons.join(", ")
        : req.body.addons
      : "None";

    const info = await transporter.sendMail({
      from: `"G-Details" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "🚗 New Booking - G-Details",
      html: `
        <h2>New Booking</h2>
        <p><b>Name:</b> ${req.body.name || "N/A"}</p>
        <p><b>Phone:</b> ${req.body.phone || "N/A"}</p>
        <p><b>Email:</b> ${req.body.email || "N/A"}</p>
        <p><b>Service Type:</b> ${req.body.serviceType || "N/A"}</p>
        <p><b>Car Type:</b> ${req.body.carType || "N/A"}</p>
        <p><b>Date:</b> ${req.body.date || "N/A"}</p>
        <p><b>Time:</b> ${req.body.time || "N/A"}</p>
        <p><b>Add-ons:</b> ${addons}</p>
        <p><b>Message:</b> ${req.body.message || "N/A"}</p>
      `
    });

    console.log("📧 EMAIL SENT SUCCESSFULLY:", info.response);

    return res.json({ success: true });

  } catch (err) {
    console.log("❌ EMAIL FAILED FULL:", err);

    return res.json({
      success: false,
      error: err.message
    });
  }
});

/* START */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 G-Details running"));