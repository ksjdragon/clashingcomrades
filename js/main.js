var coordinate;
var username;
document.getElementsByClassName('play')[0].onclick = function startGame() {
	username = document.createTextNode(document.getElementsByClassName('username')[0].value)
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
    table = document.getElementsByTagName('table')[0];
}
function createPlayer() {
	table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = "red"
	table.rows[coordinate[0]].cells[coordinate[1]].className = "player"
	table.rows[coordinate[0]].cells[coordinate[1]].appendChild(username)
}

//add argument "team" to differentiate what color to set
function movement(x,y) {
	table.rows[coordinate[0]].cells[coordinate[1]].className = "";
	table.rows[coordinate[0] + y].cells[coordinate[1] + x].className = "player";
	document.getElementsByClassName('player')[0].style.backgroundColor = "red";
	document.getElementsByClassName('player')[0].appendChild(username);
	table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = "#FF3B3B";
	coordinate = [coordinate[0] + y, coordinate[1] + x];
}
document.onkeydown = movePlayer;
/* Put this stuff server side to prevent hax later */
function movePlayer(e) { //Also moves player

    e = e || window.event;

    switch(e.keyCode) {
    	case 38:
    		console.log("up");
    		movement(0,-1);
    		break;
    	case 40:
    		console.log("down");
    		movement(0,1);
    		break;
    	case 37:
    		console.log("left");
    		movement(-1,0);
    		break;
    	case 39:
    		console.log("right");
    		movement(1,0);
    		break;
    	default:
    		break;
    }
}
