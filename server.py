from flask import Flask
from flask import render_template, jsonify, request
app = Flask(__name__)

# Since only one game for now, this is the object that will hold the data for the game
game = {}


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
        return jsonify(game)

    # What to do when the Client tells the server something
    if request.method == 'POST':
        # Define the data given by client
        playerStatus = request.get_json(force=True)
        # If the turn that the player sent is already defined in game
        if playerStatus["turn"] in game:
            game[playerStatus["turn"]].append([playerStatus["coordinate"], playerStatus["team"]])
        else:
            game[playerStatus["turn"]] = [[playerStatus["coordinate"], playerStatus["team"]]]
        # Return the game with the information you added, in addition to everyone else
        return jsonify(game)


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
