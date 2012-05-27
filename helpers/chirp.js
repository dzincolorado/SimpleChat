function chirp(tweet){
	this.value = tweet;
	this.createDate = new Date();
}

exports.chirp = chirp