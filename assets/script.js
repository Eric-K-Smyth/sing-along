var client_id = '0d29a13314704580a8e1dbb68e0ec812';
var client_secret = 'd26b235197614f57ba9708b20366a313';
var accessToken;
var searchHistory = [];

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

  function loadSearchHistory() {
    var storedSearchHistory = localStorage.getItem('searchHistory');
    if (storedSearchHistory) {
      searchHistory = JSON.parse(storedSearchHistory);
      displaySearchHistory();
    }
  }



  function searchSong() {
  var searchInput = document.getElementById('searchInput').value;

  fetch(`https://api.spotify.com/v1/search?q=${searchInput}&type=track&limit=5`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  })
    .then(response => response.json())
    .then(data => {
      var resultRow = document.getElementById('result-row');
      resultRow.innerHTML = '';

      var row1 = document.createElement("div");
      row1.className = "row";
      var row2 = document.createElement("div");
      row2.className = "row";

      var cardCount = 0;

      data.tracks.items.forEach(track => {
        var trackName = track.name;
        var artistName = track.artists[0].name;
        var albumName = track.album.name;
        var albumIconUrl = track.album.images[0].url;

        var colEl = document.createElement("div");
        colEl.className = "col s12 m4 l4";
        var cardEl = document.createElement("div");
        cardEl.className = "card";
        var cardImageEl = document.createElement("div");
        cardImageEl.className = "card-image";
        var img = document.createElement("img");
        img.src = albumIconUrl;
        var caption = document.createElement("span");
        caption.className = "card-caption";

        caption.textContent = `${trackName} - ${artistName} (${albumName})`;
        caption.style.visibility = "hidden";

        cardImageEl.appendChild(img);
        cardImageEl.appendChild(caption);
        cardEl.appendChild(cardImageEl);
        colEl.appendChild(cardEl);

        img.addEventListener("mouseover", function() {
          caption.style.visibility = "visible";
        });

      img.addEventListener("mouseout", function() {
          caption.style.visibility = "hidden";
        });

        if (cardCount % 2 === 0) {
          row1.appendChild(colEl);
        } else {
          row2.appendChild(colEl);
        }
           // Create a click event listener to save the song to the search history
        cardImageEl.addEventListener('click', function () {
        saveToSearchHistory(trackName, artistName, albumName, albumIconUrl);
        window.location.href = "lyrics.html";
        //goes to lyric page
      });
        cardCount++;
      });
        resultRow.appendChild(row1);
        resultRow.appendChild(row2);

        displaySearchHistory();
    })
    .catch(error => console.error(error));
}

function saveToSearchHistory(trackName, artistName, albumName, albumIconUrl) {
  
   // Check if the song already exists in the search history
   var duplicateSong = searchHistory.find(function(song) {
    return song.trackName === trackName &&
           song.artistName === artistName &&
           song.albumName === albumName &&
           song.albumIconUrl === albumIconUrl;
  });

  if (duplicateSong) {
    return; // Skip adding duplicate entries
  }

  // Create an object representing the song
  var song = {
    trackName: trackName,
    artistName: artistName,
    albumName: albumName,
    albumIconUrl: albumIconUrl
  };

  // Remove the oldest item if search history exceeds 5 items
  if (searchHistory.length >= 5) {
    searchHistory.shift();
  }

  // Add the song to the search history
  searchHistory.push(song);

  // Update the search history display
  displaySearchHistory();

  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

function displaySearchHistory() {
  var searchHistoryContainer = document.getElementById('search-history');
  searchHistoryContainer.innerHTML = '';
  searchHistoryContainer.classList.add('search-history-container');
   
  
  if (searchHistory.length > 0) {
  var title = document.createElement('h6');
  title.textContent = 'History';
  searchHistoryContainer.appendChild(title);
   }

  searchHistory.forEach(function (song) {
    var albumIcon = document.createElement('img');
    albumIcon.src = song.albumIconUrl;
    albumIcon.className = "history-icon";
    albumIcon.style.width = '100px'; // Set width to 100px
    albumIcon.style.height = '100px'; // Set height to 100px
    console.log(song);
  var historybuttonclick = false;
    albumIcon.addEventListener('click', function () {
      
      historybuttonclick = true;
      window.location.href = `lyrics.html?trackname=${song.trackName}&historybuttonclick=${historybuttonclick}`;
    });

    searchHistoryContainer.appendChild(albumIcon);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  var searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', searchSong);

  loadSearchHistory();
});