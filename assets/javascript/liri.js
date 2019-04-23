
require("dotenv").config();
var Spotify = require("node-spotify-api");
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs")

var pa = process.argv;

var command = process.argv[2]
var value = process.argv[3]

for (i = 4; pa[i]; i++)
    value += " " + pa[i] 

var searchString = "user input command: " + command + " " + value;

switch (command) {
    case "concert-this": 
        getConcertInfo(value);
        break;
    case "spotify-this-song": 
        getSpotifyInfo(value);
        break;
    case "movie-this": 
        getMovieInfo(value);
        break;
    case "do-what-it-says ":
        doWhatItSays(value);
        break;
}

function getConcertInfo(artist) {
    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {
      // If the axios was successful...
      var rd = response.data[0]
    
      console.log("artists: ", rd.lineup)
      console.log("date/time: ", rd.datetime)
      console.log("venue: ", rd.venue.name)
      console.log("location: ", rd.venue.city + ", " + rd.venue.region, "(", rd.venue.country, ")")
      console.log("click here for details: \n" + rd.url)

      var toWrite = [];
      toWrite.push("artists: " + rd.lineup)
      toWrite.push("\n" + "date/time: " + rd.datetime)
      toWrite.push("\n" + "venue: " + rd.venue.name)
      toWrite.push("\n" + "location: " + rd.venue.city + ", " + rd.venue.region + "(" + rd.venue.country + ")")
      toWrite.push("\n" + "click here for details: \n" + rd.url)
// implement "template literal" here
      writeLog(toWrite);
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
    if (song === undefined) song = "take on me"

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

        
        var toWrite = [];
        toWrite.push("title: " + songTitle)
        toWrite.push("\n" + "artist: " + artistName); 
        toWrite.push("\n" + "preview link: " + previewURL)

        writeLog(toWrite)
    })
}

function getMovieInfo(movie) {

    if (movie === undefined) movie = '\"howard the duck\"'

    axios
    .get("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy")
    .then(function(response) {
        var rd = response.data;
      // If the axios was successful...
    //   console.log("got the data:", response.data)
      console.log("title: ", rd.Title)
      console.log("year: ", rd.Year)
      console.log("imdb rating: ", rd.imdbRating, " after ", rd.imdbVotes, " votes")
      console.log("rotten tomatoes rating: ", rd.Ratings[1].Value)
      console.log("country: ", rd.Country)
      console.log("language: ", rd.Language)
      console.log("plot: ", rd.Plot)
      console.log("actors: ", rd.Actors)
      console.log("awards: ", rd.Awards)
      
      var movieInfo = []
      movieInfo.push("title: " + rd.Title)
      movieInfo.push("\n" + "year: " + rd.Year)
      movieInfo.push("\n" + "imdb rating: " + rd.imdbRating + " after " + rd.imdbVotes + " votes")
      movieInfo.push("\n" + "rotten tomatoes rating: " + rd.Ratings[1].Value)
      movieInfo.push("\n" + "country: " + rd.Country)
      movieInfo.push("\n" + "language: " + rd.Language)
      movieInfo.push("\n" + "plot: " + rd.Plot)
      movieInfo.push("\n" + "actors: " + rd.Actors)
      movieInfo.push("\n" + "awards: " + rd.Awards)

      writeLog(movieInfo)
    })

    // * Title of the movie.
    // * Year the movie came out.
    // * IMDB Rating of the movie.
    // * Rotten Tomatoes Rating of the movie.
    // * Country where the movie was produced.
    // * Language of the movie.
    // * Plot of the movie.
    // * Actors in the movie.

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

function doWhatItSays(value) {

}

function writeLog(data) {
    // console.log(data)
    var writeString = ("\n" + searchString + "\n" + "-----------------" + "\n" + data + "\n" + "-----------------" + "\n")

    fs.appendFile("log.txt", writeString, function(error) {
        // If the code experiences any errors it will log the error to the console.
          if (error) {
              return console.log(error);
          }
    })
}