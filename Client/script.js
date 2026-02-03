// ===============================
// Variables globales
// ===============================
let ws = null;


// ===============================
// Affichage des sections
// ===============================
const showlogin = () => {
    document.getElementById('login-section').classList.remove('is-hidden');
    document.getElementById('chat-section').classList.add('is-hidden');
    return true;
}

const showchat = () => {
    document.getElementById('login-section').classList.add('is-hidden');
    document.getElementById('chat-section').classList.remove('is-hidden');
    return true;
}


// ===============================
// Connexion WebSocket
// ===============================
function connectToServer() {
    const pseudo = document.getElementById("pseudo").value.trim();
    const ip = document.getElementById("ip").value.trim();
    const port = document.getElementById("port").value.trim();

    if (!pseudo || !ip || !port) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    ws = new WebSocket(`ws://${ip}:${port}`);

    ws.onopen = () => {
        // Envoyer infos de connexion
        ws.send(JSON.stringify({
            action: "login",
            pseudo: pseudo
        }));

        // Demander la liste des utilisateurs existants
        ws.send(JSON.stringify({ action: "getUsers" }));

        // Afficher l’interface chat
        showchat();
    };

    ws.onerror = () => {
        alert("Erreur de connexion au serveur !");
    };

    ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);

        // Liste des utilisateurs
        if (data.action === "userList") {
            updateUserList(data.users);
        }

        // Messages du chat
        if (data.action === "chat") {
            addMessageToChat(data);
        }

        // Messages système (connexion/déconnexion)
        if (data.action === "status") {
            addStatusToChat(data.message, data.time);
        }
    };
}


// ===============================
// Mise à jour de la liste des users
// ===============================
function updateUserList(users) {
    const list = document.getElementById("user-list");
    list.innerHTML = "";

    users.forEach(u => {
        const h = document.createElement("h3");
        h.innerText = u;
        list.appendChild(h);
    });
}


// ===============================
// Gestion affichage des messages
// ===============================
function addStatusToChat(text, time) {
    const box = document.getElementById("messages-container");
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `
        <span class="message-info">[${time}]</span>
        <span class="status-message">* ${text}</span>
    `;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function addMessageToChat(data) {
    const box = document.getElementById("messages-container");
    const div = document.createElement("div");
    div.classList.add("message");

    div.innerHTML = `
        <span class="message-info">[${data.time}]</span>
        <span><strong>${data.from}:</strong> ${data.message}</span>
    `;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}


// ===============================
// Envoi message utilisateur
// ===============================
function sendMessage() {
    const input = document.getElementById("message-input");
    const msg = input.value.trim();

    if (msg === "" || !ws) return;

    ws.send(JSON.stringify({
        action: "message",
        content: msg
    }));

    input.value = "";
}


// ===============================
// Événements
// ===============================
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    connectToServer();
});

document.getElementById("send-btn").addEventListener("click", sendMessage);

document.getElementById("message-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});


// ===============================
// Déconnexion
// ===============================
document.getElementById("disconnect-btn").addEventListener("click", () => {
    if (ws) ws.close();
    showlogin();
});
