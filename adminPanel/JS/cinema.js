const cinemaName = document.getElementById("cinemaName")
const cinemaAddress = document.getElementById("cinemaAddress")
const cinemaDescription = document.getElementById("cinemaDescription")
const cinemaPhoneNo = document.getElementById("cinemaPhoneNo")
const cinemaEmail = document.getElementById("cinemaEmail")
const cinemaNameErr = document.getElementById("cinemaNameErr")
const cinemaAddressErr = document.getElementById("cinemaAddressErr")
const cinemaDescriptionErr = document.getElementById("cinemaDescriptionErr")
const cinemaPhoneNoErr = document.getElementById("cinemaPhoneNoErr")
const cinemaEmailErr = document.getElementById("cinemaEmailErr")
const cinemaForm = document.getElementById("myForm")
const tableBody = document.getElementById("tableBody")
const cinemaSubmit = document.getElementById("cinema-submit")
const cinemaURL = "http://localhost:3000/cinemas"
let cinemaUpdateId = null;

function openForm() {
    cinemaForm.style.display = "block";
}

function closeForm() {
    cinemaForm.style.display = "none";
}

const handleVaildation = () => {
    let IsVaild = true;
    const phoneRegex = /^\d{4}-\d{6}$/
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if(cinemaName.value){
        cinemaNameErr.innerHTML = "";
    } else {
        cinemaNameErr.innerHTML = "Please Enter Cinema Name!"
        IsVaild = false
    }
    if(cinemaAddress.value){
        cinemaAddressErr.innerHTML = ""
    } else {
        cinemaAddressErr.innerHTML = "Please Enter Cinema Address!"
        IsVaild = false
    }
    if(cinemaDescription.value){
        cinemaDescriptionErr.innerHTML = ""
    } else {
        cinemaDescriptionErr.innerHTML = "Please Enter Cinema Description!"
        IsVaild = false
    }
    if(cinemaPhoneNo.value){
        if(phoneRegex.test(cinemaPhoneNo.value)){
            cinemaPhoneNoErr.innerHTML = ""
        } else {
            cinemaPhoneNoErr.innerHTML = "Please Enter Vaild Phone Number!"
            IsVaild = false
        }
    } else {
        cinemaPhoneNoErr.innerHTML = "Please Enter Cinema Phone Number!"
        IsVaild = false
    }

    if(cinemaEmail.value){
        if(emailRegex.test(cinemaEmail.value)){
            cinemaEmailErr.innerHTML = ""
        } else {
            cinemaEmailErr.innerHTML = "Please Enter Vaild Email!"
            IsVaild = false
        }
    } else {
        cinemaEmailErr.innerHTML = "Please Enter Cinema Email!"
        IsVaild = false
    }
    return IsVaild
}

const getTable = async () => {
    try {
        const response = await fetch(cinemaURL);
        if (!response.ok) {
            throw new Error("Error in get the data from cinemas: " + response.statusText)
        }
        const data = await response.json()
        tableBody.innerHTML = data.map((v) => {
            return `
                <tr>
                    <td>${v.name}</td>
                    <td>${v.address}</td>
                    <td>${v.description}</td>
                    <td>${v.phoneNo}</td>
                    <td>${v.email}</td>
                    <td>
                        <span>
                            <i class="ri-edit-line edit" onclick="handleCinemaEdit('${v.id}', '${v.name}', '${v.address}', '${v.description}', '${v.phoneNo}', '${v.email}' )"></i>
                            <i class="ri-delete-bin-line delete" onclick="handleCinemaDelete('${v.id}')"></i>
                        </span>
                    </td>
                </tr>
            `
        }).join('');
    } catch (error) {
        console.log(error)
    }
}

const handleCinemaSubmit = async () => {
    try {
        const IsVaild = handleVaildation();
        if(!IsVaild) {
            event.preventDefault()
            return
        };
        const cinemaObj = {
            name: cinemaName.value,
            address: cinemaAddress.value,
            description: cinemaDescription.value,
            phoneNo: cinemaPhoneNo.value,
            email: cinemaEmail.value
        }
        if(cinemaUpdateId || cinemaSubmit.innerHTML === "Update"){
            const response = await fetch(`${cinemaURL}/${cinemaUpdateId}`, {
                    method: 'PUT',
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cinemaObj)
                })
            if(!response.ok) {
                console.log("Error in Update cinema data: ", response.statusText)
            }
            const data = await response.json();
            console.log(data)
        } else {
            const response = await fetch(cinemaURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cinemaObj)
            })
            if (!response.ok) {
                console.log("Error in Adding cinema data: ", response.statusText);
            }
            const data = await response.json()
            console.log(data);
        }
    } catch (error) {
        console.log(error)
    }
}

const handleCinemaDelete = async (id) => {
    try {
        const response = await fetch(`${cinemaURL}/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(null)
        })
        if(!response.ok){
            console.log("Error in delete cinema data: ", response.statusText)
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.log(error)
    }
}

const handleCinemaEdit = (id, name, address, description, phoneNo, email) => {
    openForm()
    cinemaName.value = name;
    cinemaAddress.value = address;
    cinemaDescription.value =description;
    cinemaPhoneNo.value = phoneNo;
    cinemaEmail.value = email
    cinemaUpdateId = id
    cinemaSubmit.innerHTML = "Update"
}
window.onload = function () {
    getTable()
}
