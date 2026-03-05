# E-Suggestion Box

A full-stack web application for student idea submission and admin management, built with Flask (Python) and vanilla JavaScript as a group academic project at Burkina Institute of Technology (BIT).

---

## Overview

E-Suggestion Box is a student expression platform accessible from any browser. Students can submit ideas or suggestions (anonymously or not), while registered admins can manage, vote on, and rank them through a dedicated interface.

---

## Features

- Idea submission by students, with optional anonymity
- Admin registration and login system
- Up/down vote system — one vote per admin per idea, with the ability to change it
- Automatic ranking of ideas based on votes
- Full suggestion management for admins (review, moderate)

---

## Project Structure

```
Realese-Python/
├── server.py          # Flask server — REST API backend
├── index.html         # Main page — student and admin interface
├── data.json          # Persistent storage for suggestions
├── admins.json        # Persistent storage for admin accounts
└── static/
    ├── js/script.js   # Front-end logic (commented)
    └── css/style.css  # Stylesheet
```

---

## Getting Started

### Prerequisites

- Python 3.x
- Flask

```bash
pip install flask
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Zangafigue/Realese-Python.git

# Navigate into the project folder
cd Realese-Python
```

### Run the application

```bash
python server.py
```

Then open your browser at: [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## Built With

- **Python 3 / Flask** — backend API
- **HTML / CSS / JavaScript** — frontend
- **JSON** — lightweight data persistence

---

## Team — Group 20

This project was developed as a tutored assignment for the CS-27 Python & C course, supervised by **Dr. NABOLE** at BIT.

| Name |
|------|
| TRAORE Zangafigue Mathias |
| CONGO S Anifatou |
| WANGRE Esther |
| YABRE Amma |
| YAMMEOGO Cédric Régis |

---

## License

This project is for educational purposes — Burkina Institute of Technology, 2024.
