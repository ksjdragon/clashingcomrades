/*Global Variables */
var coordinate;
var username;
var team;
var mode;
var timer;
var type;
var playerCol;
var claimCol;
/* End */
/* Colors */
var redPlayer = "#E62E2E"
var redClaimed = "#FF9999"
var bluePlayer = "#4343D8"
var blueClaimed = "#9999FF"
/* End */

document.getElementsByClassName('play')[0].onclick = function startGame() {
    username = document.createTextNode(document.getElementsByClassName('username')[0].value)
    /* get this from server later */
    coordinate = [0,0]
    team = "red"
    /* end */
    if(team === "red") {
        playerCol = redPlayer;
        claimCol = redClaimed;
    } else {
        playerCol = bluePlayer;
        claimCol = blueClaimed;
    }

    // Server Stuff, not necessary now.
    // var ip = document.getElementsByClassName('ip')[0].value;
    // console.log(ip);
    // console.log(username);
    // if (ip.match(/[a-z]/i) /* && list of ips */ || ip === "") {
    //  alert("That wasn't a valid ip, so we picked a random one for you!");
    //  /*
    //  ip = retrieveServerIPs('array')[Math.floor((Math.random() * retrieveServerIPs('amount')) + 1)];
    //  */
    // }
    document.getElementsByClassName('username')[0].value = null;
    document.getElementsByClassName('ip')[0].value = null;

    var element = document.getElementById("login");
    element.parentNode.removeChild(element);
    mode = "ingame"
    tableCreate();
    createPlayer(username);

    /*
    connectServer(ip);
    */
}

/*********************/
/* Creation of Table */
/*********************/

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

/**********************/
/* Creation of Player */
/**********************/

function createPlayer() {
    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = playerCol;
    table.rows[coordinate[0]].cells[coordinate[1]].className = "player";
    table.rows[coordinate[0]].cells[coordinate[1]].appendChild(username);
}
/* Put this stuff server side to prevent H4X (Arav) later */
function movement(x,y) {
    timer =
        setTimeout(function() {
            try {
                if (table.rows[coordinate[0] + y].cells[coordinate[1] + x].id === team) {
                    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimCol;
                    document.getElementsByClassName('player')[0].className = "";
                    //mode = "spectator"
                    spectatorMode();
                }
                else if(mode !== "spectator") {
                    table.rows[coordinate[0]].cells[coordinate[1]].className = "";
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].className = "player";
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].id = team;
                    document.getElementsByClassName('player')[0].style.backgroundColor = playerCol;
                    document.getElementsByClassName('player')[0].appendChild(username);
                    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimCol;
                    coordinate = [coordinate[0] + y, coordinate[1] + x];
                    movement(x,y);
                }
            }
            catch(err) {
            }
        }, 100);
}
document.onkeydown = movePlayer;

function movePlayer(e) {

    e = e || window.event;

    if(e.keyCode === 38 && type != "up") {
        type = "up";
        clearTimeout(timer);
        movement(0,-1);
    } else if(e.keyCode === 40 && type != "down") {
        type = "down";
        clearTimeout(timer);
        movement(0,1);
    }
    else if(e.keyCode === 37 && type != "left") {
        type = "left"
        clearTimeout(timer);
        movement(-1,0);
    }
    else if(e.keyCode === 39 && type != "right") {
        type = "right"
        clearTimeout(timer);
        movement(1,0);
    }
}

function spectatorMode() {
    coordinate = null;
    /* once in server side add stuff about following players */
}