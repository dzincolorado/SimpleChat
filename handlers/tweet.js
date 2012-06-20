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
		loggingHelper.log('tweet:' + request.body.tweet);
		var newChirp = new chirpHelper.chirp(request.body.tweet);
		loggingHelper.log('tweet:' + JSON.stringify(newChirp));
		
		//TODO: try use nextid
	
		/*
		redisClient.incr("nextid", function(err, id){
			
		});
		*/
		
		//redis rpush onto list
		redisClient.rpush("tweets", JSON.stringify(newChirp), function(){
			loggingHelper.log('accepts: ' + request.headers['accept']);
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
	
	//http://api.twitter.com/1/statuses/public_timeline.json
	//http://search.twitter.com/search.json?q=LuckyPiePizza
	//avengers
	//http://api.twitter.com/1/trends/daily.json
	//http://api.twitter.com/1/statuses/user_timeline.json?screen_name=LuckyPiePizza
}

function parseTweets(err, docs)
{
	var items = [];
	if(docs != null){
		loggingHelper.log(docs);
		
		var jsonDoc = null;
		docs.forEach(function(doc){
			jsonDoc = JSON.parse(doc);
			loggingHelper.log(jsonDoc.content);
			items.push(new chirpHelper.chirp(jsonDoc.content, jsonDoc.createDate));
		});
		
	}
	
	return items;
}

function RenderTweetsToResponse(request, response, items){
	response.render("index", {
		locals: 
			{
				'title': "Los Tweets", 
				'header': "Welcome to Los Tweets!",
				'tweets': (items != null && items.length > 0) ? items : null,
				'user': request.user
			}
		});
}

function index(request, response){
	
	var items = [];
	if(request.isAuthenticated() === true) {
		redisClient.lrange("tweets", 0, 100, function(err, docs){
			items = parseTweets(err, docs);
			RenderTweetsToResponse(request, response, items);
		});
	}
	else {
		RenderTweetsToResponse(request, response, items);
	}
}

function login(request, response)
{
	response.render("login", {
		locals:
		{
			'title': "Login into Los Tweets",
			'header': "Login into Los Tweets",
			'user': request.user
		}
	})
}

exports.newTweet = newTweet;
exports.getTweets = getTweets;
exports.index = index;
exports.login = login;