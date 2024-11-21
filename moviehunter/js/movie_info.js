const movie_info = document.getElementById("movie-info")
const movie_description_span = document.getElementById("movie-description-span")
const user_review_content = document.getElementById("user-review-content")
const getUser = localStorage.getItem("userName")
const movieURL = "http://localhost:3000/movies"
const movie_rating = "http://localhost:3000/movie_rating"
const userURL = "http://localhost:3000/users"
const getMovie_Title = localStorage.getItem("movieTitle")

const diplayMoviePoster = async () => {

    try {
        const movieResp = await fetch(movieURL)
        if(!movieResp.ok){
            console.log("Error in fetching movie Data: ", movieResp.statusText)
        }
        const movieData =await movieResp.json()

        const movie_rating_resp = await fetch(movie_rating)
        if (!movie_rating_resp.ok) {
            console.log("Error in fetching movie rating data: ", movie_rating_resp.statusText)
        }
        const movie_rating_data = await movie_rating_resp.json()

        const userResp = await fetch(userURL)
        if (!userResp.ok) {
            console.log("Error in fetching user data: ", userResp.statusText)
        }
        const userData = await userResp.json()
        const getMovie_info = movieData.find(item => item.name === getMovie_Title)
        const movie_poster = getMovie_info?.poster
        const movie_id = getMovie_info?.id
        const movie_description = getMovie_info?.description
        const movie_Rated = movie_rating_data.filter(item => item.movie_id === movie_id)
        const movie_rated_user = movie_Rated.length
        const count_movie_rating = movie_Rated.reduce((acc, item) => acc + item.rating ,0) / movie_rated_user
        const specificMovieData = movie_rating_data.filter((item) => item.movie_id === movie_id)

        movie_info.innerHTML = `
        <div id="movie_img">
                <img
                  src="../images/${movie_poster}"
                  width="200"
                  height="300"
                  alt="${getMovie_Title}"
                />
              </div>
              <div id="movie-description">
                <h1 id="movieTitle">${getMovie_Title}</h1>
                <div id="Rating-div">
                    <span class="${count_movie_rating > 0 && count_movie_rating < 1 ? "fa fa-star-half-full checked" : "fa fa-star"} ${count_movie_rating >= 1 ? "checked" : ""}"></span>
                    <span class="${count_movie_rating > 1 && count_movie_rating < 2 ? "fa fa-star-half-full checked" : "fa fa-star"} ${count_movie_rating >= 2 ? "checked" : ""}"></span>
                    <span class="${count_movie_rating > 2 && count_movie_rating < 3 ? "fa fa-star-half-full checked" : "fa fa-star"} ${count_movie_rating >= 3 ? "checked" : ""}"></span>
                    <span class="${count_movie_rating > 3 && count_movie_rating < 4 ? "fa fa-star-half-full checked" : "fa fa-star"} ${count_movie_rating >= 4 ? "checked" : ""}"></span>
                    <span class="${count_movie_rating > 4 && count_movie_rating < 5 ? "fa fa-star-half-full checked" : "fa fa-star"} ${count_movie_rating >= 5 ? "checked" : "" }"></span>
                  <span id="rating_span">(${movie_rated_user} votes)</span>
                </div>
                <button id="book-ticket-btn" onclick=handleBookTickets() >Book Tickets</button>
              </div>
    `
        movie_description_span.innerHTML = movie_description

        user_review_content.innerHTML = specificMovieData.map(item => {
            const userName = userData.find(userItem => userItem.id === item.user_id)?.userName
            return `
                <div class="user-review-info">
                  <div class="user-review-info-header">
                    <div class="user-review-info-icon">
                      <i class="fa fa-user fa-2x" style="margin-right: 5px;" aria-hidden="true"></i>
                    <span id="user-review-info-name">${userName}</span>
                    </div>
                    <div id="user-review-info-star">
                        <span class="${item.rating > 0 && item.rating < 1 ? "fa fa-star-half-full checked" : "fa fa-star"} ${item.rating >= 1 ? "checked" : ""}"></span>
                        <span class="${item.rating > 1 && item.rating < 2 ? "fa fa-star-half-full checked" : "fa fa-star"} ${item.rating >= 2 ? "checked" : ""}"></span>
                        <span class="${item.rating > 2 && item.rating < 3 ? "fa fa-star-half-full checked" : "fa fa-star"} ${item.rating >= 3 ? "checked" : ""}"></span>
                        <span class="${item.rating > 3 && item.rating < 4 ? "fa fa-star-half-full checked" : "fa fa-star"} ${item.rating >= 4 ? "checked" : ""}"></span>
                        <span class="${item.rating > 4 && item.rating < 5 ? "fa fa-star-half-full checked" : "fa fa-star"} ${item.rating >= 5 ? "checked" : "" }"></span>
                    </div>
                  </div>
                  <div class="user-review-comment">
                      <h3 id="user-review-comment-title">Comment</h3>
                      <span>${item.comment}</span>
                  </div>
                </div>
            `
        }).join("")


    } catch (error) {
        console.log(error)
    }
}

const handleBookTickets = () =>{
    window.location.href = "../pages/movieName.html"
}

function manageProfile() {
    if (getUser) {
        profile.innerHTML = `
            <button onclick="myFunction()" class="dropbtn"><i class="fa fa-user" style="margin-right: 5px;" aria-hidden="true"></i>${(JSON.parse(getUser))?.userName}</button>
                <div id="myDropdown" class="dropdown-content">
                  <a href="../pages/myTicket.html"><i class="fa fa-ticket" style="margin-right: 10px;" aria-hidden="true"></i>My Tickets</a>
                  <a href="#" onclick=handleLogOut() ><i class="fa fa-sign-out" style="margin-right: 10px;" aria-hidden="true"></i>Log Out</a>
                </div>
        `
    } else {
        window.location.href = "../index.html"
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
    window.location.href = "../index.html"
    // logIn_btn.addEventListener("click" , function(){
    //     handleLogInClick()
    // }) 
}

window.onload = function () {
    diplayMoviePoster()
    manageProfile()
}