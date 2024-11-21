const cinemaName = document.getElementById("cinemaName")
const movie_list = document.getElementById("movie-list")
const logIn = document.getElementById("logIn")
const cinemasURL = "http://localhost:3000/cinemas"
const moviesURL = "http://localhost:3000/movies"
const movie_rating = "http://localhost:3000/movie_rating"
const getCinema_id = localStorage.getItem("cinema_id")
const movieData_list = []
const getUser = localStorage.getItem("userName")

const displayCinemaTitle = async () => {
    try {
        const cinemaResponse = await fetch(cinemasURL);
        if (!cinemaResponse.ok) {
            console.log("Error in display cinema list", cinemaResponse.statusText)
        }
        const cinemaData = await cinemaResponse.json()
        const cinemaTitle = cinemaData.find((v) => v.id === getCinema_id)?.name
        cinemaName.innerHTML = cinemaTitle + " : Available Movies" 
    } catch (error) {
        console.log(error)
    }

}

const diplayAllCinemasMovies = async () => {
    try {
        const movieResponse = await fetch(moviesURL)
        if (!movieResponse.ok) {
            console.log("Error in display movies list", movieResponse.statusText)
        }
        const moviesData = await movieResponse.json()

        const movie_ratingResponse = await fetch(movie_rating)
        if (!movie_ratingResponse.ok) {
            console.log("Error in fetching movie rating data ", movie_ratingResponse.statusText)
        }
        const movie_ratingData = await movie_ratingResponse.json()

        const cinemaMovies = moviesData.filter((v) => v.cinema_id === getCinema_id)
        movieData_list.push(...cinemaMovies)
        // console.log(cinemaMovies)
        let printMovies = "<ul id=movie_ul>"

        printMovies += cinemaMovies.map((v) => {
            const movie_rating_data = movie_ratingData.filter((item) => item.movie_id === v.id)
            // console.log(movie_rating_data)
            const movie_rated_user = movie_rating_data?.length
            const movie_rating_no = movie_rating_data.reduce((acc, item) => acc + item?.rating, 0) / movie_rated_user
            return`
                <li class="movie_li">
                    <a href="../pages/movieDate.html" class="movie_a" onclick=handleMovieClick('${v.id}')>${v.name}</a>
                    <div class="movie_div">
                        <span class="${movie_rating_no >= 0 && movie_rating_no < 1 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 1 ? "checked" : ""}"></span>
                        <span class="${movie_rating_no >= 1 && movie_rating_no < 2 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 2 ? "checked" : ""}"></span>
                        <span class="${movie_rating_no >= 2 && movie_rating_no < 3 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 3 ? "checked" : ""}"></span>
                        <span class="${movie_rating_no >= 3 && movie_rating_no < 4 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 4 ? "checked" : ""}"></span>
                        <span class="${movie_rating_no >= 4 && movie_rating_no < 5 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 5 ? "checked" : ""}"></span>
                        <span id="rating_span">${movie_rated_user > 0 ? `no users (${movie_rated_user})` : ""}</span>
                    </div>
                </li>
            `
        }).join("")

        printMovies += "</ul>"

        movie_list.innerHTML = printMovies
        
    } catch (error) {
        console.log(error)
    }
}

const handleMovieClick = (movie_id) => {
    const movieName = movieData_list.find((v) => v.id === movie_id)?.name

    localStorage.setItem("movieTitle",movieName)
}

// const userLoggedIn = () => {
//     if(localStorage.getItem("userName")){
//         logIn.innerHTML = localStorage.getItem("userName")
//     }
// }

function manageProfile() {
    if (getUser) {
        profile.innerHTML = `
            <button onclick="myFunction()" class="dropbtn"><i class="fa fa-user" style="margin-right: 5px;" aria-hidden="true"></i>${(JSON.parse(getUser))?.userName}</button>
                <div id="myDropdown" class="dropdown-content">
                  <a href="../pages/myTicket.html"><i class="fa fa-ticket" style="margin-right: 10px;" aria-hidden="true"></i> My Tickets</a>
                  <a href="#" onclick=handleLogOut() ><i class="fa fa-sign-out" style="margin-right: 10px;" aria-hidden="true"></i>Log Out</a>
                </div>
        `
    }
}

function handleLogInClick() {
    window.location.href = "../bookMovieLogin/index.html"
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
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

window.onload = function () {   
    manageProfile()
    displayCinemaTitle()
    diplayAllCinemasMovies()
    // userLoggedIn()
}