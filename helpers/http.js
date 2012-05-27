function acceptsHtml(header){
	var accepts = header.split(',');
	for(i=0;i<accepts.length;i++){
		if(accepts[i] === 'text/html') {return true;}
	}
}

exports.acceptsHtml = acceptsHtml;