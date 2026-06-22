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
        const res = await fetch("/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (data.success) {
          alert("Booking sent successfully!");
          form.reset();
        } else {
          alert("Failed: " + (data.error || "Unknown error"));
        }

      } catch (err) {
        alert("Server not reachable");
      }
    });
  }

});

/* IMAGE MODAL */
function openImg(src){
  document.getElementById("imgModal").style.display = "flex";
  document.getElementById("modalImg").src = src;
}

function closeModal(){
  document.getElementById("imgModal").style.display = "none";
}

/* VIDEO MODAL */
function openVideo(src){
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");
  modal.style.display = "flex";
  video.src = src;
  video.play();
}

function closeVideo(){
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("modalVideo");
  modal.style.display = "none";
  video.pause();
  video.src = "";
}