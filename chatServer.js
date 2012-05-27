var express = require("express");

var expressServer = express.createServer();
expressServer.listen(8000);

console.log("Listenging on: " + expressServer.address().port);

expressServer.set("views", __dirname + "/views");
expressServer.set("view engine", "jade");
expressServer.set("view options", {layout:false});

expressServer.use(express.bodyParser());
expressServer.use(express.static(__dirname + "/assets"));

var tweets = [];

//TODO: abstract verbs to respective request handlers

expressServer.get("/", function(request, response){
	//response.send("Welcome to my simple Node Twitter");
	console.log(tweets);
	response.render("index", {
		locals: 
			{
				'title': "The Tweets", 
				'header': "Welcome to Les Tweets!",
				'tweets': tweets
			}
		});
})

function chirp(tweet){
	this.value = tweet;
}

expressServer.post("/send", function(request, response){
	if(request.body && request.body.tweet)
	{
		tweets.push(new chirp(request.body.tweet));
		console.log('tweet:' + request.body.tweet);
		console.log('accepts: ' + request.headers['accept']);
		if(acceptsHtml(request.headers['accept'])){
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
})

expressServer.get("/tweets", function(request, response){
	response.send(tweets);
})

function acceptsHtml(header){
	var accepts = header.split(',');
	for(i=0;i<accepts.length;i++){
		if(accepts[i] === 'text/html') {return true;}
	}
}
