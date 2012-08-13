function TimelinePost(id, userName, userDescription, userProfileImageUrl, createdOn){
	var self = this;
	self.id = ko.observable(id);
	self.userName = ko.observable(userName);
	self.userDescription = ko.observable(userDescription);
	self.userProfileImageUrl = ko.observable(userProfileImageUrl);
	self.createdOn = ko.observable(createdOn);
	
}

function TimelinePostViewModel(){
	var self = this;
	self.timelinePosts = ko.observableArray([]);
}

function getPublicTimeline(requestType){
	$.ajax({
		url:"tweets/" + requestType ,
		type: "get",
		dataType: "json"
	}).done(function(data){
			//populate ko.observable array
			var mappedData = ko.utils.arrayMap(data, function(item){
				return new TimelinePost(
				 	item["_id"],
					item["user"]["name"],
					item["user"]["description"],
					item["user"]["profile_background_image_url"],
					item["created_at"]);
			});
			
			model.timelinePosts(mappedData);
	})
	.fail(function(jqXHR, textStatus){
		alert(textStatus);
	});
}


var model = new TimelinePostViewModel();
//document ready event handler
$(document).ready(function(){
	
	//attach click handler
	$("#tabs-2").on("click", "#btnGetTimeLine", function(){
			getPublicTimeline("new");
	});
	
	//configure selectable()
	$(function() {
		$( "#wrpTimelines" ).selectable();
	});

	//configure jquery tabs
	$(function(){
		$("#tabs").tabs();
	});
	
	//configure tabsselect event handler
	$("#tabs").bind("tabsselect", function(event, ui){
		//show timeline when tab is shown
		if(ui.panel.id == "tabs-2"){
			getPublicTimeline("");	
		}
	});
	
	//hookup model to ko
	ko.applyBindings(model);
});

