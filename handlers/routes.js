module.exports = function(expressServer, passport, tweetHandler){
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
	
	//TODO: move error handling out of here
	//A Route for Creating a 500 Error (Useful to keep around)
	expressServer.get('/500', function(req, res){
	    throw new Error('This is a 500 Error');
	});
}

//TODO: move into authentication helper
	function ensureAuthenticated(request, response, next){
		if(request.isAuthenticated()) {return next();}
		response.redirect("/login");
	}