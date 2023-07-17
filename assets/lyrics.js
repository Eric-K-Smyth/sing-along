var lyricsContainerDiv = $('#lyric-container');

var songInfoDiv = $('#song-info');
var trackName;

//retrive the query parameters of the index.html 
const urlParams = new URLSearchParams(window.location.search);
const trackNameHistory = urlParams.get('trackname');
const historybuttonclick = urlParams.get('historybuttonclick');

//if a saved track is clicked, show its lyrics
if (historybuttonclick == "true"){
  trackName = trackNameHistory;
  
}
else{ //else show lyrics of the searched track 
  var trackInfoArray = JSON.parse(localStorage.getItem('searchHistory'));
  var trackInfo = trackInfoArray[trackInfoArray.length - 1];
  trackName = trackInfo.trackName;
}

//object includes parameters for the ajax function
const settings = {
  async: true,
  crossDomain: true,
  url: `https://genius-song-lyrics1.p.rapidapi.com/search/?q=${trackName}&per_page=1&page=1`,
  method: 'GET',
  cache: true,
  headers: {
    'X-RapidAPI-Key': 'fcee368079msh6764f551b10a0e8p1c4b16jsna85c250a4997',
    'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
  }
};

//ajax function retrieves the songID based on the track name
$.ajax(settings).then(function (response) {
    var songID = response.hits[0].result.id;
    const getLyrics = {
      async: true,
      crossDomain: true,
      url: `https://genius-song-lyrics1.p.rapidapi.com/song/lyrics/?id=${songID}`,
      method: 'GET',
      cache: true,
      headers: {
        'X-RapidAPI-Key': 'fcee368079msh6764f551b10a0e8p1c4b16jsna85c250a4997',
        'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
      }
    };

    // ajax function retrieves the track info and lyrics based on the songID
    $.ajax(getLyrics).then(function (lyricsUrlResponse) {
      var artist = lyricsUrlResponse.lyrics.tracking_data.primary_artist;
      var song = lyricsUrlResponse.lyrics.tracking_data.title;
      var year = lyricsUrlResponse.lyrics.tracking_data.created_year;
      var genre = lyricsUrlResponse.lyrics.tracking_data.primary_tag;
      var lyricsHTML = lyricsUrlResponse.lyrics.lyrics.body.html;

      //encapsulated html code block which includes the lyrics is assigned to a variable after all the <a> tags are replaced with <span> tags
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
          'X-RapidAPI-Key': 'fcee368079msh6764f551b10a0e8p1c4b16jsna85c250a4997',
          'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
      };

      var albumCoverDiv = $('<div></div>');

      //ajax function retrieves the song cover
      $.ajax(getSongDetails).then(function (songDetailsUrlResponse) {
        var albumCoverUrl = songDetailsUrlResponse.song.header_image_thumbnail_url;
        var youtubeUrl = songDetailsUrlResponse.song.youtube_url;

        var albumCoverImg = $('<img>');
        albumCoverImg.attr('src', albumCoverUrl);
        albumCoverImg.attr('alt', 'Album Cover Image');

        albumCoverDiv.append(albumCoverImg);
      });
      
      //song info, cover, and lyrics are dynamically add to the HTML page
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
      songNameSpan.text(song).css('font-weight', 'bold');
      yearSpan.text(year);
      genreSpan.text(genre.toUpperCase()).css('font-style', 'italic');
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
});