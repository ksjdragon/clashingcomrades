// Global Variables 
var playerInfo = {};
var maxPlayers;

// Client Player Info
var myTeam;
var myCoord;
var myUsername

var type;

/*var spectatorChoose = 1;
var spectatedUser;*/

var numberOfPlayers = 1;
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
        username: myUsername
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
            myCoord = data.coordinate
            maxPlayers = data.max;
        },
        function error(e) {
            console.log(e);
            alert(e);
        }
    );
}

function waitForPlayers() {
    timer1 = setTimeout(function() {
        var sending = {
                username: myUsername
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
                alert(e);
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
                timeLeft = data.timeLeft;
                updateTimer(timeLeft);
                delete data['timeLeft'];
                playerInfo = data;
                animate();

                if (timeLeft === 0) {
                    startGame();
            },
            error: function(e) {
                console.log(e);
                alert(e);
            } 
        });
    }, 250); //Prevent too many requests
}

function startGame() {
    remove = document.getElementsByClassName("info")[0];
    remove.parentNode.removeChild(remove);
    //SET UP VISUALS
}

function sendMove(x,y) {
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
        },
        function error(e) {
            console.log(e);
            alert(e);
        }
    );
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
    document.getElementsByClassName("info")[0].childNodes[0].nodeValue = "Players in lobby: " + numberOfPlayers;
}

function updateTimer(timeLeft) {
    document.getElementsByClassName("info")[0].childNodes[0].nodeValue = "Countdown: " + timeLeft;
}

// PLAYER HANDLING 

function animate(x,y) {
    for (var user in playerInfo) {
        if (data.hasOwnProperty(user)) {
            var playerCoord = data[user]['coordinate'];
            var playerTeam = data[user]['team'];

            //if coords out of bounds, animate kill


        }
    }
    /* func create player
    startSquare = table.rows[coordinate[0]].cells[coordinate[1]];
    startSquare.style.backgroundColor = playerColors[team];
    startSquare.className = "player " + team;
    startSquare.id = username;

            function updateTable(coordinate, team, username) {
    otherPlayer = table.rows[coordinate[0]].cells[coordinate[1]];
    otherPlayer.style.backgroundColor = playerColors[team];
    otherPlayer.className = "player " + team; 
    otherPlayer.id = username;
}

function updateOldTable(coordinate, team) {
    otherPlayer = table.rows[coordinate[0]].cells[coordinate[1]];
    otherPlayer.style.backgroundColor = claimedColors[team];
    otherPlayer.className = otherPlayer.className.replace("player ", "");
    otherPlayer.id = "";
}
            previousSquare = table.rows[playerCoordinate[0]].cells[playerCoordinate[1]];
            nextSquare = table.rows[playerCoordinate[0] + y].cells[playerCoordinate[1] + x];
        } catch(err) {
            //Hitting top/down
            killPlayer(playerCoordinate, playerTeam);
        }
    }
  deathSquare = table.rows[coordinate[0]].cells[coordinate[1]];
            deathSquare.style.backgroundColor = claimedColors[team]; 
            deathSquare.className = deathSquare.className.replace("player ", "");
            deathSquare.id = "";
    timer =
        setTimeout(function() {
            try {
                if (nextSquare === undefined ||
                        nextSquare.className.includes('player') ||
                        playerTeam === "spectator" ||
                        nextSquare.className.includes(playerTeam)) {
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
                }
                turn = turn + 1;
                autoScroll('spectator');
                movement(x,y);
            }
            catch(err) {
                // Hitting left/right
                killPlayer(playerCoordinate, playerTeam);
            }
        }, 100);
}*/

function movePlayer(e) {

    e = e || window.event;

    if (e.keyCode === 38 && type != "up") {
        type = "up";
        sendMove(0,-1);
    } else if (e.keyCode === 40 && type != "down") {
        type = "down";
        sendMove(0,1);
    } else if (e.keyCode === 37 && type != "left") {
        type = "left";
        sendMove(-1,0);
    } else if (e.keyCode === 39 && type != "right") {
        type = "right";
        sendMove(1,0);
    }
}

function killPlayer(coordinate, team) {
    var death = {
        myUsername: ["death"]
    };

    $.ajax(serverURL + '/game', {
        method: 'POST',
        type : 'POST',
        data: JSON.stringify(death, null, '\t'),
        dataType: "json",
        contentType: 'application/json;charset=UTF-8'
    })
    .then(
        function success(data) {
            animate();
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
        $('body').scrollTo(document.getElementById(username), 0, {offset: {top: center[0] , left: center[1]} });
    } else if (type == "spectator") {
        $('body').scrollTo(document.getElementById(spectatedUser), 100, {offset: {top: center[0] , left: center[1]} });
    } else {
        alert("Broken?");
        // $('body').scrollTo(document.getElementById(username), 100, {offset: {top: center[0] , left: center[1]} });
    }
}