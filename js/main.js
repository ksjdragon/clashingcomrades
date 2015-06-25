var coordinate;
var username;
var timer;
document.getElementsByClassName('play')[0].onclick = function startGame() {
	username = document.createTextNode(document.getElementsByClassName('username')[0].value)
	coordinate = [0,0]
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
	createPlayer(username);

	/*
	connectServer(ip);
	*/
} 

//Creation of Table
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
//Creation of Player
function createPlayer() {
	table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = "red"
	table.rows[coordinate[0]].cells[coordinate[1]].className = "player"
	table.rows[coordinate[0]].cells[coordinate[1]].appendChild(username)
}

//add argument "team" to differentiate what color to set
function movement(x,y) {
    timer = 
        setTimeout(function() {
        	table.rows[coordinate[0]].cells[coordinate[1]].className = "";
        	table.rows[coordinate[0] + y].cells[coordinate[1] + x].className = "player";
        	document.getElementsByClassName('player')[0].style.backgroundColor = "red";
            document.getElementsByClassName('player')[0].appendChild(username);
        	table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = "#FC9D9D";
        	coordinate = [coordinate[0] + y, coordinate[1] + x];
            movement(x,y);
        }, 175);

}
document.onkeydown = movePlayer;
/* Put this stuff server side to prevent H4X (Arav) later */
function movePlayer(e) { 

    e = e || window.event;

    switch(e.keyCode) {
    	//up
    	case 38:
            clearTimeout(timer);
    		movement(0,-1);
    		break;
    	//down
    	case 40:
            clearTimeout(timer);
    		movement(0,1);
    		break;
    	//left
    	case 37:
            clearTimeout(timer);
    		movement(-1,0);
    		break;
    	//right
    	case 39:
            clearTimeout(timer);
    		movement(1,0);
    		break;
    	default:
    		break;
    }
}
