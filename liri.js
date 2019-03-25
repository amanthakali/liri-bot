require("dotenv").config();
let keys = require("./keys")
let axios = require("axios");
let Spotify = require("node-spotify-api");
let spotify = new Spotify(keys.spotify);
let moment = require("moment");
var fs = require("fs");


let userChoice = process.argv[2];
let inputParam = process.argv.slice(3).join("+");;


function main(userChoice, inputParam){

    switch(userChoice){
        case "concert-this":{
            concertSearch(inputParam)
            break;
        }
        case "spotify-this-songs":{
            songSearch (inputParam);
            break;
        }
        case "movie-this":{
            movieSearch(inputParam);
            break;
        }
        case "do-what-it-says":{
            doWhat();
            break;
        }
    }
}


main(userChoice, inputParam);


function movieSearch(inputParam){

    var queryURL = "https://www.omdbapi.com/?t=" + inputParam + "&y=&plot=short&apikey=trilogy";
    
        axios.get(queryURL).then(response => {
           var rottenTomatoes = response.data.Ratings[1];
            console.log(
                `\nTitle: ${response.data.Title}\nYear: ${
                  response.data.Year
                }\nIMB Rating: ${
                  response.data.imdbRating
                }\nRotten Tomatoes Rating: ${rottenTomatoes["Value"]}\nCountry Produced: ${
                  response.data.Country
                }\nLanguage: ${response.data.Language}\nPlot: ${
                  response.data.Plot
                }\nActors: ${
                  response.data.Actors
                }\n-----------------------------------------------------------------------`
              );
        });
      }


    function songSearch (inputParam){
    const searchParams = {
        type: "track",
        query: inputParam,
        limit: 20
        };
    
        spotify
        .search(searchParams)
        .then(function(response) {
            var tracks = response.tracks.items;
            tracks.forEach(track => {
            var artists = track.album.artists;
            artists.forEach(artist => {
                console.log(
                `\nAlbum: ${track.album.name}\nArtist: ${
                    artist.name
                }\nSong's Name: ${track.name}\nPreview URL: ${
                    track.preview_url
                }\n-----------------------------------------------`
                );
            });
            });
        })
        .catch(function(err) {
            console.log(err);
        });

    }
    

    function concertSearch(inputParam){
        var bandURL =
        "https://rest.bandsintown.com/artists/" + inputParam + "/events?app_id=codingbootcamp"
      axios
        .get(bandURL)
        .then(function(response) {
          var Concert = response.data;
          Concert.forEach(data => {
            var eventDate = moment(data.datetime).format(
              "MMM Do YYYY, h:mm a"
            );
            console.log(
              `\nVenue Name: ${data.venue.name}\nCity Name: ${
                data.venue.city
              }\nDate and Time: ${
                eventDate
              }\n-----------------------------------------------`
            );
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    }

    function doWhat(){
        fs.readFile("./random.txt", "utf8", function(err, data) {
            if (err) {
              return console.log(err);
            }
            var dataArr = data.split(",");
            inputParameter = dataArr[1];
            songSearch(inputParameter);
          });
    }