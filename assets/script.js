var client_id = '0d29a13314704580a8e1dbb68e0ec812';
var client_secret = 'd26b235197614f57ba9708b20366a313';
var accessToken;

var authOptions = {
  method: 'POST',
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
};

fetch(authOptions.url, {
  method: authOptions.method,
  headers: authOptions.headers,
  body: authOptions.body
})
  .then(response => response.json())
  .then(data => {
    accessToken = data.access_token;
  })
  .catch(error => console.error(error));

function searchSong() {
  var searchInput = document.getElementById('searchInput').value;

  fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track&limit=5`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      var resultsContainer = document.getElementById('results');
      resultsContainer.innerHTML = '';

      data.tracks.items.forEach(track => {
        var trackName = track.name;
        var artistName = track.artists[0].name;
        var albumName = track.album.name;
        var albumIconUrl = track.album.images[0].url;

        var li = document.createElement('li');
        li.textContent = `${trackName} - ${artistName} (${albumName})`;

        var img = document.createElement('img');
        img.src = albumIconUrl;

        li.appendChild(img);
        resultsContainer.appendChild(li);
      });
    })
    .catch(error => console.error(error));
}

var input = "winter";//to be changed dynamically through JS
var perPage = 3;//to be changed dynamically through JS

const settings = {
	async: true,
	crossDomain: true,
	url: `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${input}&per_page=${perPage}&page=1`,
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '8190159c34mshdcc9f9a352eb11bp12ac68jsn0567caeef1e7',
		'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
	}
};

$.ajax(settings).then(function (response) {
	console.log(response);
    for (var entry of response){
        var artistName = entry.hits[1].result.artist_names;
        console.log(`Artist: ${artistName}`);
      }
});


