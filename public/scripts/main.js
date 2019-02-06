//Nav menu
document.querySelector(".menuIcon").addEventListener("click", () =>{
animateMenu();
});

document.querySelector(".closeIcon").addEventListener("click", () =>{
  animateMenu();
});

function animateMenu(){
  document.querySelector(".nav").classList.toggle("navHidden");
  document.querySelector(".menuIcon").classList.toggle("navHidden");
  document.querySelector(".closeIcon").classList.toggle("navHidden");
  document.querySelector(".navLinks").classList.toggle("navLinksHidden");
  document.querySelector("body").classList.toggle("noScroll");
}
