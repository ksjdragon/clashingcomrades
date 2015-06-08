document.getElementsByClassName('play')[0].onclick = function startGame() {
	var username = document.getElementsByClassName('username')[0].value;
	var ip = document.getElementsByClassName('ip')[0].value;
	console.log(ip);
	console.log(username);
	if (ip.match(/[a-z]/i) /* && list of ips */ || ip === "") {
		alert("That wasn't a valid ip, so we picked a random one for you!");
		/*
		ip = retrieveServerIPs('array')[Math.floor((Math.random() * retrieveServerIPs('amount')) + 1)];
		*/
	}
	document.getElementsByClassName('username')[0].value = null;
	document.getElementsByClassName('ip')[0].value = null;
	/*
	connectServer(ip);
	*/
}

