var tweetHandler = require("./handlers/tweet");
var loggingHelper = require("./helpers/logging");
var express = require("express");
var config = require("./config/config");
//var everyauth = require('everyauth');

var expressServer = express.createServer();
expressServer.everyauth = require('everyauth');

expressServer.everyauth.helpExpress(expressServer);
expressServer.listen(process.env.PORT || 8000);
loggingHelper.log("Listening on: " + expressServer.address().port);

expressServer.everyauth.debug = true;

var usersById = {};
var nextUserId = 0;
var usersByTwitId = {};

//TODO: add to new module
function addUser (source, sourceUser) {
  var user;
  if (arguments.length === 1) { // password-based
    user = sourceUser = source;
    user.id = ++nextUserId;
    return usersById[nextUserId] = user;
  } else { // non-password-based
    user = usersById[++nextUserId] = {id: nextUserId};
    user[source] = sourceUser;
  }
  return user;
}

expressServer.everyauth.twitter
    .consumerKey(config.twitter.consumerKey)
    .consumerSecret(config.twitter.consumerSecret)
    .entryPath("/auth/twitter")
    .callbackPath("/auth/twitter/callback")
    .findOrCreateUser( function (sess, accessToken, accessSecret, twitUser) {
      return usersByTwitId[twitUser.id] || (usersByTwitId[twitUser.id] = addUser('twitter', twitUser));
    })
    .redirectPath('/');

expressServer.set("views", __dirname + "/views");
expressServer.set("view engine", "jade");
expressServer.set("view options", {layout:false});

expressServer.use(express.bodyParser());
expressServer.use(express.cookieParser());
expressServer.use(express.favicon());
expressServer.use(express.session({secret: 'the chirp'}))
expressServer.use(express.static(__dirname + "/assets"));
expressServer.use(expressServer.everyauth.middleware());
expressServer.use(expressServer.router);
expressServer.requireAuth = true;

//TODO: need to modularize routes
expressServer.get("/", tweetHandler.index);

expressServer.post("/send", function(request, response){
	
	if(expressServer.requireAuth === true && request.loggedIn === false){
		response.redirect("/auth/twitter/callback/");
	}
	else
	{
		tweetHandler.newTweet(request, response);	
	}
});
expressServer.get("/tweets", tweetHandler.getTweets);

//TODO:  need to handle logout

expressServer.everyauth.everymodule.handleLogout( function (request, response) {
  // Put you extra logic here
  
  request.logout(); // The logout method is added for you by everyauth, too
  
  // And/or put your extra logic here
  
  this.redirect(response, this.logoutRedirectPath());
});

expressServer.everyauth.everymodule
  .findUserById( function (id, callback) {
    callback(null, usersById[id]);
  });


//TODO: move error handling out of here
//A Route for Creating a 500 Error (Useful to keep around)
expressServer.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
/*expressServer.get('/*', function(req, res){
    throw new NotFound;
});
*/

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}
