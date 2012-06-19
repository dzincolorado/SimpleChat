var tweetHandler = require("./handlers/tweet");
var loggingHelper = require("./helpers/logging");
var config = require("./config/config");
var express = require("express");
var passport = require("passport");
var passportTwitterStrategy = require("passport-twitter").Strategy;

//Passport serialize user
passport.serializeUser(function(user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});

//Passport using Twitter strategy
passport.use(new passportTwitterStrategy({
	consumerKey:config.twitter.consumerKey,
	consumerSecret:config.twitter.consumerSecret,
	callbackURL: config.twitter.callbackURL
	},
	function(token, tokenSecret, profile, done){
		process.nextTick(function()
		{
			return done(null, profile);
		});
	}

));

var expressServer = express.createServer();
expressServer.listen(process.env.PORT || 8000);
loggingHelper.log("Listening on: " + expressServer.address().port);

expressServer.set("views", __dirname + "/views");
expressServer.set("view engine", "jade");
expressServer.set("view options", {layout:false});

expressServer.use(express.logger());
expressServer.use(express.cookieParser());
expressServer.use(express.bodyParser());
expressServer.use(express.methodOverride());
expressServer.use(express.favicon());

expressServer.use(express.session({secret: 'the chirp'}))
expressServer.use(passport.initialize());
expressServer.use(passport.session());
expressServer.use(expressServer.router);
expressServer.use(express.static(__dirname + "/assets"));

//TODO: need to modularize routes
expressServer.get("/", ensureAuthenticated, tweetHandler.index);

expressServer.post("/send", ensureAuthenticated, function(request, response){
	tweetHandler.newTweet(request, response);	
});
expressServer.get("/tweets", ensureAuthenticated, tweetHandler.getTweets);

//Handle route to /auth/twitter 
expressServer.get("/auth/twitter", 
passport.authenticate("twitter"), function(request, response){
	//is not called since this route is handled by twitter's login page
});

expressServer.get("/auth/twitter/callback", 
passport.authenticate("twitter", {failureRedirect: "/login"}), function(request, response){
	response.redirect("/");
});	

expressServer.get("/logout", function(request, response){
	request.logout();
	response.redirect("/");
});

expressServer.get("/login", tweetHandler.login)

//TODO: move error handling out of here
//A Route for Creating a 500 Error (Useful to keep around)
expressServer.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//TODO: move into authentication helper
function ensureAuthenticated(request, response, next){
	if(request.isAuthenticated()) {return next();}
	response.redirect("/login");
}




//The 404 Route (ALWAYS Keep this as the last route)
/*expressServer.get('/*', function(req, res){
    throw new NotFound;
});
*/

//TODO: move into error helper
function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}
