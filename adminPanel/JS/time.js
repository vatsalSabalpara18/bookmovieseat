const time_form = document.getElementById("time-form")
const cineams_name = document.getElementById("cineams-name")
const movie_name = document.getElementById("movie-name")
const add_time = document.getElementById("add-time");
const movie_start_date = document.getElementById("movie-start-date");
const movie_end_date = document.getElementById("movie-end-date")
const addTimeInput = document.getElementsByName("addTimeInput")
const timeTableBody = document.getElementById("timeTableBody")
const timesURL = "http://localhost:3000/times"
let time_update = null;

function openTimeForm() {
    time_form.style.display = "block"
}

function closeTimeForm() {
    time_form.style.display = "none"
}

const displayCinemaNames = async () => {
    try {
        const response = await fetch("http://localhost:3000/cinemas");
        if (!response.ok) {
            console.log("Error In Getting Cinemas data: ", response.statusText)
        }
        const data = await response.json()
        // cinemaNameList.push(...data);
        movieListArr = [...data]
        cineams_name.innerHTML = data.map((v) => {
            return `
                <option value="${v.id}">${v.name}</option>
            `
        }).join('')
    } catch (error) {
        console.log(error)
    }
}

const handleCinemaChange = async () => {
    try {
        const response = await fetch(`http://localhost:3000/movies`)
        if(!response.ok){
            console.log("Error In The Getting Movies Data: ", response.statusText)
        }
        const data = await response.json()
        movieListArr = [...data]
        const filterData = data.filter((v) => v.cinema_id === cineams_name.value)
        movie_name.innerHTML = filterData.map((v) => {
            return`
                <option value="${v.id}">${v.name}</option>
            `
        }).join("")
    } catch (error) {
        console.log(error)
    }
}


const handleAddTimeInput = (inputValue) => {
    console.log("handleAddTimeInput")
    const raNo = Math.floor(Math.random()* 10000)
    const div = document.createElement("div");
    div.setAttribute("id","add-time-" + raNo)
    const input = document.createElement("input")
    input.setAttribute("type","time")
    input.setAttribute("name","addTimeInput")
    if(inputValue){
        input.setAttribute("value", inputValue)
    }
    const addButton = document.createElement("i")
    addButton.setAttribute("class","ri-add-box-line edit")
    addButton.setAttribute("onclick", "handleAddTimeInput()")
    
    div.appendChild(input)
    div.appendChild(addButton)

    if(add_time.children.length){
        const deleteButton = document.createElement("i")
        deleteButton.setAttribute("class", "ri-close-circle-line delete")
        deleteButton.setAttribute("onclick", `handleRemoveTimeInput(${raNo})`)
        div.appendChild(deleteButton)
    }
    
    add_time.appendChild(div)
}

const handleRemoveTimeInput = (raNo) => {
    const parentTime_div = document.getElementById("add-time-" + raNo)
    parentTime_div?.remove();
    
}

const handleTimeSubmit = async () => {
    try {
        const timeArr = []
        for (let i = 0; i < addTimeInput.length; i++){
            timeArr.push(addTimeInput[i]?.value)
        }
        const timeObj = {
            cinemaID: cineams_name.value,
            movieID: movie_name.value,
            movieStartDate: movie_start_date.value,
            movieEndDate: movie_end_date.value,
            movieTimes: timeArr
        }

        if(time_update){
            await fetch(`${timesURL}/${time_update}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(timeObj)
            })
            time_update = null
        } else {
            await fetch(timesURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(timeObj)
            })
        }
        
    } catch (error) {
     console.log(error)   
    }
}

const displayTimeList = async () => {
    // handleCinemaChange()
    try {
        const response = await fetch(timesURL)
        if(!response.ok){
            console.log("Error In getting Time List ", response.statusText)
        }
        const data = await response.json()
        const cinemaResponse = await fetch("http://localhost:3000/cinemas")
        if(!cinemaResponse.ok){
            console.log("Error In getting cinema list ", cinemaResponse.statusText)
        }
        const cinemaListArr = await cinemaResponse.json()
        const movieResponse = await fetch(`http://localhost:3000/movies`)
        if(!movieResponse.ok){
            console.log("Error in getting movie list ", movieResponse.statusText)
        }
       const movieListArr = await movieResponse.json()

        timeTableBody.innerHTML = data.map((v) => {
            
            const startDate = new Date(v.movieStartDate)
            const endDate = new Date(v.movieEndDate)
            const localStartDate = startDate.toLocaleDateString('en-GB')
            const localEndDate = endDate.toLocaleDateString('en-GB')
            const timesInString = v.movieTimes.join(',')
            const findMovieName = movieListArr.find((ele) => ele.id === v.movieID)?.name
            const cinemaName =  cinemaListArr.find((ele) => ele.id === v.cinemaID)?.name
            return `
                <tr>
                    <td>${cinemaName}</td>
                    <td>${findMovieName}</td>
                    <td>${localStartDate}</td>
                    <td>${localEndDate}</td>
                    <td>${timesInString}</td>
                    <td>
                        <span>
                            <i class="ri-edit-line edit" onclick=handleTimeEdit('${v.id}','${v.cinemaID}','${v.movieID}','${v.movieStartDate}','${v.movieEndDate}','${JSON.stringify(v.movieTimes)}')></i>
                            <i class="ri-delete-bin-line delete" onclick="handleTimeDelete('${v.id}')"></i>
                        </span>
                    </td>
                </tr>
            `
        }).join("")
    } catch (error) {
        console.log(error)   
    }
}

const handleTimeEdit = async (id, cinema_ID, movie_ID, movie_Start_Date, movie_End_Date, movieTimes) => {
    // debugger
    let print=''
    console.log(id, cinema_ID, movie_ID, movie_Start_Date, movie_End_Date, movieTimes)
    cineams_name.value = cinema_ID
    await handleCinemaChange()
    movie_name.value = movie_ID
    movie_start_date.value = movie_Start_Date
    movie_end_date.value = movie_End_Date
    const movieTImesArr = JSON.parse(movieTimes)
    // const timerInputLength = addTimeInput.length;
    // // if (addTimeInput.length >= movieTImesArr.length){
    //     for (let i = 0; i < movieTImesArr.length - timerInputLength; i++) {
    //         handleAddTimeInput()
    //     }
    // // }
    // if(timerInputLength > movieTImesArr.length){
    //     for (let i = 0; i < timerInputLength - movieTImesArr; i++ ){
    //         parentNode.addTimeInput[i].removeChild(addTimeInput[i])
    //     }
    // }

    // for(let i = 0; i < addTimeInput.length; i++){
    //     addTimeInput[i].value = movieTImesArr[i]
    // }
    add_time.innerHTML = '';
    for(let i = 0; i < movieTImesArr.length; i++){
        handleAddTimeInput(movieTImesArr[i])
    }
    time_update = id
    openTimeForm()
}

const handleTimeDelete = async (id) => {
    try {
        await fetch(`${timesURL}/${id}`,{
            method: 'DELETE',
            headers:{
                "Content-Type": "application/json",
            },
        })
        displayTimeList()
    } catch (error) {
        console.log(error)
    }
}
window.onload = function() {
    displayCinemaNames()
    displayTimeList()
}