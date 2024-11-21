const seat_form = document.getElementById("seat-form");
const cineams_name = document.getElementById("cineams-name");
const movie_name = document.getElementById("movie-name");
const movie_time = document.getElementById("movie-time");
const no_of_seats = document.getElementById("no-of-seats")
const price = document.getElementById("price")
const seatTableBody = document.getElementById("seatTableBody")
const seatsURL = "http://localhost:3000/seats"
let movie_Start_Date, movie_End_Date;
let seats_update = null

function openSeatForm() {
  seat_form.style.display = "block";
}

function closeSeatForm() {
  seat_form.style.display = "none";
}

const displayCinemaList = async () => {
  try {
    const response = await fetch("http://localhost:3000/cinemas");
    if (!response.ok) {
      console.log("Error In Getting Cinemas data: ", response.statusText);
    }
    const data = await response.json();
    cineams_name.innerHTML = data
      .map((v) => {
        return `
                <option value="${v.id}">${v.name}</option>
            `;
      })
      .join("");
  } catch (error) {
    console.log(error);
  }
};

const handleCinemaChange = async () => {
  try {
    // debugger
    const response = await fetch(`http://localhost:3000/movies`);
    if (!response.ok) {
      console.log("Error In The Getting Movies Data: ", response.statusText);
    }
    const data = await response.json();
    const filterData = data.filter((v) => v.cinema_id === cineams_name.value);
    movie_name.innerHTML = filterData
      .map((v) => {
        return `
                <option value="${v.id}">${v.name}</option>
            `;
      })
      .join("");
  } catch (error) {
    console.log(error);
  }
};

const handleMovieChange = async () => {
  try {
    // debugger
    const response = await fetch("http://localhost:3000/times");
    if (!response.ok) {
      console.log("Error in getting time data ", response.statusText);
    }
    const data = await response.json();
    // console.log(data);
    const movieTimeObj = data.find((v) => v.movieID === movie_name.value);
    movie_Start_Date = movieTimeObj?.movieStartDate
    movie_End_Date = movieTimeObj?.movieEndDate
    const movieTimeArr = movieTimeObj?.movieTimes;
    // console.log(movieTimeArr)
    movie_time.innerHTML = movieTimeArr.map((v, i) => {
      return `
                <option value="${v}">${v}</option>
              `;
    });
  } catch (error) {
    console.log(error);
  }
};

const handleSeatSubmit = async () => {
  try {
    // debugger
    console.log("clicked")
    // event.preventDefault()
    const noOfSeat = new Array(parseInt(no_of_seats.value)).fill(0);
    // for(let i = 0; i < parseInt(no_of_seats.value); i++){
    //   noOfSeat.push(0);
    // }
    // console.log(noOfSeat)
    const seatsObj = {};

    const movieStartDate = new Date(movie_Start_Date)
    const movieEndDate = new Date(movie_End_Date)
    if (movieStartDate < movieEndDate) {
      for (let i = movieStartDate; i <= movieEndDate; i.setDate(i.getDate() + 1)) {
        // console.log(i.toLocaleDateString('en-GB'))
        seatsObj[i.toLocaleDateString("en-GB")] = noOfSeat
      }
    }

    const addSeatsObj = {
      cinemaId: cineams_name.value,
      movieId: movie_name.value,
      movieTime: movie_time.value,
      seat: seatsObj,
      price: price.value
    }
    // console.log(addSeatsObj)

    if (seats_update) {
      await fetch(`${seatsURL}/${seats_update}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addSeatsObj)
      })
    } else {
      await fetch(seatsURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addSeatsObj)
      });
    }

  } catch (error) {
    console.log(error)
  }
}

const displaySeatTable = async () => {
  try {
    const response = await fetch(seatsURL);
    if (!response.ok) {
      console.log("Error in getting seats data ", response.statusText)
    }
    const seatsData = await response.json()
    const cinemaResponse = await fetch("http://localhost:3000/cinemas")
    if (!cinemaResponse.ok) {
      console.log("Error in gettting diplaySeatTable function getting cinemas data ", cinemaResponse.statusText)
    }
    const cinemaData = await cinemaResponse.json()
    const movieResponse = await fetch("http://localhost:3000/movies")
    if (!movieResponse.ok) {
      console.log("Error in gettting diplaySeatTable function getting movies data ", movieResponse.statusText)
    }
    const movieData = await movieResponse.json()
    seatTableBody.innerHTML =
      seatsData.map((v) => {
        const findCinemaName = cinemaData.find((ele) => ele.id === v.cinemaId)?.name
        const findMovieName = movieData.find((ele) => ele.id === v.movieId)?.name
        const seatsNo = Object.values(v.seat)[0]?.length;
        return `
        <tr>
          <td>${findCinemaName}</td>
          <td>${findMovieName}</td>
          <td>${v.movieTime}</td>
          <td>${seatsNo}</td>
          <td>${v.price}</td>
          <td>
              <span>
                    <i class="ri-edit-line edit" onclick=handleSeatsEdit('${v.id}','${v.cinemaId}','${v.movieId}','${v.movieTime}','${seatsNo}','${v.price}')></i>
                    <i class="ri-delete-bin-line delete" onclick=handleSeatsDelete('${v.id}')></i>
              </span>
          </td>
        </tr>
      `
      }).join('')

  } catch (error) {
    console.log(error)
  }
}



const handleSeatsDelete = async (id) => {
  try {
    await fetch(`${seatsURL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    displaySeatTable()
  } catch (error) {
    console.log(error)
  }
}

const handleSeatsEdit = async (id, cinemaId, movieId, movieTime, seatsNo, price_of_seat) => {
  // debugger
  console.log(id, cinemaId, movieId, movieTime, seatsNo, price_of_seat)
  cineams_name.value = cinemaId;
  await handleCinemaChange()
  movie_name.value = movieId
  await handleMovieChange()
  movie_time.value = movieTime
  no_of_seats.value = seatsNo
  price.value = price_of_seat
  openSeatForm()
  seats_update = id
}

window.onload = function () {
  displayCinemaList();
  displaySeatTable()
};
