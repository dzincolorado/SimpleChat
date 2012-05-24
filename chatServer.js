var net = require("net")
var chatServer = net.createServer();
var clientList = [];

chatServer.on("connection", function(client){
	client.name = client.remoteAddress + ":" + client.remotePort;
	client.write("Hi " + client.name + "\n");
	clientList.push(client);
	
	client.on("data", function(data){
		broadcast(data, client);
	});
	
	client.on('end', function(){
		console.log("Disconnecting: " + client.name);
		clientList.splice(clientList.indexOf(client), 1);
	});
	
	client.on('error', function(e){
		console.log(e);
	})
	
	//client.end();
});

function broadcast(message, client)
{
	var cleanup = [];
	for(x=0;x<clientList.length;x++)
	{
		if(clientList[x] != client)
		{
			if(clientList[x].writable)
			{
				clientList[x].write(client.name + " says " + message);
			}
			else
			{
				cleanup.push(clientList[x]);
				clientList[x].destroy();
			}
		}
	}
	
	for(x=0;x<cleanup.length;x++)
	{
		clientList.splice(clientList.indexOf(cleanup[x]), 1);
	}
}

chatServer.listen(9000);

console.log("chatServer is listening on port: " + chatServer.address().port);
