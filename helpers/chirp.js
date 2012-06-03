function chirp(tweet, cDate){
	this.content = tweet;
	if(!cDate){
		this.createDate = new Date();	
	}
	else {
		this.createDate = new Date(cDate);
	}
	
	//this.createDate = this.createDate.toLocaleDateString() + this.createDate.toLocateTimeString();
}

exports.chirp = chirp