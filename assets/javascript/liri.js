
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
      default:
          doWhatItSays();
          break;
  }
}

function getConcertInfo(artist) {
  
  if (artist == undefined) artist = "whitesnake"

  axios
    .get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
    .then(function (response) {

      // dump pretty data for analysis:
      var str = JSON.stringify(response.data, null, 2); // spacing level = 2
      fs.writeFile("../bands-response-data.txt", str, function(error) {})
      
      var resultsLimit = 5;
      for (i = 0; (response.data[i]) && (i < resultsLimit); i++) {
        var rd = response.data[i]

        var artists = rd.lineup;
            artists = (artists.toString()).replace(",",", ");
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
      }
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
    var resultLimit = 3;

    spotify.search({ type: 'track', query: song, limit: resultLimit}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        // dump pretty data for analysis:
        var str = JSON.stringify(data, null, 2); // spacing level = 2
        fs.writeFile("../spotify-response-data.txt", str, function(error) {})

        for (i = 0; i < resultLimit && data.tracks.items[i] != undefined; i++) {
          var songTitle = data.tracks.items[i].name;
          var artistName = data.tracks.items[i].artists[0].name;
          var previewURL = data.tracks.items[i].preview_url;
            if (previewURL === null) previewURL = "N/A";

          var tempLit = 
          (` 
          title:    ${songTitle}
          artist:   ${artistName}
          preview link: 
          ${previewURL}
          `)

          console.log(tempLit)
          writeLog(tempLit)
        }

    })
}

function getMovieInfo(movie) {

    if (movie === undefined) movie = '\"howard the duck\"'

    axios
    .get("http://www.omdbapi.com/?t=" + movie + "&apikey=trilogy")
    .then(function(response) {
        
      var rd = response.data;

      // dump pretty data for analysis:
      var str = JSON.stringify(rd, null, 2); // spacing level = 2
      fs.writeFile("../omdb-response-data.txt", str, function(error) {})

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
  
    var splitLines = data.split(/\r?\n/);

    var roulette = Math.floor(Math.random() * splitLines.length);
    var selectLine = splitLines[roulette]

    var c = selectLine.slice(0, selectLine.indexOf(','))
    var v = selectLine.slice(selectLine.indexOf(',') + 1)
        v = v.split('"').join('');
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