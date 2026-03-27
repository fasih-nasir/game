
document.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
    const scrollPercent = (scrollTop / docHeight) * 100;
  
    const topBtn = document.querySelector(".top_btn_1");
  
    if (scrollPercent >= 100) {
      topBtn.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`; // Font Awesome icon
    } else {
      topBtn.innerHTML = `${scrollPercent.toFixed(0)}`;
    }
  });
  
// ===================== FOOTER CODE START ======================
var header= document.getElementById("header");
if (header) {
  // ===================== header CODE START ======================
  fetch("../header.html")
    .then((e) => e.text())
    .then((data) => {
      header.innerHTML = data;
    });
}
// ===================== FOOTER CODE END ======================


  // ===================== FOOTER CODE START ======================
var footer = document.getElementById("footer");
if (footer) {
  // ===================== footer CODE START ======================
  fetch("../footer.html")
    .then((e) => e.text())
    .then((data) => {
      footer.innerHTML = data;
    });
}
// ===================== FOOTER CODE END ======================
