const show_booking = document.getElementById("show-booking")
const logIn = document.getElementById("logIn")

show_booking.addEventListener("click", function() {
    window.location.href = "../pages/movieSeat.html"
}) 

const getUser = localStorage.getItem("userName")

function manageProfile(){
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

function handleLogInClick() {
    window.location.href = "../bookMovieLogin/index.html"
}

const userLoggedIn = () => {
    if (localStorage.getItem("userName")) {
        logIn.innerHTML = JSON.parse(localStorage.getItem("userName"))?.userName
    }
}

window.onload = function(){
    // userLoggedIn()
    manageProfile()
}