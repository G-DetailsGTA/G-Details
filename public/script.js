document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      const payload = {
        name: formData.get("name") || "",
        phone: formData.get("phone") || "",
        email: formData.get("email") || "",
        carType: formData.get("carType") || "",
        serviceType: formData.get("serviceType") || "",
        date: formData.get("date") || "",
        time: formData.get("time") || "",
        message: formData.get("message") || "",
        addons: Array.from(
          document.querySelectorAll(".addons-box input:checked")
        ).map(el => el.value).join(", ") || "None"
      };

      try {
        const res = await fetch("https://g-details.onrender.com/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok && data.success) {
          alert("Booking sent successfully!");
          form.reset();
        } else {
          alert("Failed: " + (data.error || "Unknown error"));
        }

      } catch (err) {
        console.error(err);
        alert("Server not reachable");
      }
    });
  }

});

/* IMAGE MODAL */
function openImg(src){
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("modalImg");
  if (!modal || !img) return;

  modal.style.display = "flex";
  img.src = src;
}

function closeModal(){
  const modal = document.getElementById("imgModal");
  const img = document.getElementById("modalImg");

  if (modal) modal.style.display = "none";
  if (img) img.src = "";
}

/* VIDEO MODAL */
function openVideo(src){
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");
  if (!modal || !video) return;

  modal.style.display = "flex";
  video.src = src;
  video.play();
}

function closeVideo(){
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");

  if (modal) modal.style.display = "none";
  if (video) {
    video.pause();
    video.src = "";
  }
}