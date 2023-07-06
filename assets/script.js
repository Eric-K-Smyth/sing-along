var client_id = '0d29a13314704580a8e1dbb68e0ec812';
var client_secret = 'd26b235197614f57ba9708b20366a313';
var input = "winter";//search keyword
var perPage = 3;//number of results shown

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var token = body.access_token;
  }
});

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

