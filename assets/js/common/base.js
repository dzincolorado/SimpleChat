var twitterTimeline = [];

function AttachPublicTimelineHandler(){
	$(".controls").on("click", "#btnFindByHash", function(){
			$.ajax({
				url:"tweets" ,
				type: "get",
				dataType: "json"
			}).done(function(data){
					//populate ko.observable array
					twitterTimeline = data;
			});
	});
}

AttachPublicTimelineHandler();

$(function(){
	$("#tabs").tabs();
});
