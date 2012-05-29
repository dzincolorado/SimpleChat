function logToConsole(docs){
	if(docs != null && docs.length > 0){
		console.log(docs[0]);	
	}
}

exports.logToConsole = logToConsole;