var input = "money";//to be changed dynamically through JS
var perPage = 5;//to be changed dynamically through JS

var lyricsContainerDiv = $('#lyrics-container');

const settings = {
  async: true,
  crossDomain: true,
  url: `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${input}&per_page=${perPage}&page=1`,
  method: 'GET',
  cache: true,
  headers: {
    'X-RapidAPI-Key': '650f891468msh2daef7dcb2d159dp113f1bjsn1d4998ee4778',
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
        'X-RapidAPI-Key': '650f891468msh2daef7dcb2d159dp113f1bjsn1d4998ee4778',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
      }
    };

    $.ajax(getLyrics).then(function (lyricsUrlResponse) {

      var artist = lyricsUrlResponse.lyrics.tracking_data.primary_artist;
      var song = lyricsUrlResponse.lyrics.tracking_data.title;
      var lyricsHTML = lyricsUrlResponse.lyrics.lyrics.body.html;
      var updatedLyricsHTML = $(lyricsHTML).find('a').replaceWith(function() {
        return '<span>' + $(this).text() + '</span>';
      }).end().prop('outerHTML');

      console.log(lyricsUrlResponse);
      console.log(lyricsHTML);

      var songDiv = $('<div></div>');
      var artistNameSpan = $('<span></span>');
      var songNameSpan = $('<span></span>');
      var lyricsSpan = $('<span></span>');

      var linebreak1 = $('<br>');
      var linebreak2 = $('<br>');
      var linebreak3 = $('<br>');
      var linebreak4 = $('<br>');

      artistNameSpan.text(`artist: ${artist}`);
      songNameSpan.text(`song: ${song}`);
      lyricsSpan.html(`lyrics: ${updatedLyricsHTML}`);

      songDiv.append(artistNameSpan);
      songDiv.append(linebreak1);
      songDiv.append(songNameSpan);
      songDiv.append(linebreak2);
      songDiv.append(lyricsSpan);
      songDiv.append(linebreak3);
      songDiv.append(linebreak4);
      lyricsContainerDiv.append(songDiv);
      

    });
  } //for loop ends
});