// Global Variables 
var playerInfo = {};
var maxPlayers;
var numberOfPlayers = 1;

// Client Player Info
var myTeam; 
var myCoord;
var myUsername;

// Animation Handling
var move; // Prevents move spam.
var moveTimer;
var setup = true;

/*var spectatorChoose = 1;
var spectatedUser;*/

// Timeout Handling
var canSend = true;
var turnTime = 3;
var hasSent = false;

var serverURL = "http://activate.adobe.com:5000"

// Colors
var playerColors = {
    "red": "#E62E2E",
    "blue": "#4343D8"
};
var claimedColors = {
    "red": "#FF9999",
    "blue": "#9999FF"
};

document.getElementsByClassName('play')[0].onclick = function initialize() {

    var login = document.getElementById("login");
    login.parentNode.removeChild(login);

    getInitial(); // Gets team, coordinate, and max lobby players.
    
    // TODO IP Handling, most likely not necessary

    // Create scoreboard before table to prevent CSS glitching.
    createScoreboard();
    createInfo();
    createTable();
    // Update score before creating player so scoreboard starts at 0
    updateScore();
    waitForPlayers();
};

function getInitial() {

    uuid4 = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, _uuid4);
    };
    //// OPTIMIZATION - cache callback
    _uuid4 = function(cc) {
        var rr = Math.random() * 16 | 0; 
        return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
    };

    myUsername = uuid4();
    var userId = {
        username: [myUsername]
    };

    $.ajax({
        url: serverURL + '/game',
        type: 'POST',
        type : 'POST',
        data: JSON.stringify(userId, null, '\t'),
        dataType: "json",
        contentType: 'application/json;charset=UTF-8'
    })
    .then(
        function success(data) {
            myTeam = data.team;
            myCoord = data.coordinate;
            maxPlayers = data.max;

        },
        function error(e) {
            console.log(e);
            alert("Error, intial");
        }
    );
}

function waitForPlayers() {
    timer1 = setTimeout(function() {
        var sending = {
                username: [myUsername]
        };

        $.ajax(serverURL + '/pregame', {
            method: 'POST',
            type : 'POST',
            data: JSON.stringify(sending, null, '\t'),
            dataType: "json",
            contentType: 'application/json;charset=UTF-8'
        })
        .then(
            function success(data) {
                numberOfPlayers = data.playersInGame;
                updateInfo();
                if (numberOfPlayers == maxPlayers) {
                    countdown();
                } else {
                    waitForPlayers();
                }
            },
            function error(e) {
                console.log(e);
                alert("Error, waiting");
            }
        );                
    }, 3000);
}

function countdown() {
    timer2 = setTimeout(function() {
        $.ajax({
            url: serverURL + '/pregame',
            type: 'GET',
            success: function(data) {
                timeLeft = parseInt(data.timeLeft, 10);
                updateTimer(timeLeft);
                delete data['timeLeft'];
                playerInfo = data;
                animate();
                
                if (timeLeft === 0) {
                    startGame();
                } else {
                    countdown();
                }
            },
            error: function(e) {
                console.log(e);
                alert("Error, countdown");
            } 
        });
    }, 250); //Prevent too many requests
}

function startGame() {
    document.onkeydown = movePlayer;
    document.getElementsByClassName('info')[0].childNodes[0].nodeValue = "Next Turn: 3"
    timeMove();
    autoScroll('start');
    setup = false;
}

function sendMove(x,y) {
    if (canSend) {
        canSend = false;
        hasSent = true;
        var move = {
            coordinate: [x,y],
            team: myTeam,
            username: myUsername,
        };

        $.ajax(serverURL + '/game', {
            method: 'POST',
            type : 'POST',
            data: JSON.stringify(move, null, '\t'),
            dataType: "json",
            contentType: 'application/json;charset=UTF-8'
        })
        .then(
            function success(data) {
                playerInfo = data;
                animate();
                timeMove();
                updateScore();
                canSend = true;
                hasSent = false;
            },
            function error(e) {
                console.log(e);
                alert("Error, move");
            }
        );
    }
}

// CREATION

// Creation of Table 

function createTable() {
    var body = document.body;
    var tbl    = document.createElement('table');
    tbl.style.border = "1px solid black";
    for(var i = 0; i < 20; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 20; j++) {
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

// Creation of Information box

function createInfo() {
    var table = document.getElementsByTagName('body')[0].appendChild(document.createElement("DIV"));
    table.className = 'info';
    table.appendChild(document.createTextNode("Players in lobby: " + numberOfPlayers));
}

// UPDATING

function updateScore() {
    var score = [
        document.getElementsByClassName('red').length,
        document.getElementsByClassName('blue').length
    ];
    document.getElementById('rednumber').childNodes[0].nodeValue = " : " + score[0];
    document.getElementById('bluenumber').childNodes[0].nodeValue = " : " + score[1];
}

function updateInfo() {
    document.getElementsByClassName("info")[0].childNodes[0].nodeValue = "Players In Lobby: " + numberOfPlayers;
}

function updateTimer(timeLeft) {
    document.getElementsByClassName("info")[0].childNodes[0].nodeValue = "Countdown: " + timeLeft;
}

// PLAYER HANDLING 

function animate() {
    for (var user in playerInfo) {
        if (playerInfo.hasOwnProperty(user)) {
            var playerCoord = playerInfo[user][0];
            var playerTeam = playerInfo[user][1];
            var lastSquare;
            var newSquare;

            try {
                if(!setup) {
                    lastSquare = document.getElementById(user);
                    toClaimed(lastSquare, playerTeam); 
                }
            }
            catch(err) {}
            finally {
                try {
                    newSquare = coord(playerCoord[0],playerCoord[1]);
                    if(newSquare.className.includes("blue") || newSquare.className.includes("red")) {
                        if(!setup) {
                           killPlayer(lastSquare); 
                        }
                    } else {
                        toPlayer(newSquare, playerTeam, user); 
                    }    
                }
                catch(err) {
                    console.log("errtoplayer")
                    killPlayer(lastSquare);
                }
            }
        }
    }
    autoScroll('start');
}

function coord(x,y) {
    return table.rows[x].cells[y];
}

function toPlayer(square,team,username) {
    square.className = "player " + team;
    square.style.backgroundColor = playerColors[team];
    square.id = username;
}

function toClaimed(square,team) {
    square.style.backgroundColor = claimedColors[team];
    square.className = square.className.replace("player ", "");
    square.id = "";
}

function movePlayer(e) {

    e = e || window.event;

    if (e.keyCode === 38) {

        sendMove(-1,0);
    } else if (e.keyCode === 40) {

        sendMove(1,0);
    } else if (e.keyCode === 37) {

        sendMove(0,-1);
    } else if (e.keyCode === 39) {

        sendMove(0,1);
    }
}

function killPlayer(square) {
    var death = {};
    death[myUsername] = ["death"];

    $.ajax(serverURL + '/game', {
        method: 'POST',
        type : 'POST',
        data: JSON.stringify(death, null, '\t'),
        dataType: "json",
        contentType: 'application/json;charset=UTF-8'
    })
    .then(
        function success(data) {
            toClaimed(square,myTeam);
            sendMove(0,0);
            // Spectator mode first to set team to spectator
            //spectatorMode();
            //serverTransfer(coordinate,team,turn,username);  
        },
        function error(e) {
            console.log(e);
            alert(e);
        }
    );     
}

function timeMove() {
    document.getElementsByClassName("info")[0].childNodes[0].nodeValue = "Next Turn: " + turnTime;
    if(turnTime == 0) {
        turnTime = 3;
        if(!hasSent) {
            sendMove(0,0);
        }
    } else {
        moveTimer = setTimeout(function() {
            turnTime -= 1;
            timeMove();
        }, 1000)
    }
}
/*
function spectatorMode() {
    playerCoordinate = null;
    playerTeam = 'spectator';
    document.getElementsByClassName('spectator')[0].style.opacity = 0.7;
    spectatorType = 'spectatorFull';
    spectatorFull();
    document.getElementsByClassName('spectator')[0].onclick = function changeText() {
        spectatorChoose = spectatorChoose * (-1);
        if(spectatorChoose == -1) {
            document.getElementsByClassName('spectator')[0].childNodes[0].childNodes[0].nodeValue = "Following";
            spectatorType = 'spectatorFollow';
            document.getElementsByTagName('body')[0].style.overflow = "hidden";
        } else {
            document.getElementsByClassName('spectator')[0].childNodes[0].childNodes[0].nodeValue = "Full View";
            spectatorType = 'spectatorFull';
            spectatorFull();
        }
    };
}

function spectatorFull() {
    for(var i = 0; i < document.getElementsByTagName('td').length;i++) {
        document.getElementsByTagName('body')[0].style.overflow = "auto";
        document.getElementsByTagName('td')[i].style.minWidth = "75px";
        document.getElementsByTagName('td')[i].style.height = "75px";
    }
}*/

function autoScroll(type) {
    center = [
        window.innerHeight / -2,
        window.innerWidth / -2
    ];
    if(type == 'start') {
        $('body').scrollTo(document.getElementById(myUsername), 0, {offset: {top: center[0] , left: center[1]} });
    } else if (type == "spectator") {
        $('body').scrollTo(document.getElementById(spectatedUser), 100, {offset: {top: center[0] , left: center[1]} });
    } else {
        alert("Broken?");
        // $('body').scrollTo(document.getElementById(username), 100, {offset: {top: center[0] , left: center[1]} });
    }
}