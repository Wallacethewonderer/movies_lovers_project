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
  $('#display-results').empty()
  for (var i = 0; i < movies.length; i++) {
    const movieTitle = movies[i].title
    localStorage.setItem(`movieList` + i, movies[i].title)

    $('#display-results').append(`<button id='item${i}'>${movieTitle}</button>`).append("<br>")
    $(`#item${i}`).on('click', function () {
      streamingSites(movieTitle)
    })
  }
};


var streamingSites = function (movieTitle) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '5c59cde8dfmshfb3ec99bd8b232ap1f1957jsna702e8da05dc',
      'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
    }
  };
  let encoded = encode(movieTitle)
  fetch(`https://streaming-availability.p.rapidapi.com/v2/search/title?title=${encoded}&country=us&type=movie&output_language=en`, options)
    .then(response => response.json())
    .then(response => displayStreamingInfo(response.result, movieTitle))
    .catch(err => console.error(err));

  // adding back button and even handler to click back button
  const backBtnExists = $("#back-button").length;
  if (!backBtnExists) {
    $("<button>").attr("id", "back-button").text("Back").appendTo("body").click(function () {
      console.log('back button clicked', window.history.length)
      $(document).ready(() => {
        const storageLength = localStorage.length;
        const container = $("#display-results");
        container.empty()
        for (let k = 0; k < storageLength; k++) {
          let movieName = localStorage.getItem(`movieList${k}`);
          $("#display-results")
            .append(`<button id='item${k}'>${movieName}</button>`)
            .append("<br>");
          $(`#item${k}`).on('click', function () {
            streamingSites(movieName)
          })
        }
      });
    });
  }
}

function displayStreamingInfo(movie, title) {

  $('#display-results').empty()
  let result;
  for (let i = 0; i < movie.length; i++) {
    if (title == movie[i].title) {
      result = movie[i]
    }
  }
  if (Object.keys(result.streamingInfo).length === 0) {
    $('#display-results').append('<div>No Streaming at this time</div>')
  } else {
    for (item in result.streamingInfo.us) {
      let stuff = result.streamingInfo.us[item]
      for (let i = 0; i < stuff.length; i++) {
        console.log(item, stuff[i].link, stuff[i].type, 'stuff we need')
        
      }
      showStreamingChannel(item, stuff[0].link, stuff[0].type)
    }

  }
}

function showStreamingChannel(page, link, style) {
  $('#display-results').append(`<div id='page'>You can find it at: ${page}</div>`)
  $('#display-results').append(`<div id='style'>watch it by: ${style}</div>`)
  // $('#display-results').append(`<div>at this ${link} <==</div>`).append('<br>')
}

function encode(item) {
  return encodeURIComponent(item.trim())
}

$(".btn").on("click", function () {
  $('#display-results').empty()
  localStorage.clear();
  let actorName = $(this).siblings("#actor_name").val();
  // $('h2').append(actorName)
  getMovieList(actorName);
});
