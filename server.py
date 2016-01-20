from flask import Flask
from flask import render_template, jsonify, request
import time
import random
app = Flask(__name__)

# Since only one game for now, this is the object that will hold the data for the game
game = {}
color = 0
vertical = 0
playersInGame = []
maxPlayers = 2
initialTime = 0
timeLeft = 3

def RandomMove(playerStatus):
    x = [1,0]
    random.shuffle(x)
    game[playerStatus["username"]][0] = [x[0] + game[playerStatus["username"]][0][0], x[1] + game[playerStatus["username"]][0][1]]


# Renders client
@app.route("/")
def initial():
    return render_template('index.html')

# The URL where the data transfer takes place, the "backend"
@app.route('/game', methods=['POST'])
def update_game():

    # What to do when the Client tells the server something
    if request.method == 'POST':
        global timeLeft
        # Define the data given by client
        playerStatus = request.get_json(force=True)

        if timeLeft == 3:
            origin = time.time()


        if len(playerStatus[playerStatus.keys()[0]]) == 1:
            if playerStatus[playerStatus.keys()[0]][0] == "death":
                del game[playerStatus["username"]]
            else:
                global color
                global vertical
                color = color + 1
                team = ["red", "blue"][color % 2]
                horizontal = 10 + color % 2
                vertical = vertical + 1
                answer = {
                    "team": team,
                    "coordinate": [vertical, horizontal],
                    "max": maxPlayers
                }

                game[playerStatus[playerStatus.keys()[0]][0]] = [[vertical, horizontal], team]

                return jsonify(answer)


        # If the username that the player sent is already defined in game
        elif playerStatus["username"] in game:
            if abs(playerStatus["coordinate"][0]) + abs(playerStatus["coordinate"][1]) == 1:
                coord1 = playerStatus["coordinate"][0] + game[playerStatus["username"]][0][0]
                coord2 = playerStatus["coordinate"][1] + game[playerStatus["username"]][0][1]
                game[playerStatus["username"]][0] = [coord1, coord2]

            else:
                print "Hax?"
                RandomMove(playerStatus)


        else:
            return "Hax"

        # Return the game with the information you added, in addition to everyone else
        while (time.time() - origin) < 3:
                    time.sleep(0.1)
        timeLeft = 3
        return jsonify(game)

@app.route('/pregame', methods=['GET','POST'])
def update_players():
    global initialTime
    global maxPlayers

    if request.method == 'GET':
        after = time.time()
        timeSince = after - initialTime
        timeLeft = 10 - timeSince
        print timeLeft
        game["timeLeft"] = timeLeft

        return jsonify(game)

    if request.method == 'POST':
        #Define the data given by client.
        username = request.get_json(force=True)
        print username

        # If this client has not already registered with the server, register.
        if not username["username"] in playersInGame:
            playersInGame.append(username["username"])

        numberofplayers = len(playersInGame)
        if numberofplayers == maxPlayers:
            initialTime = time.time()

        print numberofplayers

        toReturn = {}
        toReturn["playersInGame"] = numberofplayers
        
        return jsonify(toReturn)
        
    # if request.method == 'EXIT':
    #     #Define the data given by client.
    #     uuid4 = request.get_json(force=True)
    #     playersInGame.remove(uuid4)

# Eventual more than one game can be played on website

# @app.route('/game/<int:game_id>', methods=['GET', 'POST'])
# def update_game(game_id):
#     if request.method == 'GET':
#         return jsonify(games[game_id])
#     if request.method == 'POST':
#         print request.form
#         games[game_id] = {"state": request.form['state']}
#         return jsonify(games[game_id])

if __name__ == "__main__":
    # app.run(host='0.0.0.0')
    app.run(debug=True, threaded=True)
