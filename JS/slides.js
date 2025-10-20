const track = document.querySelector(".slide-track");
const groups = document.querySelectorAll(".slide-group");
const leftBtn = document.querySelector(".arrow.left");
const rightBtn = document.querySelector(".arrow.right");

let currentGroup = 0;

function updateSlider() {
  const offset = -currentGroup * 100;
  track.style.transform = `translateX(${offset}%)`;
}

rightBtn.addEventListener("click", () => {
  if (currentGroup < groups.length - 1) {
    currentGroup++;
    updateSlider();
  }
});

leftBtn.addEventListener("click", () => {
  if (currentGroup > 0) {
    currentGroup--;
    updateSlider();
  }
});
