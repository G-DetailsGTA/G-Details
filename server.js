const express = require("express");
const sqlite3 = require("sqlite3").verbose();
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

/* =========================
   DATABASE SETUP
========================= */
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
db.run(`
CREATE TABLE IF NOT EXISTS bookings (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
phone TEXT,
email TEXT,
carType TEXT,
serviceType TEXT,
date TEXT,
time TEXT,
addons TEXT,
message TEXT
)
`);
});

/* =========================
   TEST ROUTE (IMPORTANT)
========================= */
app.get("/test", (req, res) => {
res.send("SERVER WORKING");
});

/* =========================
   BOOKING ROUTE
========================= */
app.post("/book", (req, res) => {

const {
name,
phone,
email,
carType,
serviceType,
date,
time,
addons,
message
} = req.body;

/* SAVE TO DB */
db.run(`
INSERT INTO bookings 
(name, phone, email, carType, serviceType, date, time, addons, message)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
[name, phone, email, carType, serviceType, date, time, addons, message]
);

/* EMAIL */
const transporter = nodemailer.createTransport({
service: "gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}
});

transporter.sendMail({
from: "G-DETAILS",
to: process.env.EMAIL_USER,
subject: "🚗 New Booking",
html: `
<h2>New Booking</h2>

<p><b>Name:</b> ${name}</p>
<p><b>Phone:</b> ${phone}</p>
<p><b>Email:</b> ${email}</p>

<hr>

<p><b>Car:</b> ${carType}</p>
<p><b>Service:</b> ${serviceType}</p>

<p><b>Date:</b> ${date}</p>
<p><b>Time:</b> ${time}</p>

<hr>

<p><b>Add-ons:</b><br>${addons}</p>

<p><b>Message:</b> ${message}</p>
`
});

res.json({ success: true });
});

/* =========================
   GET BOOKINGS (ADMIN FIX)
========================= */
app.get("/api/bookings", (req, res) => {
db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
if (err) {
console.log("DB ERROR:", err);
return res.json([]);
}
res.json(rows);
});
});

/* =========================
   DELETE BOOKING (ADMIN)
========================= */
app.delete("/api/bookings/:id", (req, res) => {
db.run("DELETE FROM bookings WHERE id = ?", [req.params.id], (err) => {
if (err) {
console.log(err);
return res.json({ success: false });
}
res.json({ success: true });
});
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});