const login_inputs = document.getElementById("login-inputs");
const userName = document.getElementById("userName")
const email = document.getElementById("email")
const userPassWord = document.getElementById("userPassWord")
const reType_PassWord = document.getElementById("reType-PassWord")
const userName_error = document.getElementById("userName-error")
const email_error = document.getElementById("email-error")
const userPassWord_error = document.getElementById("userPassWord-error")
const reType_PassWord_error = document.getElementById("reType-PassWord-error")

const userURL = "http://localhost:3000/users"

const handleValidation = () => {
    let is_Valid = true;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
    if(userName.value.trim()){
        userName_error.innerHTML = ""
    } else {
        userName_error.innerHTML = "Please Enter UserName!"
        is_Valid = false
    }
    if(email.value.trim()){
        if(emailRegex.test(email.value)){
            email_error.innerHTML = ""
        } else {
            email_error.innerHTML = "Please Enter Valid Email!"
            is_Valid = false
        }
    } else {
        email_error.innerHTML = "Please Enter Email!"
        is_Valid = false
    }

    if (userPassWord.value.trim()){
        userPassWord_error.innerHTML = ""
    } else {
        userPassWord_error.innerHTML = "Please Enter Password!"
        is_Valid = false
    }

    if(reType_PassWord.value.trim()){
        if(reType_PassWord.value.trim() === userPassWord.value.trim()){
            reType_PassWord_error.innerHTML = ""
        } else {
            reType_PassWord_error.innerHTML = "Please Enter Above PassWord Here!"
            is_Valid = false
        }
    } else {
        reType_PassWord_error.innerHTML = "Please ReType PassWord!"
        is_Valid = false
    }
    return is_Valid
}

const handleUserRegisterSubmit = async () => {
    try {
        const is_Valid = handleValidation()
        if(!is_Valid) {
            event.preventDefault()
            return
        }
        const userRegisterObj = {
            userName: userName.value,
            userEmail: email.value,
            userPassWord: userPassWord.value
        }
        await fetch(userURL,{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userRegisterObj)
        })
    } catch (error) {
        console.log(error)
    }
}

const handleClear = () => {
    userName.value = ""
    email.value = ""
    userPassWord.value = ""
    reType_PassWord.value = ""
}

login_inputs.addEventListener("submit", function(){
    handleUserRegisterSubmit()
})

