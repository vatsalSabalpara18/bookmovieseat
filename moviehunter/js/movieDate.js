const movieTime = document.getElementById("movieTime")
const profile = document.getElementById("profile")
const logIn_btn = document.getElementById("logIn-btn")
const cinemaURL = "http://localhost:3000/cinemas"
const movieURL = "http://localhost:3000/movies"
const tImeURL = "http://localhost:3000/times"
const getMovieName = localStorage.getItem("movieTitle")
const getCinema_id = localStorage.getItem("cinema_id")
const time_list = document.getElementById("time-list")
const getUser = localStorage.getItem("userName")

const displayMovieTimeTitle = () => {
    movieTime.innerHTML = getMovieName + ' : ' + 'Available Dates'
}

const diplayMovieDates = async () => {
    try {
        // const cinemaResponse = await fetch(cinemaURL)
        // if(!cinemaResponse.ok) {
        //     console.log("Error in getting cinema data " ,cinemaResponse.statusText)
        // }
        // const cinemaData = await cinemaResponse.json()
        const movieResponse = await fetch(movieURL)
        if (!movieResponse.ok) {
            console.log("Error in getting movie data ", movieResponse.statusText)
        }
        const movieData = await movieResponse.json()
        const timeResponse = await fetch(tImeURL)
        if (!timeResponse.ok) {
            console.log("Error in getting time data ", timeResponse.statusText)
        }
        const timeData = await timeResponse.json()
        const movie_id = movieData.find((v) => v.cinema_id === getCinema_id && v.name === getMovieName)?.id
        const displayTimeObj = timeData.find((v) => v.cinemaID === getCinema_id && v.movieID === movie_id)
        const movieStartDate = displayTimeObj?.movieStartDate
        const movieEndDate = displayTimeObj?.movieEndDate
        const movieTimeArrString = JSON.stringify(displayTimeObj?.movieTimes)
        let printDates = "<ul id=date_ul>"
        for(let i = new Date(movieStartDate); i <= new Date(movieEndDate); i.setDate(i.getDate() + 1)){
            printDates += `
                <li class="date_li">
                    <a href="../pages/movieTime.html" class="date_a" onclick=handleTimeClick('${movieTimeArrString}','${i.toLocaleDateString('en-GB')}')>${i.toLocaleDateString('en-GB')}</a>
                </li>
            `
        }
        printDates += "</ul>"

        time_list.innerHTML = printDates

    } catch (error) {
        console.log(error)
    }
}

const handleTimeClick = (movieTimeArrString, movieDate) => {
    // console.log(movieTimeArrString, movieDate)
    localStorage.setItem("movieSelectedDate", movieDate)
    localStorage.setItem("movieSelectedTime",movieTimeArrString)
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

window.onload = function(){
    displayMovieTimeTitle()
    diplayMovieDates()
    // userLoggedIn()
    manageProfile()
}