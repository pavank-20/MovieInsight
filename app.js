// app.js
document.getElementById("omdb_submit").addEventListener("click", getData);

function getData() {
    let title = document.getElementById("title").value;
    let year = document.getElementById("year").value;

    let apiKey = "021488f10d541514f7148210c8c5c25e"; // Your actual TMDB API key

    let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${title}&year=${year}`;

    fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            let output = document.getElementById("output");
            let pretty = document.getElementById("pretty");
            let movieDetails = document.getElementById("movieDetails");

            if (data.results.length === 0) {
                output.innerHTML = `<br><br><br><h1>Movie Not Found</h1>`;
                pretty.innerHTML = "";
                movieDetails.innerHTML = "";
            } else {
                let movie = data.results[0]; // Get the first movie from the results

                output.innerHTML = `
                    <br><br>
                    <h1 id="title" style="display: inline;">${movie.title}</h1>
                    <br><br><br><hr><br>
                    <dl class="row">
                        <dt class="col-sm-3">Released in:</dt>
                        <dd class="col-sm-9">${movie.release_date}</dd>
                        <dt class="col-sm-3">Overview:</dt>
                        <dd class="col-sm-9">${movie.overview}</dd>
                        <!-- Add other movie details here -->
                    </dl>
                `;

                pretty.innerHTML = `<h1>${movie.title}</h1>`;

                // Fetch more detailed information, including credits and images
                let movieId = movie.id;
                let detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,images`;

                fetch(detailsUrl)
                    .then((response) => response.json())
                    .then((movieData) => {
                        console.log(movieData);

                        // Display genre, cast, crew, and images
                        movieDetails.innerHTML = `
                            <h3>Genre:</h3>
                            <p>${movieData.genres.map((genre) => genre.name).join(", ")}</p>

                            <h3>Cast:</h3>
                            <ul>
                                ${movieData.credits.cast
                                    .slice(0, 5)
                                    .map((actor) => `<li>${actor.name} as ${actor.character}</li>`)
                                    .join("")}
                            </ul>

                            <h3>Crew:</h3>
                            <ul>
                                ${movieData.credits.crew
                                    .slice(0, 5)
                                    .map((crewMember) => `<li>${crewMember.name} - ${crewMember.job}</li>`)
                                    .join("")}
                            </ul>

                            <h3>Images:</h3>
                            <div class="row">
                                ${movieData.images.backdrops
                                    .slice(0, 5)
                                    .map((image) => `
                                        <div class="col-md-4">
                                            <img src="https://image.tmdb.org/t/p/w300/${image.file_path}" alt="Backdrop">
                                        </div>
                                    `)
                                    .join("")}
                            </div>
                        `;
                    })
                    .catch((error) => {
                        console.error("Error fetching movie details:", error);
                        movieDetails.innerHTML = `<br><br><br><h1>Error fetching movie details. Please try again later.</h1>`;
                    });
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            let output = document.getElementById("output");
            output.innerHTML = `<br><br><br><h1>Error fetching data. Please try again later.</h1>`;
        });
}
