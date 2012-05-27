var tweetStorage = require("../dataAccess/tweet");
var chirpHelper = require("../helpers/chirp");
var httpHelper = require("../helpers/http");

function newTweet(request, response){
	if(request.body && request.body.tweet)
	{
		
		tweetStorage.persistTweet(new chirpHelper.chirp(request.body.tweet));

		console.log('tweet:' + request.body.tweet);
		console.log('accepts: ' + request.headers['accept']);
		if(httpHelper.acceptsHtml(request.headers['accept'])){
			response.redirect('/', 302);
		}
		else{
			response.send({"status":"ok", "message":"Tweet Received!"});
		}
	}
	else
	{
		response.send({"status":"nok", "message":"No Tweet received. :("});
	}
}

function getTweets(request, response){
	response.send(tweetStorage.getTweets());
}

function index(request, response){
	
	var tweets = tweetStorage.getTweets();
	console.log(tweets);
	/*
	if(tweets.length == 0){
		tweets.push(new chirpHelper.chirp("test"));
	}
	*/
	
	response.render("index", {
		locals: 
			{
				'title': "The Tweets", 
				'header': "Welcome to Les Tweets!",
				'tweets': (typeof tweets != "undefined") ? tweets : null
			}
		});
}

exports.newTweet = newTweet;
exports.getTweets = getTweets;
exports.index = index;