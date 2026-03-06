const button = document.getElementById("toggleTheme")

button.addEventListener("click", () => {

document.body.classList.toggle("dark")

if(document.body.classList.contains("dark")){
button.textContent = "Mode Jour"
}
else{
button.textContent = "Mode Nuit"
}

})