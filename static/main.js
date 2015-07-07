//Global Variables 
var coordinate;
var username;
var team;
var timer;
var type;
var playerColor;
var claimColor;
var turn = 1;
//Colors 
var redPlayer = "#E62E2E";
var redClaimed = "#FF9999";
var bluePlayer = "#4343D8";
var blueClaimed = "#9999FF";


document.getElementsByClassName('play')[0].onclick = function startGame() {
    /* get this from server later */
    coordinate = [0,0];
    team = "red";
    /* end */
    if(team === "red") {
        playerColor = redPlayer;
        claimColor = redClaimed;
    } else {
        playerColor = bluePlayer;
        claimColor = blueClaimed;
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

    var element = document.getElementById("login");
    element.parentNode.removeChild(element);

    var scoreboard = document.getElementsByTagName('body')[0].appendChild(document.createElement("DIV"));
    scoreboard.className = 'scoreboard';
    scoreboard.appendChild(document.createTextNode(""));
    scoreboard.appendChild(document.createElement("BR"));
    scoreboard.appendChild(document.createTextNode(""));
    updateScore();
    tableCreate();
    createPlayer();
    /*
    connectServer(ip);
    */
}

function getPlayers() {
    /******* Add recursive calling for: update other players, scoreboard updating *************/
}

function serverTransfer(coordinate,team,turn) {
    var move = {
        coordinate: coordinate,
        team: team,
        turn: turn
    };
    console.log(move);
    $.ajax('http://127.0.0.1:5000/game', {
        method: 'POST',
        type : "POST",
        data: JSON.stringify(move, null, '\t'),
        dataType: "json",
        contentType: 'application/json;charset=UTF-8'
    })
    .then(
        function success(data) {
            //Kenny Do it
            console.log(data);
        },

        function fail(data, status) {
            alert('Request failed.  Returned status of ' + status);
        }
    );
}



/*********************/
/* Creation of Table */
/*********************/

function tableCreate() {
    var body = document.body
    var tbl  = document.createElement('table');
    tbl.style.border = "1px solid black";

    for(var i = 0; i < 20; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 30; j++) {
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
    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = playerColor;
    table.rows[coordinate[0]].cells[coordinate[1]].className = "player ";
}


/* Put this stuff server side to prevent H4X (Arav) later */
function movement(x,y) {
    timer =
        setTimeout(function() {
            try {
                if (table.rows[coordinate[0] + y].cells[coordinate[1] + x].className.includes(team)) {
                    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimColor;
                    document.getElementsByClassName('player')[0].className = "";
                    spectatorMode();
                }
                else {
                    table.rows[coordinate[0]].cells[coordinate[1]].className = table.rows[coordinate[0]].cells[coordinate[1]].className.replace("player ", "");
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].className = "player ";
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].className += team;
                    document.getElementsByClassName('player')[0].style.backgroundColor = playerColor;
                    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimColor;
                    coordinate = [coordinate[0] + y, coordinate[1] + x];
                    updateScore(); // remove this after server updating
                    serverTransfer(coordinate,team,turn);
                    turn = turn + 1;
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
function updateScore() {
    var score = 
    [
    document.getElementsByClassName('red').length,
    document.getElementsByClassName('blue').length
    ];
    document.getElementsByClassName('scoreboard')[0].childNodes[0].nodeValue = "Red: " + score[0];
    document.getElementsByClassName('scoreboard')[0].childNodes[2].nodeValue = "Blue: " + score[1];
}