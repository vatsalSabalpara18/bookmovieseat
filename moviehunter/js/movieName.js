const main_div = document.getElementById("main");
const profile = document.getElementById("profile")
const logIn_btn = document.getElementById("logIn-btn")
const movieName = document.getElementById("movieName")
const cinema_list = document.getElementById("cinema-list")
const logIn = document.getElementById("logIn")
const cinemaURL = "http://localhost:3000/cinemas"
const movieURL = "http://localhost:3000/movies"
const getMovieName = localStorage.getItem("movieTitle")
const getUser = localStorage.getItem("userName")

const diplayMovieTitle = () => {
    // const h1Ele = document.createElement("h1")
    // h1Ele.setAttribute("id", "movieTitle")
    // h1Ele.textContent = localStorage.getItem("movieTitle");
    // main_div.appendChild(h1Ele)
    movieName.innerHTML = getMovieName
}

const diplayAllCinemas = async () => {
    try {
        const cinemaResponse = await fetch(cinemaURL)
        if(!cinemaResponse.ok){
            console.log("Error in getting cinema data", cinemaResponse.statusText)
        }
        const cinemaData = await cinemaResponse.json()
        const movieResponse = await fetch(movieURL)
        if(!movieResponse.ok){
            console.log("Error in getting movie data", movieResponse.statusText)
        }
        const movieData = await movieResponse.json()
        const cinemaIdArr = movieData.filter((v) => v.name === getMovieName).map((v) => v.cinema_id)
        const cinema_listArr = cinemaData.reduce((acc , v) => {
            if(cinemaIdArr.includes(v.id)){
                acc.push(v)
            }
            return acc
        } ,[])
        console.log(cinemaIdArr, cinema_listArr)
        let print = "<ul id=cinema_ul>"
        print += cinema_listArr.map((v) => {
            return `
                <li class ="cinema_li">
                  <a href="../pages/movieDate.html" class="cinema_a" onclick=handleCinemaClick('${v.id}')>${v.name}</a>
                </li>
            `
        }).join("")
        print += "<ul>"
        cinema_list.innerHTML = print
        // const cinema_div = document.getElementById("div")
        // cinema_div.setAttribute("id", "cinema-list")

    } catch (error) {
        console.log(error)
    }

}
const handleCinemaClick = (cinemaId) => {
    console.log(cinemaId)
    localStorage.setItem("cinema_id", cinemaId)
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
window.onload = function () {
    diplayMovieTitle()
    diplayAllCinemas()
    // userLoggedIn()
    manageProfile()
}