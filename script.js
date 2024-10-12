const apiKey = '02a3917b339f6dd0dbfce4a62c4111f5'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
const errorMessage = document.getElementById('error-message');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        showError('Error al obtener películas populares.');
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    if (movies.length === 0) {
        showError('No se encontraron películas.');
        return;
    }
    hideError();
    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    selectedMovieId = movieId; // Guarda el ID de la película seleccionada
    try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`);
        const movie = await response.json();
        detailsContainer.innerHTML = `
            <h3>${movie.title}</h3>
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <p>${movie.overview}</p>
        `;
        movieDetails.classList.remove('hidden'); // Muestra la sección de detalles
    } catch (error) {
        showError('Error al obtener detalles de la película.');
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        try {
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&query=${query}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            showError('Error al buscar películas.');
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
            alert(`${favoriteMovie.title} ha sido agregado a favoritos.`);
        } else {
            alert(`${favoriteMovie.title} ya está en favoritos.`);
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

// Hide error message
function hideError() {
    errorMessage.classList.add('hidden');
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
