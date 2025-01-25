const moviesApi = "http://localhost:3000/movies";

let movies = [];

function getMoviesFromDatabase() {
  fetch(moviesApi, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((moviesData) => {
      movies = moviesData;
      renderMovies(moviesData);
    })
    .catch((error) => console.log("Помилка виводу фільму:", error));
}

function renderMovies(movies) {
  const movieList = document.getElementById("movieList");
  movieList.innerHTML = "";

  if (movies.length === 0) {
    movieList.innerHTML = "<p>Фільми не знайдені</p>";
  } else {
    movies.forEach((movie) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.genre} | ${movie.director} | ${movie.year}</p>
        <button data-id="${movie.id}" class="delete-button">Delete</button>
        <button data-id="${movie.id}" class="edit-button">Edit</button>
      `;
      
      const deleteButton = li.querySelector(".delete-button");
      deleteButton.addEventListener("click", () => deleteMovie(movie.id));

      const editButton = li.querySelector(".edit-button");
      editButton.addEventListener("click", () => editMovie(movie.id));

      movieList.appendChild(li);
    });
  }
}

function deleteMovie(id) {
  movies = movies.filter(movie => movie.id !== id);
  renderMovies(movies);

  fetch(`${moviesApi}/${id}`, {
    method: "DELETE",
  })
    .then(() => console.log(`Фільм з id ${id} видалено`))
    .catch((error) => console.log("Помилка при видаленні фільму:", error));
}

function editMovie(id) {
  const movieEdit = movies.find(movie => movie.id === id);

  const updatedMovie = {
    ...movieEdit,
    title: prompt("Введіть нову назву:", movieEdit.title),
    genre: prompt("Введіть новий жанр:", movieEdit.genre),
    director: prompt("Введіть нового режисера:", movieEdit.director),
    year: prompt("Введіть новий рік:", movieEdit.year),
  };

  fetch(`${moviesApi}/${id}`, {
    method: "PUT",
    body: JSON.stringify(updatedMovie),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      movies = movies.map(movie =>
        movie.id === id ? updatedMovie : movie
      );
      renderMovies(movies);
    })
    .catch((error) => console.log("Помилка при оновленні фільму:", error));
}

function addNewMovie(movie) {
  fetch(moviesApi, {
    method: "POST",
    body: JSON.stringify(movie),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => getMoviesFromDatabase())
    .catch((error) => console.log("Помилка при додаванні фільму:", error));
}

document.getElementById("movieForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.getElementById("titleInput").value;
  const body = document.getElementById("bodyInput").value;
  const genre = document.getElementById("genreInput").value;
  const director = document.getElementById("directorInput").value;
  const year = document.getElementById("yearInput").value || new Date().getFullYear();

  const newMovie = {
    title,
    genre,
    director,
    year,
    body,
  };

  addNewMovie(newMovie);

  e.target.reset();
});

getMoviesFromDatabase();

