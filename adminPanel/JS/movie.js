const cinema_list = document.getElementById("cineams-list")
const movie_form = document.getElementById("movie-form")
const movieDescription = document.getElementById("movieDescription")
const moviePoster = document.getElementById("moviePoster")
const movieName = document.getElementById("movieName")
const cineams_list = document.getElementById("cineams-list")
const movieTableBody = document.getElementById("movieTableBody")
const posterImg = document.getElementById("posterImg");
const cinemas_listErr = document.getElementById("cinemas-listErr")
const movieNameErr = document.getElementById("movieNameErr")
const moviePosterErr = document.getElementById("moviePosterErr")
const movieDescriptionErr = document.getElementById("movieDescriptionErr")
const movieURL = "http://localhost:3000/movies";
let movieUpdate = null

function openMovieForm(){
    movie_form.style.display = "block"
}

function closeMovieForm(){
    movie_form.style.display = "none"
}

const displayCinemaList = async () => {
    try {
        const response = await fetch("http://localhost:3000/cinemas");
        if(!response.ok){
            console.log("Error In Getting Cinemas data: ",response.statusText)
        }
        const data = await response.json()        
        cinema_list.innerHTML = data.map((v) => {
            return`
                <option value="${v.id}">${v.name}</option>
            `
        }).join('')
    } catch (error) {
        console.log(error)
    }
}

const handleMovieVaildation = () => {
    let isVaild = true
    if (cineams_list.value === '--Select-Cinema--'){
        cinemas_listErr.innerHTML = "PLease Select the Cinema Name!"
        isVaild = false
    } else {
        cinemas_listErr.innerHTML = ""
    }
    if (movieName.value){
        movieNameErr.innerHTML = ""
    } else {
        movieNameErr.innerHTML = "Please Enter Movie Name!"
        isVaild = false
    }
    if (moviePoster.files.length === 1 && posterImg?.src === "http://127.0.0.1:5501/pages/movie.html"){
        moviePosterErr.innerHTML = "Please Selete Only One Image!"
        isVaild = false
    } else {
        moviePosterErr.innerHTML = ""
    }
    if (movieDescription.value){
        movieDescriptionErr.innerHTML = ""
    } else{
        movieDescriptionErr.innerHTML = "Please Enter Movie Descripttion"
        isVaild = false
    }
    return isVaild
}

console.log(moviePoster.files.length)

const handleMovieSubmit  = async () =>{ 
    // console.log()
    try {
        const isVaild = handleMovieVaildation()
        if(!isVaild) {
            event.preventDefault()
            return
        };
        const movieObj = {
            name: movieName.value,
            cinema_id: cineams_list.value,
            poster: moviePoster?.files[0]?.name,
            description: movieDescription.value
        }
        if(!movieObj.poster){
            const arr = posterImg?.src?.split("/")
            movieObj.poster = arr[arr.length - 1]
        }

        if(movieUpdate){
            console.log("update movie")
            const response = await fetch(`${movieURL}/${movieUpdate}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieObj)
            })
            movieUpdate = null
        } else {
            console.log("add movie")
            const response = await fetch(movieURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(movieObj)
            });
        }
        
    } catch (error) {
        console.log(error)
    }
}

const displayMoviesList = async () => {
    try {
        const response = await fetch(movieURL);
        if(!response.ok){
            console.log("Error In getting movies: ", response.statusText);
        }
        const cinemaResponse = await fetch("http://localhost:3000/cinemas")
        if(!cinemaResponse.ok){
            console.log("Error in getting cinema list ", cinemaResponse.statusText)
        }
        const cinemaNameList = await cinemaResponse.json()
        const data = await response.json()
        movieTableBody.innerHTML = data.map((v) => {
            // console.log(cinemaNameList)
            // console.log(v.cinema_id)
            const cinemaNameId = cinemaNameList.find((v2) => v2.id === v.cinema_id)?.name
            // console.log(cinemaNameId, "displayMoviesList")
            return `
                <tr>
                    <td>${v.name}</td>
                    <td><img class="movie-poster" src="../images/${v.poster}" width="100" height="200"></td>
                    <td>${cinemaNameId}</td>
                    <td>${v.description}</td>
                    <td>
                        <span>
                            <i class="ri-edit-line edit" onclick="handleMovieEdit('${v.id}', '${v.name}', '${v.poster}', '${v.cinema_id}', '${v.description}')"></i>
                            <i class="ri-delete-bin-line delete" onclick="handleMovieDelete('${v.id}')"></i>
                        </span>
                    </td>
                </tr>
            `
        })
    } catch (error) {
        console.log(error)
    }
}

const handleMovieEdit = (id, name, poster, cinema_id, description) => {
    movieName.value = name
    posterImg.src = "../images/" + poster
    cineams_list.value = cinema_id
    movieDescription.value = description
    movieUpdate = id
    openMovieForm()
}

const handleImage = () => {
    posterImg.src = "../images/" + moviePoster.files[0].name
}

const handleMovieDelete = async (id) => {
    try {
        console.log(id)
        const response = await fetch(`${movieURL}/${id}`,{
            method: 'DELETE',
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify(null)
        })
        
    } catch (error) {
        console.log(error)
    }
}
window.onload = function() {
    displayCinemaList()
    displayMoviesList()
}
