document.addEventListener("DOMContentLoaded", () => {

/* =========================
   BOOKING SYSTEM
========================= */
const form = document.getElementById("form");

if (form) {
form.addEventListener("submit", async (e) => {
e.preventDefault();

/* SAFE DATA COLLECTION */
const formData = new FormData(form);

const name = formData.get("name") || "";
const phone = formData.get("phone") || "";
const email = formData.get("email") || "";
const carType = formData.get("carType") || "";
const serviceType = formData.get("serviceType") || "";
const date = formData.get("date") || "";
const time = formData.get("time") || "";
const message = formData.get("message") || "";

/* ADD-ONS COLLECTION */
let addons = [];
document.querySelectorAll(".addons-box input:checked")
.forEach(i => addons.push(i.value));

const payload = {
name,
phone,
email,
carType,
serviceType,
date,
time,
addons: addons.join(", ") || "None",
message
};

console.log("📦 Booking Payload:", payload);

/* SEND TO SERVER */
try {
const res = await fetch("/book", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(payload)
});

const data = await res.json();

if (data.success) {
alert("✅ Booking sent successfully!");
form.reset();
} else {
alert("❌ Failed to send booking");
}

} catch (err) {
console.error("Booking error:", err);
alert("❌ Server error. Try again.");
}

});
}

/* =========================
   IMAGE MODAL
========================= */
window.openImg = function(src) {
const modal = document.getElementById("imgModal");
const img = document.getElementById("modalImg");

if (!modal || !img) return;

modal.style.display = "flex";
img.src = src;
};

window.closeModal = function() {
const modal = document.getElementById("imgModal");
const img = document.getElementById("modalImg");

if (modal) modal.style.display = "none";
if (img) img.src = "";
};

/* =========================
   VIDEO MODAL
========================= */
window.openVideo = function(src) {
const modal = document.getElementById("videoModal");
const video = document.getElementById("modalVideo");

if (!modal || !video) return;

modal.style.display = "flex";
video.src = src;
video.play();
};

window.closeVideo = function() {
const modal = document.getElementById("videoModal");
const video = document.getElementById("modalVideo");

if (modal) modal.style.display = "none";
if (video) {
video.pause();
video.src = "";
}
};

});
app.get("/api/bookings", (req, res) => {
db.all("SELECT * FROM bookings ORDER BY id DESC", (err, rows) => {
if (err) {
console.log("DB ERROR:", err);
return res.json([]);
}
res.json(rows);
});
});