from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder='static')

DATA_FILE = '/data.json'
ADMINS_FILE = '/admins.json'

# Fonctions pour lire/écrire dans le fichier JSON
def read_data():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({"suggestions": []}, f)
    with open(DATA_FILE, 'r') as f:
        return json.load(f)

def write_data(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def read_admins():
    if not os.path.exists(ADMINS_FILE):
        with open(ADMINS_FILE, 'w') as f:
            json.dump({"admins": []}, f)
    with open(ADMINS_FILE, 'r') as f:
        return json.load(f)

def write_admins(data):
    with open(ADMINS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Route pour la page principale
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# Route pour les fichiers statiques (css/js)
@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

# Récupérer toutes les suggestions
@app.route('/api/suggestions', methods=['GET'])
def get_suggestions():
    data = read_data()
    return jsonify(data["suggestions"])

# Ajouter une suggestion
@app.route('/api/suggestions', methods=['POST'])
def add_suggestion():
    data = read_data()
    suggestion = request.json
    suggestion["votes"] = 0  # On commence à 0 vote
    data["suggestions"].append(suggestion)
    write_data(data)
    return jsonify({"status": "ok"}), 201

# supprimer une suggestion
@app.route('/api/suggestions/<int:index>', methods=['DELETE'])
def delete_suggestion(index):
    data = read_data()
    if 0 <= index < len(data["suggestions"]):
        del data["suggestions"][index]
        write_data(data)
        return jsonify({"status": "ok"})
    return jsonify({"error": "Not found"}), 404

# Mettre à jour les votes
@app.route('/api/suggestions/<int:index>/vote', methods=['POST'])
def vote(index):
    data = read_data()
    vote_type = request.json.get("type")
    username = request.json.get("admin")

    if 0 <= index < len(data["suggestions"]):
        suggestion = data["suggestions"][index]
        # Initialisation si besoin
        if "voted_admins" not in suggestion:
            suggestion["voted_admins"] = {}
        if "votes_up" not in suggestion:
            suggestion["votes_up"] = 0
        if "votes_down" not in suggestion:
            suggestion["votes_down"] = 0

        voted_admins = suggestion["voted_admins"]
        previous_vote = voted_admins.get(username)

        # Si même appréciation, refuse
        if previous_vote == vote_type:
            return jsonify({"status": "error", "message": "Vous avez déjà voté avec cette appréciation."}), 403

        # Annule l'ancien vote
        if previous_vote == "up":
            suggestion["votes_up"] -= 1
        elif previous_vote == "down":
            suggestion["votes_down"] -= 1

        # Applique le nouveau vote
        if vote_type == "up":
            suggestion["votes_up"] += 1
        elif vote_type == "down":
            suggestion["votes_down"] += 1

        # Met à jour l'appréciation de l'admin
        voted_admins[username] = vote_type
        suggestion["voted_admins"] = voted_admins
        write_data(data)
        return jsonify({"status": "ok"})
    return jsonify({"error": "Not found"}), 404

# Connexion admin
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    admins = read_admins()["admins"]
    for admin in admins:
        if admin["username"] == data.get("username") and admin["password"] == data.get("password"):
            return jsonify({"status": "ok", "nom": admin["nom"], "prenom": admin["prenom"]})
    return jsonify({"status": "error", "message": "Identifiants incorrects"}), 401

# Inscription nouvel admin
@app.route('/api/admin/register', methods=['POST'])
def admin_register():
    try:
        data = request.json
        admins_data = read_admins()
        admins = admins_data["admins"]
        for admin in admins:
            if admin["username"] == data.get("username"):
                return jsonify({"status": "error", "message": "Nom d'utilisateur déjà pris"}), 400
        new_admin = {
            "username": data.get("username"),
            "password": data.get("password"),
            "nom": data.get("nom"),
            "prenom": data.get("prenom")
        }
        admins.append(new_admin)
        admins_data["admins"] = admins
        write_admins(admins_data)
        return jsonify({"status": "ok"})
    except Exception as e:
        print("Erreur inscription admin:", e)
        return jsonify({"status": "error", "message": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)