var http = require("http");
var assert = require("assert");

var opts = {
	host: "localhost",
	port: "8000",
	method: "POST",
	path: "/send",
	headers: {"content-type": "application/x-www-form-urlencoded"}
};

var req = http.request(opts, function(response){
	response.setEncoding("utf8");
	
	var data = "";
	
	response.on("data", function(d){
		data += d;
	})
	
	response.on("end", function(){
		assert.strictEqual(data, '{"status":"ok","message":"Tweet Received!"}');
	})
})

req.write("tweet=test");
req.end();
