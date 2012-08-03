function TimelinePost(id, userName, userDescription, userProfileImageUrl, createdOn){
	var self = this;
	self.id = id;
	self.userName = userName;
	self.userDescription = userDescription;
	self.userProfileImageUrl = userProfileImageUrl;
	self.createdOn = createdOn;
	
}

function TimelinePostViewModel(){
	var self = this;
	
	self.timeline = ko.observableArray(twitterTimeline);
}

ko.applyBindings(new TimelinePostViewModel());
