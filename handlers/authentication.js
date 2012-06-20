module.exports = function(passport, passportTwitterStrategy, config){
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
}
