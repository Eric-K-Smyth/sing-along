var input = "Money Trees - Kendrick Lamar (good kid, m.A.A.d city)";//to be changed dynamically through JS
input = input.split('-');

var lyricsContainerDiv = $('#lyrics-container');
var songInfoDiv = $('#song-info');

const settings = {
  async: true,
  crossDomain: true,
  url: `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${input[0]}&per_page=1&page=1`,
  method: 'GET',
  cache: true,
  headers: {
    'X-RapidAPI-Key': 'aa9dd97b71mshff54ea437ac6bd6p1038d2jsn9c6ebfb689e2',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
  }
};

$.ajax(settings).then(function (response) {
  console.log(response);
  
  for (var i=0; i<response.hits.length; i++) {
    var artistNames = response.hits[i].result.artist_names;
    var songID = response.hits[i].result.id;
    var lyricsURL = response.hits[i].result.url;

    console.log(`Artist: ${artistNames}`);
    console.log(`ID: ${songID}`);
    console.log(`Lyrics URL: ${lyricsURL}`);

    const getLyrics = {
      async: true,
      crossDomain: true,
      url: `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${songID}`,
      method: 'GET',
      cache: true,
      headers: {
        'X-RapidAPI-Key': 'aa9dd97b71mshff54ea437ac6bd6p1038d2jsn9c6ebfb689e2',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
      }
    };

    $.ajax(getLyrics).then(function (lyricsUrlResponse) {

      var artist = lyricsUrlResponse.lyrics.tracking_data.primary_artist;
      var song = lyricsUrlResponse.lyrics.tracking_data.title;
      var year = lyricsUrlResponse.lyrics.tracking_data.created_year;
      var genre = lyricsUrlResponse.lyrics.tracking_data.primary_tag;
      var lyricsHTML = lyricsUrlResponse.lyrics.lyrics.body.html;
      var updatedLyricsHTML = $(lyricsHTML).find('a').replaceWith(function() {
        return '<span>' + $(this).text() + '</span>';
      }).end().prop('outerHTML');

      console.log(lyricsUrlResponse);

      var artistNameSpan = $('<span></span>');
      var songNameSpan = $('<span></span>');
      var yearSpan = $('<span></span>');
      var genreSpan = $('<span></span>');
      var lyricsSpan = $('<span></span>');

      var br1 = $('<br>');
      var br2 = $('<br>');
      var br3 = $('<br>');
      var br4 = $('<br>');

      artistNameSpan.text(`Artist: ${artist}`);
      songNameSpan.text(`Song: ${song}`);
      yearSpan.text(`Year: ${year}`);
      genreSpan.text(`Genre: ${genre}`);
      lyricsSpan.html(`Lyrics: ${updatedLyricsHTML}`);

      songInfoDiv.append(artistNameSpan);
      songInfoDiv.append(br1);
      songInfoDiv.append(songNameSpan);
      songInfoDiv.append(br2);
      songInfoDiv.append(yearSpan);
      songInfoDiv.append(br3);
      songInfoDiv.append(genreSpan);

      lyricsContainerDiv.append(lyricsSpan);
      

    });
  } //for loop ends
});