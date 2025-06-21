# E-Suggestion-Box

Ce projet est une boîte à idées électronique pour étudiants et administrateurs.

# Fonctionnalités

- **Soumission d'idées** par les étudiants (anonymes ou non)
- **Gestion des suggestions** par les administrateurs
- **Votes** (pouce en haut/bas) par les admins, un seul vote par admin et par idée, possibilité de changer d'avis
- **Classement** des idées selon les votes
- **Inscription et connexion admin**

# Structure

- "index.html" : page principale
- "static/js/script.js" : logique front-end (avec commentaires dans le code)
- "static/css/style.css" : style
- "server.py" : serveur Flask (API)
- "data.json" : stockage des suggestions
- "admins.json" : stockage des admins

# Lancer le projet

1. Installer Python et Flask (`pip install flask`)
2. Lancer le serveur Python :
    "server.py"
3. Ouvrir [http://127.0.0.1:5000](http://127.0.0.1:5000) dans le navigateur
