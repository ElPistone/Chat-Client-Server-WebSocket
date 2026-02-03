# Chat Client/Serveur WebSocket

## 📋 Description
Ce projet est une implémentation pédagogique d'un chat en temps réel utilisant le protocole WebSocket.  
Il est composé de deux parties principales :
- **Serveur** : écrit en C++ avec Qt6, doté d'une interface graphique affichant la liste des utilisateurs connectés.
- **Client** : une application web (HTML/CSS/JS) se connectant au serveur via WebSocket pour envoyer et recevoir des messages.

Les échanges se font en JSON, avec prise en charge des événements de connexion/déconnexion et de la diffusion des messages.

---

## 🎯 Objectifs pédagogiques
- Comprendre le fonctionnement des WebSockets
- Manipuler JSON côté client et serveur
- Développer une application réseau avec Qt6
- Structurer un projet avec CMake
- Gérer les états d'une application web en temps réel

---

## 📁 Structure du projet
- ├── ServeurQT/ # Code source du serveur Qt6
- │ ├── CMakeLists.txt
- │ ├── main.cpp
- │ └── (autres fichiers .h/.cpp)
- ├── Client/ # Client web
- │ ├── index.html
- │ └── script.js
- └── README.md
---

## 🚀 Fonctionnalités

### ✅ Côté serveur
- Interface graphique Qt6 affichant la liste des utilisateurs connectés
- Serveur WebSocket non sécurisé (ws://)
- Gestion des connexions/déconnexions
- Diffusion des messages à tous les clients
- Traitement des messages JSON (join, leave, message, users, system)
- Robustesse face aux messages malformés

### ✅ Côté client
- Interface web minimaliste (HTML/CSS/JS)
- Connexion via WebSocket avec pseudo personnalisé
- Affichage des messages avec timestamp et pseudo
- Liste dynamique des utilisateurs connectés
- Déconnexion propre avec envoi d'un message `leave`

---

## 🛠️ Technologies utilisées
- **Serveur** : C++17, Qt6 (Widgets, WebSockets, Network), CMake
- **Client** : HTML5, Bulma CSS, JavaScript natif (WebSocket API)
- **Protocole** : WebSocket (ws://)
- **Format d'échange** : JSON

---

## 📦 Installation et exécution

### Serveur
- Lancer QT creator
- Ouvrir le dossier ServeurQT
- Ouvrir le fichier CMakeLists.txt pour que QT configure le projet
- Compiler le projet 
### Client
- Ouvrir simplement client/index.html dans un navigateur moderne (Chrome, Firefox, Edge).
- Utiliser le port 1234 & l'IP 127.1.1.1 plus un pseudo

