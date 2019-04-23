
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
    
      var artists = rd.lineup;
      var venue = rd.venue.name;
      var datetime = rd.datetime;
      var city = rd.venue.city;
      var state = rd.venue.region;
      var country = rd.venue.country;
      var location = city + ", " + state + " (" + country + ")"
      var url = rd.url;

      // console.log("artists: ", artists)
      // console.log("date/time: ", datetime)
      // console.log("venue: ", venue)
      // console.log("location: ", location)
      // console.log("click here for details: \n" + url)

      var tempLit = 
      (` 
      artists:    ${artists}
      date/time:  ${datetime}
      venue:      ${venue}
      location:   ${location}

      click below for details:  
      ${url}
      `)

      console.log(tempLit)

      // var toWrite = [];
      // toWrite.push("artists: " + artists)
      // toWrite.push("\n" + "date/time: " + datetime)
      // toWrite.push("\n" + "venue: " + venue)
      // toWrite.push("\n" + "location: " + location)
      // toWrite.push("\n" + "click here for details: \n" + url)

      // writeLog(toWrite);

      writeLog(tempLit)
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

        var tempLit = 
        (` 
        title:    ${songTitle}
        artist:   ${artistName}
        preview link: 
        ${previewURL}
        `)

        console.log(tempLit)
        writeLog(tempList)

        // console.log("title: ", songTitle)
        // console.log("artist: ", artistName); 
        // console.log("preview link: ", previewURL)

        
        // var toWrite = [];
        // toWrite.push("title: " + songTitle)
        // toWrite.push("\n" + "artist: " + artistName); 
        // toWrite.push("\n" + "preview link: " + previewURL)

        // writeLog(toWrite)
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

      var title = rd.Title;
      var year = rd.Year;
      var imdbRating = rd.imdbRating;
      var imdbVotes = rd.imdbVotes;
      var rtRating = rd.Ratings[1].Value;
      var country = rd.Country;
      var language = rd.Language;
      var plot = rd.Plot;
      var actors = rd.Actors;
      var awards = rd.Awards;

      // console.log("title: ", title)
      // console.log("year: ", year)
      // console.log("imdb rating: ", imdbRating, " after ", imdbVotes, " votes")
      // console.log("rotten tomatoes rating: ", rtRating)
      // console.log("country: ", country)
      // console.log("language: ", language)
      // console.log("plot: ", plot)
      // console.log("actors: ", actors)
      // console.log("awards: ", awards)
      
      // var movieInfo = []
      // movieInfo.push("title: " + title)
      // movieInfo.push("\n" + "year: " + year)
      // movieInfo.push("\n" + "imdb rating: " + imdbRating + " after " + imdbVotes + " votes")
      // movieInfo.push("\n" + "rotten tomatoes rating: " + rtRating)
      // movieInfo.push("\n" + "country: " + country)
      // movieInfo.push("\n" + "language: " + language)
      // movieInfo.push("\n" + "plot: " + plot)
      // movieInfo.push("\n" + "actors: " + actors)
      // movieInfo.push("\n" + "awards: " + awards)

      // writeLog(movieInfo)

      var tempLit = 
      (` 
      title:                  ${title}
      year:                   ${year}
      imdb rating:            ${imdbRating} (after ${imdbVotes} votes)
      rotten tomatoes rating: ${rtRating}
      country of origin:      ${country}
      language(s):            ${language}
      plot summary:           ${plot}
      actors:                 ${actors}
      awards:                 ${awards}
      `)

      console.log(tempLit)
      writeLog(tempLit)
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