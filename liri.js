var fs = require("fs");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var command = process.argv[2];
var userInput = process.argv.splice(3);


var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var client = new twitter({
    consumer_key: keys.twitter.consumer_key,
    consumer_secret: keys.twitter.consumer_secret,
    access_token_key: keys.twitter.access_token_key,
    access_token_secret: keys.twitter.access_token_secret
});


switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifySong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}


function myTweets() {
	var params = {screen_name: 'aaronmayhew12'}; 
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
        if (!error) {
           
            console.log("----------");
            tweets.forEach(function(content) {
                console.log("My Tweets: " + content.text);
                console.log("Time tweet was created: " + content.created_at);
                console.log("----------");
            });
        } else {
            console.log(error);
        }

        log();
    });
}


function spotifySong() {
  
    spotify.search({ type: 'track', query: userInput || "The Sign Ace of Base" }, function(err, data) {

        var songData = data.tracks.items;

       
        if (err) {
            console.log(err);
        }

    
        if (songData.length > 0) {
            var firstResult = data.tracks.items[0];
            console.log("----------");
            console.log("YOU SEARCHED FOR " + userInput);
            console.log("Artist: " + firstResult.artists[0].name);
            console.log("Song Name: " + firstResult.name);
            console.log("Preview Link of Song: " + firstResult.preview_url);
            console.log("Album: " + firstResult.album.name);
            console.log("----------");
        } else {
            console.log("No songs found! Try another song.");
        }

        log();
    });
}


function movieThis() {
    request('http://www.omdbapi.com/?t=' + (userInput || "Mr. Nobody") + "&tomatoes=true", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            
            var movieData = JSON.parse(body);

          
            console.log("-----MOVIE INFO-----");
            console.log("Title: " + movieData.Title);
            console.log("Year: " + movieData.Year);
            console.log("IMDB Rating: " + movieData.imdbRating);
            console.log("Country: " + movieData.Country);
            console.log("Language: " + movieData.Language);
            console.log("Plot: " + movieData.Plot);
            console.log("Actors: " + movieData.Actors);
            console.log("Rotten Tomatoes Rating: " + movieData.tomatoRating);
            console.log("---------------------");
        } else {
            console.log("Error occurred: ", error);
        }

        log();
    });
}

function doWhatItSays() {
    
    fs.readFile("random.txt", "utf8", function(error, data) {

       
        if (error) throw error;

        var dataArr = data.split(",");

        userInput = dataArr[1];

     
        switch (dataArr[0].trim()) {
            case "my-tweets":
                myTweets();
                break;

            case "spotify-this-song":
                spotifySong(userInput);
                break;

            case "movie-this":
                movieThis(userInput);
                break;
        }
        log();
    });
}


function log(data) {
	fs.appendFile("log.txt", command + " " + userInput + "" + '\n', function(err) {
		 
		if (err) {
			console.log("Error occured", err); 
		} 
	});
}