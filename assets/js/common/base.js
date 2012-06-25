function AttachFindByHashHandler(){
	//$('#parent').on("click", "#child", function() {});
	$(".controls").on("click", "#btnFindByHash", function(){
			$.ajax({
				url:"tweets" ,
				type: "get",
				dataType: "json"
			}).done(function(data){
					alert(data);
			});
	});
}

AttachFindByHashHandler();
