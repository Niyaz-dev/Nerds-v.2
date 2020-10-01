

var popup = document.querySelector(".modal");
var close = popup.querySelector(".modal__close");
var write_us = document.querySelector(".location__write-us-btn");

write_us.addEventListener("click", function (evt) {
evt.preventDefault();
popup.classList.add("modal--show");	
});

close.addEventListener("click", function (evt) {
evt.preventDefault();
popup.classList.remove("modal--show");	
});

