const myTicket = document.getElementById("myTicket")
const ticket_list = document.getElementById("ticket-list")
const cinemasURL = "http://localhost:3000/cinemas"
const moviesURL = "http://localhost:3000/movies"
const ticketOrder = "http://localhost:3000/ticketOrder"
const movie_rating = "http://localhost:3000/movie_rating"
const getUser = localStorage.getItem("userName")
const getUser_id = (JSON.parse(getUser))?.id


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

const diplayAllMyTickets = async () => {
    try {
        const cinemaResponse = await fetch(cinemasURL);
        if (!cinemaResponse.ok) {
            console.log("Error In getting cinema Data: ", cinemaResponse.statusText)
        }
        const cinemaData = await cinemaResponse.json()

        const movieResponse = await fetch(moviesURL);
        if (!movieResponse.ok) {
            console.log("Error In getting movie data: ", movieResponse.statusText)
        }
        const movieData = await movieResponse.json()

        const ticketOrderResponse = await fetch(ticketOrder);
        if (!ticketOrderResponse.ok) {
            console.log("Error In getting ticket Order data: ", ticketOrderResponse.statusText)
        }
        const ticketOrderData = await ticketOrderResponse.json()

        const movie_ratingResponse = await fetch(movie_rating)
        if(!movie_ratingResponse.ok){
            console.log("Error in fetching movie rating data", movie_ratingResponse.statusText)
        }
        const movie_ratingData = await movie_ratingResponse.json()

        const getUserTicketOrderData = ticketOrderData.filter(item => item?.user_id == getUser_id)

        let print = "<ul id=myTicket_ul>"
        print += getUserTicketOrderData.map((item) => {
            const getMovieInfo = movieData.find((movieItem) => movieItem?.id === item.movie_id)
            const movieName = getMovieInfo?.name
            const moviePoster = getMovieInfo?.poster
            const getCinemaInfo = cinemaData.find((cinemaItem) => cinemaItem?.id === item.cinema_id)
            const cinemaName = getCinemaInfo?.name

            const check_rating = movie_ratingData.some((movie_rating_item) => ((movie_rating_item.movie_id == item.movie_id) && (movie_rating_item.user_id == item.user_id)))

            return `
                <li class="myTicket_li">
                    <div class="myTicket_div">
                        <img src="../images/${moviePoster}" height="200" width="150" id="movie_img" alt="#${movieName}">
                        <div class="subMyTicket_div">
                            <table>
                                <tr>
                                    <td>Movie Name</td>
                                    <td></td>
                                    <td>${movieName}</td>
                                </tr>
                                <tr>
                                    <td>Cinema Name</td>
                                    <td></td>
                                    <td>${cinemaName}</td>
                                </tr>
                                <tr>
                                    <td>Movie Date</td>
                                    <td></td>
                                    <td>${item?.movieDate}</td>
                                </tr>
                                <tr>
                                    <td>Movie Time</td>
                                    <td></td>
                                    <td>${item?.movieTime}</td>
                                </tr>
                                <tr>
                                    <td>Seat No.</td>
                                    <td></td>
                                    <td>${item?.seatNo}</td>
                                </tr>
                                <tr>
                                    <td>Per Seat Price</td>
                                    <td></td>
                                    <td>${item?.perSeatPrice}</td>
                                </tr>
                                <tr>
                                    <td>Total Amount</td>
                                    <td></td>
                                    <td>${item?.totalAmount}</td>
                                </tr>
                            </table>
                        </div>
                            <button id="rate-us-button" onclick=handleRateUsClick('${item.movie_id}','${item.user_id}','${item.cinema_id}','${check_rating}') >${check_rating ? 'Update Rating' : 'Rate Us!'}</button>
                    </div>
                </li>
            `
        }).join("")
        print += "</ul>"

        ticket_list.innerHTML = print

    } catch (error) {
        console.error(error)
    }
}

const handleRateUsClick = (movie_id, user_id, cinema_id, isUpdate) => {
    const isUpdated = isUpdate === 'true' ? true : false
    const rating_info = {
        user_id,
        movie_id,
        cinema_id,
        isUpdate: isUpdated
        
    }
    localStorage.setItem("Rating_info",JSON.stringify(rating_info))
    window.location.href = "../pages/rate_us.html"
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
    diplayAllMyTickets()
    manageProfile()
}