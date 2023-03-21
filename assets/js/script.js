var actorRequestUrl = `https://actor-movie-api1.p.rapidapi.com/getid/${name}?apiKey=62ffac58c57333a136053150eaa1b587`;
var streamingURL =
  "https://streaming-availability.p.rapidapi.com/v2/search/title";

$(".btn").on("click", function () {
  console.log("clicked");
  let actorName = $(this).siblings("#actor_name").val();
  console.log(actorName);
  getMovieList(actorName);
});

function getMovieList(actorName) {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "686eeb4ed7msh0054f7aafc074a4p16067cjsn696309b02c3c",
      "X-RapidAPI-Host": "actor-movie-api1.p.rapidapi.com",
    },
  };

  fetch(
    `https://actor-movie-api1.p.rapidapi.com/getid/${actorName}?apiKey=62ffac58c57333a136053150eaa1b587`,
    options
  )
    .then((response) => response.json())
    .then((response) => displayMovies(response))
    .catch((err) => console.error(err));
}

var displayMovies = function (movies) {
    console.log(movies.length)
  // if (movies.length === 0) {
  //   issueContainerEl.textContent = 'This repo has no open issues!';
  //   return;

  for (var i = 0; i < movies.length; i++) {
    // console.log(movies[i].title);
    const movieTitle = movies[i].title
    $('#display-results').append(`<button id='item${i}'>${movieTitle}</button>`).append("<br>")


    $(`#item${i}`).on('click',function() {
        console.log(movieTitle, 'title')
      streamingSites(movieTitle)  
    })
  }
};

var streamingSites = function (movieTitle) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '686eeb4ed7msh0054f7aafc074a4p16067cjsn696309b02c3c',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };
    
    fetch(`https://streaming-availability.p.rapidapi.com/v2/search/title?title=${movieTitle}&country=us&type=movie&output_language=en`, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}