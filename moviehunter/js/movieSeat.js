const movieSeat = document.getElementById("movieSeat");
const seat_list = document.getElementById("seat-list");
const profile = document.getElementById("profile")
const logIn_btn = document.getElementById("logIn-btn")
const movieURL = "http://localhost:3000/movies"
const seatURL = "http://localhost:3000/seats"
const ticketOrderURL = "http://localhost:3000/ticketOrder"
const getUser = localStorage.getItem("userName")

let movie_Id;
let getSeatObj;
const getCinema_id = localStorage.getItem("cinema_id")
const getMovieName = localStorage.getItem("movieTitle")
const getMovieDate = localStorage.getItem("movieSelectedDate")
const getMovieSelectedTime = localStorage.getItem("selectedMovieTimeValue");

const selectedSeatArr = []

const diplayMovieSeatTitle = () => {
    movieSeat.innerHTML = "Movie: " + getMovieName + " - Date: " + getMovieDate + " " + getMovieSelectedTime + " Available Seats"
}

const diplayMovieSeats = async () => {
    try {
        const movieResponse = await fetch(movieURL)
        if (!movieResponse.ok) {
            console.log("Error in getting movie data", movieResponse.statusText)
        }
        const movieData = await movieResponse.json()
        const seatResponse = await fetch(seatURL)
        if (!seatResponse.ok) {
            console.log("Error in getting movie seat data", seatResponse.statusText)
        }
        const seatData = await seatResponse.json()
        movie_Id = movieData.find((v) => v.cinema_id === getCinema_id && v.name === getMovieName)?.id
        getSeatObj = seatData.find((v) => v.movieId === movie_Id && v.cinemaId === getCinema_id && v.movieTime === getMovieSelectedTime)
        // console.log(getSeatObj)
        const getSeatsArr = getSeatObj.seat[getMovieDate]
        // console.log(getSeatsArr)
        let printSeat = "<ul id=seat_ul>"
        printSeat += getSeatsArr.map((v, i) => {
            return `
                <li class="seat_li">
                    <button class="seat_button" style="background-color:${v ? "white" : "#111111"}; color: ${v ? "#111111" : "white"};"  " id="seat_button-${i + 1}" onclick="handleSeatButtonClick('${i + 1}')" ${v ? "disabled" : ""} >${i + 1}</button>
                </li>
            `
        }).join("")

        printSeat += "</ul>"

        if (getSeatObj || getSeatsArr) {
            seat_list.innerHTML = printSeat
        } else {
            seat_list.innerHTML = "Seats Are Not Avalilable!"
        }

    } catch (error) {
        console.log(error)
        seat_list.style.textAlign = "center"
        seat_list.style.fontSize = "large"
        seat_list.style.fontWeight = "900"
        seat_list.innerHTML = "Seats Are Not Avalilable!"
    }
}

const handleSeatButtonClick = (count) => {
    const seatButtton = document.getElementById(`seat_button-${count}`)
    if (selectedSeatArr.indexOf(count - 1) === -1) {
        selectedSeatArr.push(count - 1)
        seatButtton.style.backgroundColor = "white"
        seatButtton.style.color = "#111111"
    } else {
        const buttonIndex = selectedSeatArr.indexOf(count - 1)
        selectedSeatArr.splice(buttonIndex, 1)
        seatButtton.style.backgroundColor = "#111111"
        seatButtton.style.color = "white"
    }
    // console.log(selectedSeatArr)
    // const tempSeatArr = []
    // tempSeatArr.push(count - 1)
    // // console.log(seatButtton.innerHTML)
    // tempSeatArr.forEach((v) => {
    //     if(selectedSeatArr.indexOf(v) === -1){
    //         selectedSeatArr.push(v);
    //     }
    // })

    // console.log(selectedSeatArr)
}

const handleMovieSeatClear = () => {
    diplayMovieSeats()
    selectedSeatArr.splice(0, selectedSeatArr.length)
    console.log(selectedSeatArr)
}

const handleSeatSubmit = async () => {
    try {
        const seatObj = { ...getSeatObj }
        console.log(seatObj)
        const seatArr = seatObj.seat[getMovieDate]
        selectedSeatArr.forEach((v) => {
            seatArr[v] = 1
        })
        seatObj.seat[getMovieDate] = seatArr
        // console.log(seatObj)
        await fetch(`${seatURL}/${seatObj.id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(seatObj)
        })
        // diplayMovieSeats()
        if(selectedSeatArr.length){
            window.location.href = "../pages/successfullBooking.html"
            const ticketOrderObj = {
                cinema_id: seatObj?.cinemaId,
                movie_id: seatObj?.movieId,
                movieDate: getMovieDate,
                movieTime: seatObj?.movieTime,
                seatNo: selectedSeatArr.map((v) => v + 1),
                user_id: JSON.parse(localStorage.getItem("userName"))?.id,
                perSeatPrice: seatObj?.price,
                totalAmount: selectedSeatArr.length * (parseInt(seatObj?.price)),
                createdAt: (new Date()).toDateString()
            }
            await fetch(ticketOrderURL, {
                method:'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ticketOrderObj)
            })
        }
    } catch (error) {
        console.log(error)
    }
}

// const userLoggedIn = () => {
//     if (localStorage.getItem("userName")) {
//         logIn.innerHTML = localStorage.getItem("userName")
//     }
// }

const validateUserLoggedIn = () => {
    if (getCinema_id && getMovieName && getMovieDate && getMovieSelectedTime) {
        // window.location.href = "../pages/movieSeat.html"
        if (localStorage.getItem("userName")) {
            // window.location.href = "../pages/movieSeat.html"
        } else {
            window.location.href = "../../bookMovieLogin/index.html"
        }
    } else {
        window.location.href = "../index.html"
    }   
}

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
    window.location.href = "../index.html"
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function handleLogInClick() {
    window.location.href = "../bookMovieLogin/index.html"
}


window.onload = function () {
    validateUserLoggedIn()
    diplayMovieSeatTitle()
    diplayMovieSeats()
    // userLoggedIn()
    manageProfile()
} 