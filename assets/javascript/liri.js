
require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs")

var command = process.argv[2]
var value = process.argv[3]

switch (command) {
    case "concert-this": 
        console.log("concert " + value);
        getConcertInfo(value);
        break;
    case "spotify-this-song": 
        console.log("spot " + value)
        getSpotifyInfo(value);
        break;
    case "movie-this": 
        console.log("movie " + value)
        getMovieInfo(value);
        break;
    case "do-what-it-says ":
        console.log("do" + value)
        doWhatItSays(value);
        break;
}

function getConcertInfo(artist) {
    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
      // If the axios was successful...
      console.log("got the data:", response.data)
      console.log("date/time: ", response.datetime)
      console.log("venue: ", response.venue.name)
      console.log("location: ", response.venue.city, ", " + response.venue.region)
    })

    // "datetime": "2017-03-19T11:00:00",
    // "description": "This is a description",
    // "venue": {
    //   "name": "Encore Beach Club",
    //   "latitude": "36.12714",
    //   "longitude": "-115.1629562",
    //   "city": "Las Vegas",
    //   "region": "NV",
    //   "country": "United States"

    .catch(function(error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

function getSpotifyInfo(song) {
    if (song === undefined) song = "the sign"

    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: song, limit: 1}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        var songTitle = data.tracks.items[0].name;
        var artistName = data.tracks.items[0].artists[0].name;
        var previewURL = data.tracks.items[0].preview_url

    console.log("title: ", songTitle)
    console.log("artist: ", artistName); 
    console.log("preview link: ", previewURL)
})
}

function getMovieInfo(value) {

}

function doWhatItSays(value) {

}