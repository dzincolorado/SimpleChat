function chirp(tweet){
	this.value = tweet;
	this.createDate = new Date();
	//this.createDate = this.createDate.toLocaleDateString() + this.createDate.toLocateTimeString();
}

exports.chirp = chirp