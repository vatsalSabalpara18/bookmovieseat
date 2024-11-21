let menu = document.querySelector('.menu')
let sidebar = document.querySelector('.sidebar')
let mainContent = document.querySelector('.main--content')
const activeLink = document.getElementById("active--link")

menu.onclick = function () {
    sidebar.classList.toggle('active')
    mainContent.classList.toggle('active')
}
activeLink.onclick = function() {
    activeLink.classList.toggle('active')
}

const cinema_module = document.getElementById("cinema-module");
const movie_module = document.getElementById("movie-module");
const time_module = document.getElementById("time-module");
const seat_module = document.getElementById("seat-module");

function openCinemaContainer() {
    // cinema_module.style.display = "block"
    // movie_module.style.display = "none"
    // time_module.style.display = "none"
    // seat_module.style.display = "none"
}

function openMovieContainer() {
    // movie_module.style.display = "block"
    // cinema_module.style.display = "none"
    // time_module.style.display = "none"
    // seat_module.style.display = "none"
}

function openTimeContainer() {
    // time_module.style.display = "block"
    // seat_module.style.display = "none"
    // movie_module.style.display = "none"
    // cinema_module.style.display = "none"
}

function openSeatContainer() {
    // seat_module.style.display = "block"
    // time_module.style.display = "none"
    // movie_module.style.display = "none"
    // cinema_module.style.display = "none"

}

// window.onload = function () {
//     openCinemaContainer()
//     displayMoviesList()
//     getTable()
//     displayCinemaList()
//     displayCinemaNames()
//     displayTimeList()
// }