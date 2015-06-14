var coordinate;
document.getElementsByClassName('play')[0].onclick = function startGame() {
	var username = document.getElementsByClassName('username')[0].value;
	// Server Stuff, not necessary now.
	// var ip = document.getElementsByClassName('ip')[0].value;
	// console.log(ip);
	// console.log(username);
	coordinate = [0,0]
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
	createPlayer(username);

	/*
	connectServer(ip);
	*/
} 
function tableCreate() {
	var body = document.body
    var tbl  = document.createElement('table');
    tbl.style.border = "1px solid black";

    for(var i = 0; i < 5; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 10; j++) {
            var td = tr.insertCell();
        }
    }
    body.appendChild(tbl);
}
function createPlayer(username) {
	document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = "red"
	var username1 = document.createTextNode(username);
	document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1]].appendChild(username1)
}
document.onkeydown = checkKey;
function checkKey(e) { //Also moves player

    e = e || window.event;

    switch(e.keyCode) {
    	case 38:
    		console.log("up");
    		document.getElementsByTagName('table')[0].rows[coordinate[0] - 1].cells[coordinate[1]].style.backgroundColor = "red"
    		document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = null;
    		coordinate = [coordinate[0] - 1, coordinate[1]];
    		break;
    	case 40:
    		console.log("down");
    		document.getElementsByTagName('table')[0].rows[coordinate[0] + 1].cells[coordinate[1]].style.backgroundColor = "red"
    		document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = null;
    		coordinate = [coordinate[0] + 1, coordinate[1]]
    		break;
    	case 37:
    		console.log("left");
    		document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1] - 1].style.backgroundColor = "red"
    		document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = null;
    		coordinate = [coordinate[0], coordinate[1] - 1]
    		break;
    	case 39:
    		console.log("right");
    		document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1] + 1].style.backgroundColor = "red"
    		document.getElementsByTagName('table')[0].rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = null;
    		coordinate = [coordinate[0], coordinate[1] + 1]
    		break;
    	default:
    		break;
    }
}
