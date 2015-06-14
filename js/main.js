document.getElementsByClassName('play')[0].onclick = function startGame() {
	var username = document.getElementsByClassName('username')[0].value;
	// Server Stuff, not necessary now.
	// var ip = document.getElementsByClassName('ip')[0].value;
	// console.log(ip);
	// console.log(username);
	// if (ip.match(/[a-z]/i) /* && list of ips */ || ip === "") {
	// 	alert("That wasn't a valid ip, so we picked a random one for you!");
	// 	/*
	// 	ip = retrieveServerIPs('array')[Math.floor((Math.random() * retrieveServerIPs('amount')) + 1)];
	// 	*/
	// }
	document.getElementsByClassName('username')[0].value = null;
	document.getElementsByClassName('ip')[0].value = null;

	var element = document.getElementById("login");
	element.parentNode.removeChild(element);
	tableCreate();

	/*
	connectServer(ip);
	*/
}

function tableCreate(){
    var body = document.body,
        tbl  = document.createElement('table');
    tbl.style.border = "1px solid black";

    for(var i = 0; i < 20; i++){
        var tr = tbl.insertRow();
        for(var j = 0; j < 30; j++){
                var td = tr.insertCell();
                td.appendChild();

        }
    }
    body.appendChild(tbl);
}
