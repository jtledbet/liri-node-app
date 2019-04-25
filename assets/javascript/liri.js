
require("dotenv").config();
var Spotify = require("node-spotify-api");
var moment = require("moment")
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs")

var pa = process.argv;

var command = process.argv[2]
var value = process.argv[3]

for (i = 4; pa[i]; i++)
    value += " " + pa[i]

var searchString = "user input command: " + command + " " + value;

crossRoads(command, value);

function crossRoads(command, value) {
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
      case "do-what-it-says":
          doWhatItSays();
          break;
  }
}

function getConcertInfo(artist) {
    axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function(response) {

      var rd = response.data[0]
    
      var artists = rd.lineup;
      var venue = rd.venue.name;
      var datetime = rd.datetime;
      var city = rd.venue.city;
      var state = rd.venue.region;
      var country = rd.venue.country;
      var location = city + ", " + state + " (" + country + ")"
      var url = rd.url;

      datetime = moment(datetime).format("MM/DD/YYYY");

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
      writeLog(tempLit)

    })

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
        writeLog(tempLit)

    })
}

function getMovieInfo(movie) {

    if (movie === undefined) movie = '\"howard the duck\"'

    axios
    .get("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy")
    .then(function(response) {
        
      var rd = response.data;

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

function doWhatItSays() {

  fs.readFile("../../random.txt", "utf8", function(error, data) {

    if (error) {
      return console.log(error);
    }
  
    console.log(data)

    var c = data.slice(0, data.indexOf(','))
    var v = data.slice(data.indexOf(',') + 1)
    
    crossRoads(c, v);
  
  });
}

function writeLog(data) {
    // console.log(data)
    var writeString = ("\n" + searchString + "\n" + "-----------------" + "\n" + data + "\n" + "-----------------" + "\n")

    fs.appendFile("../log.txt", writeString, function(error) {
        // If the code experiences any errors it will log the error to the console.
          if (error) {
              return console.log(error);
          }
    })
}