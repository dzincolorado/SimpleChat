var chirpHelper = require("../helpers/chirp");
var httpHelper = require("../helpers/http");
var loggingHelper = require("../helpers/logging");
var tweetValidator = require("../validators/tweet");
var db = require('mongojs').connect('chatServer', ['tweets']);

function newTweet(request, response){
	if(request.body && request.body.tweet)
	{
		//TODO:  need better validation handling and messaging
		if(!tweetValidator.validate(request.body.tweet)){
			response.send({"status":"nok", "message":"Tweet must be at least 1 character long."});
			response.end();
		}
		db.tweets.save(new chirpHelper.chirp(request.body.tweet));

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
	
	db.tweets.find(function(err, docs){
		loggingHelper.logToConsole(docs);
		
		response.send(docs);
	});
}

function index(request, response){
	
	db.tweets.find(function(err, docs){
		loggingHelper.logToConsole(docs);
		
		response.render("index", {
		locals: 
			{
				'title': "The Tweets", 
				'header': "Welcome to Les Tweets!",
				'tweets': (typeof docs != "undefined") ? docs : null
			}
		});
	});
}

exports.newTweet = newTweet;
exports.getTweets = getTweets;
exports.index = index;