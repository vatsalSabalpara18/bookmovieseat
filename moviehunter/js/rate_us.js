const rate_us_Heading = document.getElementById("rate-us-Heading")
const rate_us_form = document.getElementById("rate-us-form")
const stars =  document.getElementsByClassName("star");
const output = document.getElementById("output");
const comment = document.getElementById("comment")
const cinemasURL = "http://localhost:3000/cinemas"
const moviesURL = "http://localhost:3000/movies"
const ticketOrder = "http://localhost:3000/ticketOrder"
const movie_rating = "http://localhost:3000/movie_rating"
const getUser = localStorage.getItem("userName")
const getUser_id = (JSON.parse(getUser))?.id
const getRating_info = JSON.parse(localStorage.getItem("Rating_info"))
let getRatedData_id = null;
let rating_number = null;

function handleRateing(n) {
    remove();
    for (let i = 0; i < n; i++) {
        if (n == 1) cls = "one";
        else if (n == 2) cls = "two";
        else if (n == 3) cls = "three";
        else if (n == 4) cls = "four";
        else if (n == 5) cls = "five";
        stars[i].className = "star " + cls;
    }
    rating_number = n;
    output.innerText = "You Choose: " + n + " out of 5";
}

function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}

async function fetchUpdateData() {
    if(getRating_info?.isUpdate){
        const movie_ratingResponse = await fetch(movie_rating)
        if(!movie_ratingResponse?.ok){
            console.log("Error In fetching movire rating data", movie_ratingResponse.statusText)
        }
        const movie_ratingData = await movie_ratingResponse.json()

        const findRatedData = movie_ratingData.find((item) => ((item.movie_id === getRating_info?.movie_id) && (item.cinema_id === getRating_info?.cinema_id) && (item.user_id === getRating_info?.user_id)))
        if(findRatedData){
            getRatedData_id = findRatedData?.id
            handleRateing(findRatedData?.rating)
            comment.value = findRatedData?.comment
        }
    } 
}

const handleSubmit = async () => {
    try {
        const movie_rating_obj = {
            ...getRating_info,
            rating: rating_number,
            comment: comment.value
        }
        console.log(movie_rating_obj)
        await fetch(getRating_info?.isUpdate ? `${movie_rating}/${getRatedData_id}` : movie_rating , {
            method: getRating_info?.isUpdate ? 'PUT' : 'POST',
            headers:{
                'Content-Type': "application/json"
            },
            body: JSON.stringify(movie_rating_obj)
        })
        rating_number = null
        getRatedData_id = null
    } catch (error) {
        console.log(error)   
    }
}

rate_us_form.addEventListener("submit", function(){
    handleSubmit()
})


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
    manageProfile()
    fetchUpdateData()
}