from flask import Flask
from flask import render_template, jsonify, request
app = Flask(__name__)

games = {}
game = {}

@app.route("/")
def initial():
    return render_template('index.html')

@app.route('/game', methods=['GET', 'POST'])
def update_game():
    if request.method == 'GET':
        return jsonify(game)
    if request.method == 'POST':
        playerStatus = request.get_json(force=True)
        if playerStatus["turn"] in game:
            game[playerStatus["turn"]].append([playerStatus["coordinate"], playerStatus["team"]])
        else:
            game[playerStatus["turn"]] = [[playerStatus["coordinate"], playerStatus["team"]]]
        return jsonify(game)



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
