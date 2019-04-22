
require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var fs = require("fs")

// var spotify = new Spotify(keys.spotify);

var command = process.argv[2]
var value = process.argv[3]

switch (command) {
    case "concert-this": 
        console.log("concert" + value);
        getConcertInfo(value);
        break;
    case "spotify-this-song": 
        console.log("spot" + value)
        getSpotifyInfo(value);
        break;
    case "movie-this": 
        console.log("movie" + value)
        getMovieInfo(value);
        break;
    case "do-what-it-says":
        console.log("do" + value)
        doWhatItSays(value);
        break;
}

function getConcertInfo() {

}

function getSpotifyInfo() {

}

function getMovieInfo() {

}

function doWhatItSays() {

}