var input = "Money Trees - Kendrick Lamar (good kid, m.A.A.d city)";//to be changed dynamically through JS
input = input.split('-');

var lyricsContainerDiv = $('#lyrics-container');
var songInfoDiv = $('#song-info');

var trackInfoArray = JSON.parse(localStorage.getItem('searchHistory'));
var trackInfo = trackInfoArray[trackInfoArray.length - 1];
var trackName = trackInfo.trackName;

const settings = {
  async: true,
  crossDomain: true,
  url: `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${trackName}&per_page=1&page=1`,
  method: 'GET',
  cache: true,
  headers: {
    'X-RapidAPI-Key': '286c8ba4c7msh0915c4905dcf20bp1e34ccjsn8173d621f28b',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
  }
};

$.ajax(settings).then(function (response) {

  for (var i=0; i<response.hits.length; i++) {
    var artistNames = response.hits[i].result.artist_names;
    var songID = response.hits[i].result.id;
    var lyricsURL = response.hits[i].result.url;

    const getLyrics = {
      async: true,
      crossDomain: true,
      url: `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${songID}`,
      method: 'GET',
      cache: true,
      headers: {
        'X-RapidAPI-Key': '286c8ba4c7msh0915c4905dcf20bp1e34ccjsn8173d621f28b',
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

      
      const getSongDetails = {
        async: true,
        crossDomain: true,
        url: `https://genius-song-lyrics1.p.rapidapi.com/song/details/?id=${songID}`,
        method: 'GET',
        cache: true,
        headers: {
          'X-RapidAPI-Key': '286c8ba4c7msh0915c4905dcf20bp1e34ccjsn8173d621f28b',
          'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
      };

      var albumCoverDiv = $('<div></div>');

      $.ajax(getSongDetails).then(function (songDetailsUrlResponse) {
        var albumCoverUrl = songDetailsUrlResponse.song.header_image_thumbnail_url;
        var youtubeUrl = songDetailsUrlResponse.song.youtube_url;

        var albumCoverImg = $('<img>');
        albumCoverImg.attr('src', albumCoverUrl);
        albumCoverImg.attr('alt', 'Album Cover Image');

        albumCoverDiv.append(albumCoverImg);
      });
      
      var artistNameSpan = $('<span></span>');
      var songNameSpan = $('<span></span>');
      var yearSpan = $('<span></span>');
      var genreSpan = $('<span></span>');
      var lyricsSpan = $('<span></span>');

      var br1 = $('<br>');
      var br2 = $('<br>');
      var br3 = $('<br>');
      var br4 = $('<br>');
      
      artistNameSpan.text(artist);
      songNameSpan.text(song);
      yearSpan.text(year);
      genreSpan.text(genre.toUpperCase());
      lyricsSpan.html(updatedLyricsHTML);

      songInfoDiv.append(albumCoverDiv);
      songInfoDiv.append(br1);
      songInfoDiv.append(artistNameSpan);
      songInfoDiv.append(br2);
      songInfoDiv.append(songNameSpan);
      songInfoDiv.append(br3);
      songInfoDiv.append(yearSpan);
      songInfoDiv.append(br4);
      songInfoDiv.append(genreSpan);

      lyricsContainerDiv.append(lyricsSpan);
      
    });
  } //for loop ends
});