var twitterTimeline = [];

function AttachPublicTimelineHandler(){
	$("#tabs-2").on("click", "#btnGetTimeLine", function(){
			//alert("test");
			$.ajax({
				url:"tweets" ,
				type: "get",
				dataType: "json"
			}).done(function(data){
					//populate ko.observable array
					//alert(data);
					twitterTimeline = data;
			})
			.fail(function(jqXHR, textStatus){
				alert(textStatus);
			});
	});
}

AttachPublicTimelineHandler();

$(function(){
	$("#tabs").tabs();
});
