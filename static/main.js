//Global Variables 
var coordinate;
var username;
var team;
var timer;
var type;
var username;
var playerColor;
var claimColor;
var turn = 0;
//Colors
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
    coordinate = [0,0];
    team = "blue";

    // TODO IP Handling, most likely not necessary

    var login = document.getElementById("login");
    login.parentNode.removeChild(login);

    var scoreboard = document.getElementsByTagName('body')[0].appendChild(document.createElement("DIV"));
    scoreboard.className = 'scoreboard';
    scoreboard.appendChild(document.createTextNode(""));
    scoreboard.appendChild(document.createElement("BR"));
    scoreboard.appendChild(document.createTextNode(""));
    updateScore();
    tableCreate();
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
    $.ajax('http://127.0.0.1:5000/game', {
        method: 'POST',
        type : "POST",
        data: JSON.stringify(move, null, '\t'),
        dataType: "json",
        contentType: 'application/json;charset=UTF-8'
    })
    .then(
        function success(data) {
            for (var user in data) {
                if (data.hasOwnProperty(user) && (user != username)) {
                    console.log(data[user][turn]);
                    var theMove = data[user][turn];
                    tableUpdate(theMove[1], theMove[2]);
                    var oldMove = data[user][turn - 1];
                    oldTableUpdate(oldMove[1], oldMove[2]);
                }
            }
        },

        function fail(data, status) {
            alert('Request failed.  Returned status of ' + status);
        }
    );
}

 // Creation of Table 

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

function tableUpdate (coordinate, team) {
    table.rows[coordinate[0]].cells[coordinate[1]].className = "player ";
    table.rows[coordinate[0]].cells[coordinate[1]].className += team;
    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = playerColors[team];
}

function oldTableUpdate(coordinate, team) {
    table.rows[coordinate[0]].cells[coordinate[1]].className = table.rows[coordinate[0]].cells[coordinate[1]].className.replace("player ", "");
    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimedColors[team];
}

 // Creation of Player 

function createPlayer() {
    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = playerColors[team];
    table.rows[coordinate[0]].cells[coordinate[1]].className = "player ";
}

function movement(x,y) {
    timer =
        setTimeout(function() {
            try {
                if (table.rows[coordinate[0] + y].cells[coordinate[1] + x].className.includes(team)) {
                    // Kills Player
                    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimedColors[team];
                    document.getElementsByClassName('player')[0].className = "";
                    spectatorMode();
                }
                else {
                    table.rows[coordinate[0]].cells[coordinate[1]].className = table.rows[coordinate[0]].cells[coordinate[1]].className.replace("player ", "");
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].className = "player ";
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].className += team;
                    table.rows[coordinate[0] + y].cells[coordinate[1] + x].style.backgroundColor = playerColors[team];
                    table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimedColors[team];
                    coordinate = [coordinate[0] + y, coordinate[1] + x];
                    updateScore();
                    serverTransfer(coordinate,team,turn,username);
                    turn = turn + 1;
                    movement(x,y);
                }
            }
            catch(err) {
                //Kills Player
                table.rows[coordinate[0]].cells[coordinate[1]].style.backgroundColor = claimColor;
                document.getElementsByClassName('player')[0].className = "";
                spectatorMode();
            }
        }, 100);
}

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
    //***************************
    // TODO Finish Spectator Mode
    //***************************
    coordinate = null;
}

function updateScore() {
    var score = [
        document.getElementsByClassName('red').length,
        document.getElementsByClassName('blue').length
    ];
    document.getElementsByClassName('scoreboard')[0].childNodes[0].nodeValue = "Red: " + score[0];
    document.getElementsByClassName('scoreboard')[0].childNodes[2].nodeValue = "Blue: " + score[1];
}