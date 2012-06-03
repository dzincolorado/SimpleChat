var util = require("util");

function logToConsole(docs){
	console.log(typeof docs);
	if(docs != null){
		console.log(util.inspect(docs));	
	}
}

exports.logToConsole = logToConsole;