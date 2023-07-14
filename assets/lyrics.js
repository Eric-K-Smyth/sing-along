console.log("pagereloaded");

var lyricsContainerDiv = $('#lyric-container');

var songInfoDiv = $('#song-info');
var trackName;

const urlParams = new URLSearchParams(window.location.search);
const trackNameHistory = urlParams.get('trackname');
const historybuttonclick = urlParams.get('historybuttonclick');
//console.log(historybuttonclick);
//console.log(trackNameHistory);

if (historybuttonclick == "true"){
console.log(historybuttonclick);
console.log(trackNameHistory);

  trackName = trackNameHistory;
  
} else{
  var trackInfoArray = JSON.parse(localStorage.getItem('searchHistory'));
  var trackInfo = trackInfoArray[trackInfoArray.length - 1];
  trackName = trackInfo.trackName;
}

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

$.ajax(settings).then(function (response) {
console.log(response);
 // for (var i=0; i<response.hits.length; i++) {
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

    $.ajax(getLyrics).then(function (lyricsUrlResponse) {
      console.log(lyricsUrlResponse);
      var artist = lyricsUrlResponse.lyrics.tracking_data.primary_artist;
      var song = lyricsUrlResponse.lyrics.tracking_data.title;
      var year = lyricsUrlResponse.lyrics.tracking_data.created_year;
      var genre = lyricsUrlResponse.lyrics.tracking_data.primary_tag;
      var lyricsHTML = lyricsUrlResponse.lyrics.lyrics.body.html;
      console.log(song);
      console.log(songID);
      console.log(lyricsHTML);
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
  //} //for loop ends
});