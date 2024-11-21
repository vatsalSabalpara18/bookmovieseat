const movieTime = document.getElementById("movieTime")
const time_list = document.getElementById("time-list")
const profile = document.getElementById("profile")
const logIn_btn = document.getElementById("logIn-btn")
const cinemaURL = "http://localhost:3000/cinemas"
const movieURL = "http://localhost:3000/movies"
const tImeURL = "http://localhost:3000/times"
const getMovieName = localStorage.getItem("movieTitle")
const getMovieDate = localStorage.getItem("movieSelectedDate")
const getUser = localStorage.getItem("userName")


const diplayMovieTimeTitle = () => {
    movieTime.innerHTML = "Movie: " + getMovieName + " - Date: " + getMovieDate + " Available Time list"
}

const diplayMovieTime = () => {
    const getMovieTimeArr = JSON.parse(localStorage.getItem("movieSelectedTime"))
    let printTime = "<ul id=time_ul>";
    printTime += getMovieTimeArr.map((v) => {
        return`
            <li class="time_li">
                <a href="../pages/movieSeat.html" class="time_a" onclick=handleTimeClick('${v}') >${v}</a>
            </li>
        `
    }).join('')

    time_list.innerHTML = printTime
}

const handleTimeClick = (time) => {
    localStorage.setItem("selectedMovieTimeValue",time)
    if (localStorage.getItem("userName")) {
        window.location.href = "../pages/movieSeat.html"
    } else {
        window.location.href = "../../bookMovieLogin/index.html"
    }
}

// const userLoggedIn = () => {
//     if (localStorage.getItem("userName")) {
//         logIn.innerHTML = localStorage.getItem("userName")
//     }
// }

const manageProfile = () => {
    if (getUser) {
        profile.innerHTML = `
            <button onclick="myFunction()" class="dropbtn"><i class="fa fa-user" style="margin-right: 5px;" aria-hidden="true"></i>${(JSON.parse(getUser))?.userName}</button>
                <div id="myDropdown" class="dropdown-content">
                  <a href="../pages/myTicket.html"><i class="fa fa-ticket" style="margin-right: 10px;" aria-hidden="true"></i>My Tickets</a>
                  <a href="#" onclick=handleLogOut() ><i class="fa fa-sign-out" style="margin-right: 10px;" aria-hidden="true"></i>Log Out</a>
                </div>
        `
    }
}

function handleLogOut() {
    localStorage.removeItem("userName")
    profile.innerHTML = `
            <button id="logIn-btn" onclick=handleLogInClick() >Log In</button>
        `
    // logIn_btn.addEventListener("click" , function(){
    //     handleLogInClick()
    // }) 
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function handleLogInClick() {
    window.location.href = "../bookMovieLogin/index.html"
}


window.onload = function() {
    diplayMovieTimeTitle()
    diplayMovieTime()
    // userLoggedIn()
    manageProfile()
}