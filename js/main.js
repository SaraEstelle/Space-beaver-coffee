const toggle = document.getElementById("theme-toggle");

toggle.addEventListener("click", () => {

console.log("CLICK");

document.body.classList.toggle("dark-mode");

});
