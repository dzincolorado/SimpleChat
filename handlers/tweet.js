var chirpHelper = require("../helpers/chirp");
var httpHelper = require("../helpers/http");
var http = require("http");
var loggingHelper = require("../helpers/logging");
var tweetValidator = require("../validators/tweet");
var twitterClient = http.createClient(80, "api.twitter.com");

var mongo = require("mongojs").connect("chatServer");

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

function getTwitterTimeline(request, response){
	
	
	var requestType = request.params.type;
	
	console.log("getTwitterTimeline! with param: " + requestType);
	
	if(requestType == "new"){
		var twitterRequest = twitterClient.request("GET", "/1/statuses/public_timeline.json", {"host": "api.twitter.com"});
		
		twitterRequest.addListener("response", function(twitterResponse){
			var body = "";
			
			twitterResponse.addListener("data", function(data){
				body += data; 
			});
			
			twitterResponse.addListener("end", function(end){
				var twitterTimeline = JSON.parse(body);
				if(twitterTimeline.length > 0){
					var twitterPublicTimelineCollection = mongo.collection("twitterPublicTimeline");
					twitterPublicTimelineCollection.save(twitterTimeline);
					
					console.log("Receieved Twitter Timeline; length is: " + twitterTimeline.length);
					
					getCachedTwitterTimeline(response, twitterPublicTimelineCollection);
				}
			});
		});
		
		twitterRequest.end();
	}
	else
	{
		getCachedTwitterTimeline(response);
	}
}

//TODO: need to get colllection count for paging
function getTwitterTimelineCount(response){
	var col = mongo.collection("twitterPublicTimeline");
	col.count(function(countValue){
		response.write(countValue);
		response.end();
	});
}

function getCachedTwitterTimeline(response, twitterPublicTimelineCollection){
	var col = twitterPublicTimelineCollection;
	
	if(typeof(col) == "undefined"){
		col = mongo.collection("twitterPublicTimeline");
	}
	
	//response.writeHead(200, {"content-type": "text/plain"});
	//TODO: fix created_at data type, sorting not working
	console.log("hitting mongo");
	col.find({}, {_id:1, "user.name": 2, "user.description":3, "user.profile_background_image_url":4, created_at:5}).sort({created_at: -1}, 
		function(err, docs){
			if(!docs){
				response.end();
			}
			
			console.log("doc count: " + docs.length);
			response.write(JSON.stringify(docs));
			response.end();
		});
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
exports.getTwitterTimeline = getTwitterTimeline;
exports.index = index;
exports.login = login;