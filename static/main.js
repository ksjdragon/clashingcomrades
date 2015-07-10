// Global Variables 
var playerCoordinate;
var username;
var playerTeam;
var timer;
var type;
var username;
var playerColor;
var claimColor;
var turn = 0;
// Colors
var playerColors = {
    "red": "#E62E2E",
    "blue": "#4343D8"
};
var claimedColors = {
    "red": "#FF9999",
    "blue": "#9999FF"
}

document.getElementsByClassName('play')[0].onclick = function startGame() {

    uuid4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, _uuid4);
    };
    //// OPTIMIZATION - cache callback
    _uuid4 = function(cc) {
        var rr = Math.random() * 16 | 0; return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
    };
    username = uuid4()
    //*********************
    // TODO Get from server
    //********************* 
    playerCoordinate = [0,0];
    playerTeam = "blue";

    // TODO IP Handling, most likely not necessary

    var login = document.getElementById("login");
    login.parentNode.removeChild(login);
    // Create scoreboard before table to prevent css glitching
    createScoreboard();
    createTable();
    // Update score before creating player so scoreboard starts at 0
    updateScore();
    createPlayer();
   
    document.onkeydown = movePlayer;
}

function serverTransfer(coordinate,team,turn,username) {
    var move = {
        coordinate: coordinate,
        team: team,
        turn: turn,
        username: username
    };
    // For debugging
    console.log(move);
    // Sending Data
    $.ajax('http://127.0.0.1:5000/game', {
        method: 'POST',
        type : "POST",
        data: JSON.stringify(move, null, '\t'),
        dataType: "json",
        contentType: 'application/json;charset=UTF-8'
    })
    // Server Response
    .then(
        function success(data) {
            for (var user in data) {
                if (data.hasOwnProperty(user) && (user != username) && (data[user][team] != "spectator") && (data[user].length > turn)) {
                    console.log(data[user]);
                    var theMove = data[user][turn];
                    updateTable(theMove[1], theMove[2]);
                    var oldMove = data[user][turn - 1];
                    updateOldTable(oldMove[1], oldMove[2]);
                }
            }
        },

        function fail(data, status) {
            alert('Request failed.  Returned status of ' + status);
        }
    );
}

// CREATION

// Creation of Table 

function createTable() {
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

// Creation of Scoreboard

function createScoreboard() {
    var scoreboard = document.getElementsByTagName('body')[0].appendChild(document.createElement("DIV"));
    scoreboard.className = 'scoreboard';
    var redScore = scoreboard.appendChild(document.createElement("SPAN"));
    redScore.id = "redscore";
    var redNumber = scoreboard.appendChild(document.createElement("SPAN"));
    redNumber.id = "rednumber";
    redScore.appendChild(document.createTextNode("___"));
    redNumber.appendChild(document.createTextNode(""));
    scoreboard.appendChild(document.createElement("BR"));
    var blueScore = scoreboard.appendChild(document.createElement("SPAN"));
    blueScore.id = "bluescore";
    var blueNumber = scoreboard.appendChild(document.createElement("SPAN"));
    blueNumber.id = "bluenumber";
    blueScore.appendChild(document.createTextNode("___"));
    blueNumber.appendChild(document.createTextNode(""));
}

// Creation of Player 

function createPlayer() {
    startSquare = table.rows[playerCoordinate[0]].cells[playerCoordinate[1]];
    startSquare.style.backgroundColor = playerColors[playerTeam];
    startSquare.className = "player " + playerTeam;
    startSquare.id = username;
}

// UPDATING

function updateTable(coordinate, team) {
    otherPlayer = table.rows[coordinate[0]].cells[coordinate[1]];
    otherPlayer.style.backgroundColor = playerColors[team];
    otherPlayer.className = "player " + team;  
}

function updateOldTable(coordinate, team) {
    otherPlayer = table.rows[coordinate[0]].cells[coordinate[1]];
    otherPlayer.style.backgroundColor = claimedColors[team];
    otherPlayer.className = otherPlayer.className.replace("player ", "");
}

function updateScore() {
    var score = [
        document.getElementsByClassName('red').length,
        document.getElementsByClassName('blue').length
    ];
    document.getElementById('rednumber').childNodes[0].nodeValue = " : " + score[0];
    document.getElementById('bluenumber').childNodes[0].nodeValue = " : " + score[1];
}

 // PLAYER HANDLING 

function movement(x,y) {
    if (playerTeam != "spectator") {
        previousSquare = table.rows[playerCoordinate[0]].cells[playerCoordinate[1]];
        nextSquare = table.rows[playerCoordinate[0] + y].cells[playerCoordinate[1] + x];
    }

    timer =
        setTimeout(function() {
            try {
                if (nextSquare == undefined
                    || nextSquare.className.includes('player') 
                    || playerTeam === "spectator"
                    || nextSquare.className.includes(playerTeam)) {
                    killPlayer(playerCoordinate, playerTeam);
                }
                else {
                    // Changing new square
                    nextSquare.style.backgroundColor = playerColors[playerTeam];
                    nextSquare.className = "player " + playerTeam;
                    nextSquare.id = username;
                    // Resetting old square
                    previousSquare.style.backgroundColor = claimedColors[playerTeam];
                    previousSquare.className = previousSquare.className.replace("player ", "");
                    previousSquare.id = "";
                    // Recursive actions
                    playerCoordinate = [playerCoordinate[0] + y, playerCoordinate[1] + x];
                    updateScore();
                    serverTransfer(playerCoordinate,playerTeam,turn,username);
                    autoScroll();
                }
                turn = turn + 1;
                movement(x,y);
            }
            catch(err) {
                // On hit wall
                killPlayer(playerCoordinate, playerTeam);
            }
        }, 100);
}

function movePlayer(e) {

    e = e || window.event;

    if (e.keyCode === 38 && type != "up") {
        type = "up";
        clearTimeout(timer);
        movement(0,-1);
    } else if (e.keyCode === 40 && type != "down") {
        type = "down";
        clearTimeout(timer);
        movement(0,1);
    } else if (e.keyCode === 37 && type != "left") {
        type = "left"
        clearTimeout(timer);
        movement(-1,0);
    } else if (e.keyCode === 39 && type != "right") {
        type = "right"
        clearTimeout(timer);
        movement(1,0);
    }
}
function killPlayer(coordinate, team) {
    if (playerTeam != "spectator") {
        deathSquare = table.rows[coordinate[0]].cells[coordinate[1]];
        deathSquare.style.backgroundColor = claimedColors[team]; 
        deathSquare.className = deathSquare.className.replace("player ", "");
        deathSquare.id = "";
    }
    // Spectator mode first to set team to spectator
    spectatorMode();
    serverTransfer(coordinate,team,turn,username);   
}
function spectatorMode() {
    //***************************
    // TODO Finish Spectator Mode
    //***************************
    playerCoordinate = null;
    playerTeam = 'spectator';

}

function autoScroll() {
    center = [
    window.innerHeight / -2,
    window.innerWidth / -2
    ];
    $('body').scrollTo(document.getElementById(username), 100, {offset: {top: center[0] , left: center[1]} });
}    