var chirpHelper = require("../helpers/chirp");
var httpHelper = require("../helpers/http");
var loggingHelper = require("../helpers/logging");
var tweetValidator = require("../validators/tweet");
var db = require("redis"),
	redisClient = db.createClient(6379, "127.0.0.1");

function newTweet(request, response){
	if(request.body && request.body.tweet)
	{
		//TODO:  need better validation handling and messaging
		if(!tweetValidator.validate(request.body.tweet)){
			response.send({"status":"nok", "message":"Tweet must be at least 1 character long."});
			response.end();
		}
		
		console.log('tweet:' + request.body.tweet);
		var newChirp = new chirpHelper.chirp(request.body.tweet);
		console.log('tweet:' + JSON.stringify(newChirp));
		
		//TODO: try use nextid
	
		/*
		redisClient.incr("nextid", function(err, id){
			
		});
		*/
		
		//redis rpush onto list
		redisClient.rpush("tweets", JSON.stringify(newChirp), function(){
			console.log('accepts: ' + request.headers['accept']);
			if(httpHelper.acceptsHtml(request.headers['accept'])){
				response.redirect('/', 302);
			}
			else{
				response.send({"status":"ok", "message":"Tweet Received!"});
			}			
		});

	}
	else
	{
		response.send({"status":"nok", "message":"No Tweet received. :("});
	}
}

function getTweets(request, response){
	
	redisClient.lrange("tweets", 0, 100, function(err, docs){
		if(docs != null){
			loggingHelper.logToConsole(docs);
			response.send(JSON.parse(docs));	
		}
	});
}

function index(request, response){
	
	redisClient.lrange("tweets", 0, 100, function(err, docs){

		if(docs != null && docs.length > 0)
		{
			loggingHelper.logToConsole(docs);
		}
		
		var items = [];
		var jsonDoc = null;
		docs.forEach(function(doc){
			jsonDoc = JSON.parse(doc);
			loggingHelper.logToConsole(jsonDoc.content);
			items.push(new chirpHelper.chirp(jsonDoc.content, jsonDoc.createDate));
		});
		
		response.render("index", {
		locals: 
			{
				'title': "The Tweets", 
				'header': "Welcome to Les Tweets!",
				'tweets': (typeof docs != "undefined" && docs != null && docs.length > 0) ? items : null
			}
		});
	});
}

exports.newTweet = newTweet;
exports.getTweets = getTweets;
exports.index = index;