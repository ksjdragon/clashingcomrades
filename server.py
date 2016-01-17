from flask import Flask
from flask import render_template, jsonify, request
import time
app = Flask(__name__)

# Since only one game for now, this is the object that will hold the data for the game
game = {}
color = 0
vertical = 0
playersInGame = []
# Testing 1 Player for now
maxPlayers = 1
timeLeft = 11

# Renders client
@app.route("/")
def initial():
    return render_template('index.html')

# The URL where the data transfer takes place, the "backend"
@app.route('/game', methods=['GET', 'POST'])
def update_game():

    # This is for if the Client Wants something
    # Eventually will be used for initial team and coordinate
    # Not currently being used anywhere
    if request.method == 'GET':
        global color
        global vertical
        color = color + 1
        team = ["red", "blue"][color % 2]
        horizontal = 10 + color % 2
        vertical = vertical + 1
        answer = {
            "team": team,
            "coordinate": [vertical, horizontal]
        }

        return jsonify(answer)

    # What to do when the Client tells the server something
    if request.method == 'POST':
        # Define the data given by client
        playerStatus = request.get_json(force=True)
        # If the username that the player sent is already defined in game
        if playerStatus["username"] in game:
            game[playerStatus["username"]].append([playerStatus["turn"], playerStatus["coordinate"], playerStatus["team"]])
        else:
            game[playerStatus["username"]] = [[playerStatus["turn"], playerStatus["coordinate"], playerStatus["team"]]]

        # Return the game with the information you added, in addition to everyone else
        return jsonify(game)

@app.route('/pregame', methods=['GET','POST','EXIT'])
def update_players():
    
    if request.method == 'GET':
        countdown()
        toReturn = {}
        toReturn["timeLeft"] = timeLeft
        return jsonify(toReturn)

    if request.method == 'POST':
        #Define the data given by client.
        uuid4 = request.get_json(force=True)
        # If this client has not already registered with the server, register.
        if not uuid4 in playersInGame:
            playersInGame.append(uuid4)
        toReturn = {}
        toReturn["playersInGame"] = len(playersInGame)
        return jsonify(toReturn)
        
    if request.method == 'EXIT':
        #Define the data given by client.
        uuid4 = request.get_json(force=True)
        playersInGame.remove(uuid4)

def countdown():
    timeLeft = 11
    timeLeft = timeLeft - 1      
    time.sleep(1)
    if len(playersInGame) != maxPlayers:
        timeLeft = 11
    else:
        countdown()

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
    app.run(debug=True)
