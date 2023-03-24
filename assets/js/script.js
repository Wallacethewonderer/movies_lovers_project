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
    localStorage.setItem(`movieList` + i, movieTitle)
  }
  displayTitle(movies, 0)
};

function displayTitle(list, start) {
  $('#display-results').empty()
  $('#back-button').remove()
  if (!start) {
		$("#back").css({ visibility: "hidden" }); //since its at 0, the back button stays hidden
		if (list.length < 10) {
			// for actor have less then 10 movies to display
			console.log("len < 10");
			for (let i = 0; i < list.length; i++) {
				const movieTitle = list[i].title;
				displayTitleChild(movieTitle, i); //display
			}
		} else {
			console.log("len > 10"); //actor has more than 10 movies
			for (var i = 0; i < start + 10; i++) {
				// console.log(movies[i].title)
				const movieTitle = list[i].title;
				displayTitleChild(movieTitle, i); //add button

				$("#back").bind("click", function () {
					displayTitle(list, start);
				}); //set the page's back button to display from 0 position
				$("#next")
					.unbind("click")
					.bind("click", function () {
						displayTitle(list, 10); //set the page's next button to display from 10th position
					})
					.css({ visibility: "visible" }); //activate the button
			}
		}
	} else {
		console.log(start);
		console.log("10 < len < 10");
		$("#back").css({ visibility: "visible" }); //activate the button
		$("#next").css({ visibility: "visible" }); //activate the button
		for (var i = start; i < start + 10; i++) {
			// console.log(movies[i].title);

			const movieTitle = list[i].title;
			displayTitleChild(movieTitle, i); //display from the 10th/20th/30th... position that limited to max 10 titles

			console.log(i, list.length, "test");
			if (i + 1 >= list.length) {
				//if the remainning title is less than 10
				$("#back")
					.unbind("click")
					.bind("click", function () {
						displayTitle(list, start - 10); //set the back button
					});
				$("#next").css({ visibility: "hidden" }); // since its at max, deactivate the button
				return; //terminate
			}
		}
		$("#back")
			.unbind("click")
			.bind("click", function () {
				displayTitle(list, start - 10); //set the button to show the list from -10 position of the starting point
			});
		$("#next")
			.unbind("click")
			.bind("click", function () {
				displayTitle(list, start + 10); //set the button to show the list from 10 position of the starting point
			});
	}
}

function displayTitleChild(title, id) {
  $('#display-results').append(`<button id='item${id}'>${title}</button>`).append("<br>")
  $(`#item${id}`).on('click', function () {
    streamingSites(title)
  })
}



var streamingSites = function (movieTitle) {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8918c6f44bmsh8ba4a522b87cee8p1a3d22jsn1e2543c34152',
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
        let movies = []
        for (let k = 0; k < storageLength; k++) {
          let movieName = localStorage.getItem(`movieList${k}`);
          movies.push({title: movieName})
        }
        console.log(movies)
        displayTitle(movies, 0)
      });
    });
  }
}

function displayStreamingInfo(movie, title) {
  $("#back").css({ visibility: "hidden" }); //hide next/back button since we dont need it anymore
	$("#next").css({ visibility: "hidden" });
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
  $('#current_search').remove()
  let actorName = $(this).siblings("#actor_name").val();
  $('h2').append(`<div id = 'current_search'> ${actorName}</div>`)
  getMovieList(actorName);
});
