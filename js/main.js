var coordinate;
var username;
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
	table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = "#FC9D9D";
	coordinate = [coordinate[0] + y, coordinate[1] + x];
}

document.onkeydown = movePlayer;
/* Put this stuff server side to prevent hax later */
function movePlayer(e) { //Also moves player

    e = e || window.event;
    var olde = e.keyCode;
    switch(e.keyCode) {
    	//up
    	case 38: 
    		timer1();
    		function timer1() {
    			setTimeout(function() {
    			movement(0,-1);
    			console.log(e.keyCode);
    			console.log(olde);
    			if(e.keyCode === olde) {
    				timer1();
    			}	
    		}, 250);
    	}
    		break;
    	//down
    	case 40:
    	timer2();
    		function timer2() {
    			setTimeout(function() {
    			movement(0,1);
    			console.log(e.keyCode);
    			console.log(olde);
    			if(e.keyCode === olde) {
    				timer2();
    			}	
    		}, 250);
    	}
    		break;
    	//left
    	case 37:
    		timer3();
    		function timer3() {
    			setTimeout(function() {
    			movement(-1,0);
    			console.log(e.keyCode);
    			console.log(olde);
    			if(e.keyCode === olde) {
    				timer3();
    			}	
    		}, 250);
    	}
    		break;
    	//right
    	case 39:
    		timer4();
    		function timer4() {
    			setTimeout(function() {
    			movement(1,0);
    			console.log(e.keyCode);
    			console.log(olde);
    			if(e.keyCode === olde) {
    				timer4();
    			}	
    		}, 250);
    	}
    		break;
    	default:
    		break;
    }
}
