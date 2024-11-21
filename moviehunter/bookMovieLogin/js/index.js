const login_inputs = document.getElementById("login-inputs")
const userName = document.getElementById("userName")
const userPassWord = document.getElementById("userPassWord")
const userName_error = document.getElementById("userName_error")
const userPassWord_error = document.getElementById("userPassWord_error")

const userURL = "http://localhost:3000/users"
const handleValidation = () => {
    let is_Valid = true
    if (userName.value.trim()) {
        userName_error.innerHTML = ""
    } else {
        userName_error.innerHTML = "Please Enter userName!"
        is_Valid = false
    }

    if (userPassWord.value.trim()) {
        userPassWord_error.innerHTML = ""
    } else {
        userPassWord_error.innerHTML = "Please Enter userPassWord!"
        is_Valid = false
    }

    return is_Valid
}

const handleLoginSubmit = async () => {
    try {
        event.preventDefault()
        const is_Valid = handleValidation()
        if (!is_Valid) {
            event.preventDefault()
            return
        }
        const userResponse = await fetch("http://localhost:3000/users")
        console.log(userResponse)
        if (!userResponse.ok) {
            console.log("Error in getting user Data", userResponse.statusText)
        }
        const userData = await userResponse.json()
        console.log(userData)
        const findUser = userData.find((v) => v.userName === userName.value.trim() && v.userPassWord === userPassWord.value.trim())
        if (!findUser) {
            // event.preventDefault()
            userPassWord_error.innerHTML = "incorrect userName or passWord!"
            // throw new Error("does not exist userName and password");
        } else {
            const {id, userName} = findUser
            const diplayUser = {id, userName}
            localStorage.setItem("userName", JSON.stringify(diplayUser))
            const getCinema_id = localStorage.getItem("cinema_id")
            const getMovieName = localStorage.getItem("movieTitle")
            const getMovieDate = localStorage.getItem("movieSelectedDate")
            const getMovieSelectedTime = localStorage.getItem("selectedMovieTimeValue");
            if(getCinema_id && getMovieName && getMovieDate && getMovieSelectedTime){
                window.location.href = "../pages/movieSeat.html"
            } else {
                window.location.href = "../index.html"
            }
        }
        handleClear()
    } catch (error) {
        console.log(error)
    }
}

login_inputs.addEventListener("submit", function () {
    handleLoginSubmit()
})

const handleClear = () => {
    userName.value = ""
    userPassWord.value = ""
}

window.onload = function() {
    if(localStorage.getItem("userName")){
        window.location.href = "../index.html"
    }
}