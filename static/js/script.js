//  Navigation et affichage des sections 
function showSection(id) {
    document.querySelectorAll('section').forEach(sec => sec.style.display = 'none');
    const sec = document.getElementById(id);
    if (sec) sec.style.display = 'block';
    if (id === 'admin-management') loadSuggestions();
}

// Les formulaires dynamiques
function toggleStudentInfo() {
    const anon = document.getElementById('anonymous');
    const info = document.getElementById('student-info');
    if (anon && info) {
        info.style.display = (anon.value === 'no') ? 'block' : 'none';
        anon.onchange = () => info.style.display = (anon.value === 'no') ? 'block' : 'none';
    }
}
function toggleAdminForm() {
    const type = document.getElementById('admin-type');
    const reg = document.getElementById('admin-registered-form');
    const nw = document.getElementById('admin-new-form');
    if (type && reg && nw) {
        reg.style.display = (type.value === 'registered') ? 'block' : 'none';
        nw.style.display = (type.value === 'new') ? 'block' : 'none';
        type.onchange = () => {
            reg.style.display = (type.value === 'registered') ? 'block' : 'none';
            nw.style.display = (type.value === 'new') ? 'block' : 'none';
        };
    }
}

// Admin sous-sections 
function showAdminSection(section) {
    ['suggestions-section', 'ranking-section'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === section + '-section') ? 'block' : 'none';
    });
    if (section === 'suggestions') loadSuggestions();
    if (section === 'ranking') updateRanking();
    if (section === 'logout') {
        alert('Déconnexion réussie.');
        showSection('home');
    }
}

// Suggestions : affichage et votes 
async function loadSuggestions() {
    const ul = document.getElementById('suggestions-list');
    if (!ul) return;
    ul.innerHTML = '';
    const res = await fetch('/api/suggestions');
    if (!res.ok) return;
    const suggestions = await res.json();
    suggestions.forEach((sugg, idx) => {
        const up = sugg.votes_up || 0, down = sugg.votes_down || 0;
        ul.innerHTML += `
            <li>
                <span>${sugg.title || '(Sans titre)'}</span>
                <button onclick="voteSuggestionServer(${idx},'up')">👍 <span class="up-count">${up}</span></button>
                <button onclick="voteSuggestionServer(${idx},'down')">👎 <span class="down-count">${down}</span></button>
            </li>`;
    });
    updateRanking();
}

// Envoie le vote au serveur, demande le nom admin
async function voteSuggestionServer(index, type) {
    const username = prompt("Entrez votre nom d'utilisateur admin pour voter :");
    if (!username) return;
    const res = await fetch(`/api/suggestions/${index}/vote`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({type, admin: username})
    });
    const data = await res.json();
    if (res.ok && data.status === "ok") loadSuggestions();
    else alert(data.message || 'Erreur lors du vote.');
}

// Classement des idées par (votes_up - votes_down)
function updateRanking() {
    const ul = document.getElementById('suggestions-list');
    const rankingList = document.getElementById('ranking-list');
    if (!ul || !rankingList) return;
    let lis = Array.from(ul.children);
    lis.sort((a, b) => {
        let va = parseInt(a.querySelector('.up-count').textContent) - parseInt(a.querySelector('.down-count').textContent);
        let vb = parseInt(b.querySelector('.up-count').textContent) - parseInt(b.querySelector('.down-count').textContent);
        return vb - va;
    });
    rankingList.innerHTML = '';
    lis.forEach(li => {
        let clone = li.cloneNode(true);
        clone.querySelectorAll('button').forEach(btn => btn.disabled = true);
        rankingList.appendChild(clone);
    });
}

// Navigation boutons accueil/admin 
function setupHomeButtons() {
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.onclick = () => {
        document.getElementById('home-first-view').style.display = 'none';
        document.getElementById('home-second-view').style.display = 'block';
    };
    const studentBtn = document.getElementById('student-btn');
    if (studentBtn) studentBtn.onclick = () => { showSection('user-form'); toggleStudentInfo(); };
    const adminBtn = document.getElementById('admin-btn');
    if (adminBtn) adminBtn.onclick = () => { showSection('admin-login'); toggleAdminForm(); };
    const backBtn = document.getElementById('back-btn');
    if (backBtn) backBtn.onclick = () => {
        showSection('home');
        document.getElementById('home-first-view').style.display = 'block';
        document.getElementById('home-second-view').style.display = 'none';
    };
}
// Navigation boutons pour les formulaires
function goBackFromUserForm() {
    // Retour à la sélection du rôle (home-second-view)
    showSection('home');
    document.getElementById('home-first-view').style.display = 'none';
    document.getElementById('home-second-view').style.display = 'block';
}

function goBackFromAdminLogin() {
    // Retour à la sélection du rôle (home-second-view)
    showSection('home');
    document.getElementById('home-first-view').style.display = 'none';
    document.getElementById('home-second-view').style.display = 'block';
}

function goBackFromAdminManagement() {
    // Retour à la page de connexion admin
    showSection('admin-login');
}
function goBackFromHome() {
    // Retour à la page d'accueil
    showSection('home');
    document.getElementById('home-first-view').style.display = 'block';
    document.getElementById('home-second-view').style.display = 'none';
}

// Formulaires d'inscription/connexion admin 
function setupAdminForms() {
    // Inscription
    const adminNewForm = document.getElementById('admin-new-form');
    if (adminNewForm) {
        const registerBtn = adminNewForm.querySelector('button');
        if (registerBtn) registerBtn.onclick = async function() {
            const nom = document.getElementById('admin-name').value;
            const prenom = document.getElementById('admin-prenom').value;
            const username = document.getElementById('admin-new-username').value;
            const password = document.getElementById('admin-new-pass').value;
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nom, prenom, username, password})
            });
            const data = await res.json();
            if (res.ok && data.status === "ok") {
                alert('Inscription réussie, vous pouvez vous connecter.');
                document.getElementById('admin-type').value = 'registered';
                toggleAdminForm();
            } else alert(data.message || 'Erreur lors de l\'inscription.');
        };
    }
    // Connexion
    const adminRegisteredForm = document.getElementById('admin-registered-form');
    if (adminRegisteredForm) {
        const adminButton = adminRegisteredForm.querySelector('button');
        if (adminButton) adminButton.onclick = async function() {
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('adminpass').value;
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await res.json();
            if (res.ok && data.status === "ok") {
                alert('Connexion réussie, bienvenue ' + data.nom + ' !');
                showSection('admin-management');
            } else alert(data.message || 'Mot de passe ou identifiant incorrect !');
        };
    }
}

// Formulaire suggestion étudiant
function setupSuggestionForm() {
    const form = document.getElementById('ideeform');
    if (!form) return;
    form.onsubmit = async function(e) {
        e.preventDefault();
        const category = document.getElementById('category').value;
        const title = form.querySelector('input[name="title"]').value;
        const idee = form.querySelector('textarea[name="idee"]').value;
        const anonymous = document.getElementById('anonymous').value;
        let nom = '', prenom = '', filiere = '', promotion = '';
        if (anonymous === 'no') {
            nom = form.querySelector('input[name="nom"]').value;
            prenom = form.querySelector('input[name="prenom"]').value;
            filiere = form.querySelector('input[name="filiere"]').value;
            promotion = form.querySelector('input[name="promotion"]').value;
        }
        const suggestion = {category, title, idee, anonymous, nom, prenom, filiere, promotion};
        const res = await fetch('/api/suggestions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(suggestion)
        });
        if (res.ok) {
            alert('Suggestion envoyée ! Merci.');
            form.reset();
            toggleStudentInfo();
            showSection('home');
            document.getElementById('home-first-view').style.display = 'block';
            document.getElementById('home-second-view').style.display = 'none';
            loadSuggestions();
        } else alert('Erreur lors de l\'envoi.');
    };
}

// Initialisation générale 
document.addEventListener('DOMContentLoaded', function() {
    showSection('home');
    toggleStudentInfo();
    toggleAdminForm();
    setupHomeButtons();
    setupAdminForms();
    setupSuggestionForm();
    loadSuggestions();
});