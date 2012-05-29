function validate(tweet){
	if(tweet.trim() == ""){
		return false;	
	}
	
	return true;
}

exports.validate = validate;