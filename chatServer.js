var tweetHandler = require("./handlers/tweet");
var express = require("express");

var expressServer = express.createServer();
expressServer.listen(8000);

console.log("Listening on: " + expressServer.address().port);

expressServer.set("views", __dirname + "/views");
expressServer.set("view engine", "jade");
expressServer.set("view options", {layout:false});

expressServer.use(express.bodyParser());
expressServer.use(express.static(__dirname + "/assets"));

expressServer.get("/", tweetHandler.index);
expressServer.post("/send", tweetHandler.newTweet);
expressServer.get("/tweets", tweetHandler.getTweets);
