var util = require("util");

function log(item){
	//console.log(typeof item);
	if(item != null){
		console.log(util.inspect(item));	
	}
}

exports.log = log;