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
	response.render("index", {title: "The Tweets", header: "Tweets"});
})

expressServer.post("/send", function(request, response){
	if(request.body && request.body.tweet)
	{
		tweets.push(request.body.tweet);
		response.send({"status":"ok", "message":"Tweet Received!"});
	}
	else
	{
		response.send({"status":"nok", "message":"No Tweet received. :("});
	}
})

expressServer.get("/tweets", function(request, response){
	response.send(tweets);
})
