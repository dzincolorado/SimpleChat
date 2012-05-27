var db = require('mongojs').connect('chatServer', ['tweets']);

function persistTweet(tweet){
	console.log("persisting tweet: " + tweet)
	db.tweets.save(tweet);
}

function getTweets(){
	
	//TODO:  not currently working because of async nature of returning resultset.  Need to figure out
	var tweets = db.tweets.find();
	
	console.log(tweets[0]);
	
	/*
	db.tweets.find().sort({createDate: 1}, function(err, docs){
		console.log("getting tweets: " + docs.length);
		tweets = docs;
	});
	*/
	
	return tweets;
}

exports.persistTweet = persistTweet;
exports.getTweets = getTweets;