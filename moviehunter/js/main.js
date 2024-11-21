const cinema_list = document.getElementById("cinema-list");
const movie_list = document.getElementById("movie-list");
const profile = document.getElementById("profile")
const logIn_btn = document.getElementById("logIn-btn")
const cinemasURL = "http://localhost:3000/cinemas"
const moviesURL = "http://localhost:3000/movies"
const movie_rating = "http://localhost:3000/movie_rating"
const unqMoviesData = []

const getUser = localStorage.getItem("userName")
// const cinemaDatas = []

const displayAllCinemas = async () => {
    try {
        const cinemaResponse = await fetch(cinemasURL);
        if (!cinemaResponse.ok) {
            console.log("Error in display cinema list", cinemaResponse.statusText)
        }
        const cinemaData = await cinemaResponse.json()
        // console.log(cinemaData, "display cinema all")
        // cinemaDatas.push(...cinemaData);
        let print = "<ul id= cinema_ul >"
        print += cinemaData.map((v) => {
            return `
                <li class="cinema_li">
                    <a href="../pages/cinemaName.html" class="cinema_a" onclick="handleCinemasClick('${v.id}')" >${v.name}</a>
                </li>
            `
        }).join("")
        print += "</ul>"
        cinema_list.innerHTML = print
        // cinemaData.forEach((v) => {
        //     const cinema_div = document.createElement("div")
        //     cinema_div.setAttribute("class", "cinema")
        //     cinema_div.textContent = v.name
        //     cinema_list.appendChild(cinema_div)
        // })

    } catch (error) {
        console.log(error)
    }
}

const displayAllMovies = async () => {
    try {
        const movieResponse = await fetch(moviesURL)
        if (!movieResponse.ok) {
            console.log("Error in display movies list", movieResponse.statusText)
        }
        const moviesData = await movieResponse.json()

        const movie_ratingResponse = await fetch(movie_rating)
        if(!movie_ratingResponse.ok){
            console.log("Error in fetching movie rating data ", movie_ratingResponse.statusText)
        }
        const movie_ratingData = await movie_ratingResponse.json()

        const uniqueMovieArr = []
        moviesData.forEach((v) => {
            if (!uniqueMovieArr.some((ele) => ele.name === v.name)) {
                uniqueMovieArr.push(v)
            }
        })
        unqMoviesData.push(...uniqueMovieArr)
        console.log(unqMoviesData)
        let print = "<ul id=movie_ul>"

        print += uniqueMovieArr.map((v) => {
            const movie_rating_data = movie_ratingData.filter((item) => item.movie_id === v.id )
            // console.log(movie_rating_data)
            const movie_rated_user = movie_rating_data?.length
            const movie_rating_no = movie_rating_data.reduce((acc, item) => acc + item?.rating ,0) / movie_rated_user
            
            return `
            <li class="movie_li">
                <a href="../pages/movie_info.html" class="movie_a" onclick=handleMoviesClick('${v.id}')>${v.name}</a>
                    <div class="movie_div">
                        <span class="${movie_rating_no >= 0 && movie_rating_no < 1 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 1 ? "checked" : "" }"></span>
                        <span class="${movie_rating_no >= 1 && movie_rating_no < 2 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 2 ? "checked" : "" }"></span>
                        <span class="${movie_rating_no >= 2 && movie_rating_no < 3 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 3 ? "checked" : "" }"></span>
                        <span class="${movie_rating_no >= 3 && movie_rating_no < 4 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 4 ? "checked" : "" }"></span>
                        <span class="${movie_rating_no >= 4 && movie_rating_no < 5 ? "fa fa-star-half-full checked" : "fa fa-star"} ${movie_rating_no >= 5 ? "checked" : "" }"></span>
                        <span id="rating_span">${movie_rated_user > 0 ? `no users (${movie_rated_user})` : ""}</span>
                    </div>
                </li>
            `
        }).join("")
        print += "</ul>"
        movie_list.innerHTML = print
    } catch (error) {
        console.log(error)
    }
}

const handleMoviesClick = (movie_id) => {
    // console.log(unqMoviesData)
    const movieTitle = unqMoviesData.find((v) => v.id === movie_id)?.name
    // console.log(movieTitle)
    localStorage.setItem("movieTitle", movieTitle)
}

const handleCinemasClick = (cinema_id) => {
    // const cinemaTitle = cinemaDatas.find((v) => v.id === cinema_id)?.name
    // localStorage.setItem("cinemaTitle",cinemaTitle)
    localStorage.setItem("cinema_id", cinema_id)
}

// const userLoggedIn = () => {
//     if (localStorage.getItem("userName")) {
//         logIn.innerHTML = localStorage.getItem("userName")

//     }
// }

const clearLocalStorage = () => {
    const cinemaTitle = localStorage.getItem("cinemaTitle")
    const cinema_id = localStorage.getItem("cinema_id")
    const movieTitle = localStorage.getItem("movieTitle")
    const movieSelectedDate = localStorage.getItem("movieSelectedDate")
    const movieSelectedTime = localStorage.getItem("movieSelectedTime")
    const selectedMovieTimeValue = localStorage.getItem("selectedMovieTimeValue")
    if (cinemaTitle || cinema_id
        || movieSelectedDate || movieTitle || selectedMovieTimeValue
        || movieSelectedTime) {
        localStorage.removeItem("movieTitle")
        localStorage.removeItem("cinemaTitle")
        localStorage.removeItem("cinema_id")
        localStorage.removeItem("movieSelectedDate")
        localStorage.removeItem("movieSelectedTime")
        localStorage.removeItem("selectedMovieTimeValue")
    }
}



const manageProfile = () => {
    // if (getUser) {
    //     profile.innerHTML = ""
    //     const userNameSpan = document.createElement("span")
    //     userNameSpan.innerHTML = (JSON.parse(getUser))?.userName
    //     userNameSpan.style.fontSize = "20px"
    //     userNameSpan.style.fontWeight = "700"
    //     profile.appendChild(userNameSpan)

    //     // const br = document.getElementById("br")
    //     // profile.appendChild(br)

    //     const logOutButton = document.createElement("button")
    //     logOutButton.setAttribute("id", "logOut-btn")
    //     logOutButton.innerHTML = "Log Out"
    //     logOutButton.addEventListener("click", function () {
    //         localStorage.removeItem("userName")
    //         profile.innerHTML = `
    //         <button id="logIn-btn" >Log In</button>
    //     `
    //     logIn_btn.addEventListener("click" , function(){
    //         handleLogInClick()
    //     }) 
    //     })
    //     profile.appendChild(logOutButton)
    // } 
    if (getUser) {
        profile.innerHTML = `
            <button onclick="myFunction()" class="dropbtn"><i class="fa fa-user" aria-hidden="true" style="margin-right: 10px;"></i>${(JSON.parse(getUser))?.userName}</button>
                <div id="myDropdown" class="dropdown-content">
                  <a href="pages/myTicket.html"><i class="fa fa-ticket" style="margin-right: 10px;" aria-hidden="true"></i>My Tickets</a>
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

function handleLogInClick() {
    window.location.href = "bookMovieLogin/index.html"
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onload = function () {
    displayAllCinemas()
    displayAllMovies()
    // userLoggedIn()
    clearLocalStorage()
    manageProfile()
}
