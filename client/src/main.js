let socket;

initWebSocket();
refreshGames();

function initWebSocket() {
    const url = 'ws://localhost:5000/'
    socket = new WebSocket(url);

    socket.onopen = event => {
        console.log("[ws] Connected", event);
        socket.send("getMessages");
    };

    socket.onmessage = event => {
        console.log("[ws:messageReceived]", event.data);
        const index = event.data.indexOf(" ");
        const title = event.data.substring(0, index);
        const dataString = event.data.substring(index + 1);

        const data = JSON.parse(dataString);
        switch (title) {
            case "newGame":
                return onNewGame(data);
            case "removeGame":
                return removeGameDiv(parseInt(data));
            case "gameEnded":
                return endGameDiv(parseInt(data));
            case "refreshMessages":
                return refreshMessages(data);
        }
    };

    socket.onclose = event => {
        console.log("[ws] Closed");
        setTimeout(() => initWebSocket(), 1000);
    };

}

function refreshGames() {
    const games = getGames();
    for (const game of games) {
        createGameDiv(game);
    }

    refreshCounter();
}

function newGame() {
    const newGameInput = document.getElementById("newGameInput");
    const newGameName = newGameInput.value;
    if (newGameName.length < 5) {
        alert("Minimum 5 characteres.");

        return;
    }
    sendRequest("POST", "game", { name: newGameName });
}

function deleteGame(event) {
    const gameId = event.srcElement.id;
    sendRequest("DELETE", "game", { id: gameId });
}

function endGame(event) {
    const gameId = event.srcElement.id.split("-")[1];
    sendRequest("PUT", "game", { id: gameId });
}

function getGames() {
    const games = sendRequest("GET", "game");

    return games;
}

function sendRequest(method, url, data = {}) {
    const http = new XMLHttpRequest();
    const strParams = Object.entries(data).map((entries) => `${entries[0]}=${entries[1]}`).join("&");
    http.open(method, `http://localhost:8080/${url}?${strParams}`, false);
    http.setRequestHeader('Content-type', 'application/json');
    http.send();

    if (method === "GET") {
        return JSON.parse(http.response);
    }
}

function refreshCounter() {
    let counter = 0;
    const gamesDiv = document.getElementById("games");
    for (const gameDiv of gamesDiv.childNodes) {
        if (!gameDiv.childNodes[0].checked) {
            counter++;
        }
    }
    const counterEl = document.getElementById("counter");
    counterEl.innerHTML = counter;
}

function createGameDiv(game, first = false) {
    const gameDiv = document.createElement("div");
    gameDiv.className = "game";
    gameDiv.id = `game-${game.id}`;

    const checkbox = createCheckbox(game);
    gameDiv.appendChild(checkbox);

    const nameDiv = createNameDiv(game);
    gameDiv.appendChild(nameDiv);

    const img = createImg(game);
    gameDiv.appendChild(img);

    const gamesDiv = document.getElementById('games');
    if (first) {
        gamesDiv.insertBefore(gameDiv, gamesDiv.firstChild);
    } else {
        gamesDiv.appendChild(gameDiv);
    }
}

function createCheckbox(game) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `checkbox-${game.id}`;
    checkbox.checked = game.ended;
    checkbox.disabled = game.ended;
    checkbox.onchange = endGame;

    return checkbox;
}

function createImg(game) {
    const img = document.createElement("img");
    img.src = "./resources/img/croix-rouge.png";
    img.className = "redCross"
    img.width = "32";
    img.height = "32";
    img.id = game.id;
    img.onclick = deleteGame;

    return img;
}

function createNameDiv(game) {
    const nameDiv = document.createElement("div");
    nameDiv.id = `namediv-${game.id}`;
    nameDiv.innerHTML = game.name;
    if (game.ended) {
        nameDiv.classList.add("endedGame");
    }

    return nameDiv;
}

function removeGameDiv(gameId) {
    const gameDiv = document.getElementById(`game-${gameId}`);
    gameDiv.remove();
    refreshCounter();
}

function endGameDiv(gameId) {
    const checkbox = document.getElementById(`checkbox-${gameId}`);
    checkbox.checked = true;
    checkbox.disabled = true;
    const nameDiv = document.getElementById(`namediv-${gameId}`);
    nameDiv.classList.add("endedGame");
    refreshCounter();
}

function onNewGame(data) {
    createGameDiv(data, true);
    refreshCounter();
}

function sendMessage() {
    const nicknameInput = document.getElementById("nickNameInput");
    const messageInput = document.getElementById("messageInput");

    if (nicknameInput.value.length === 0 || messageInput.value.length === 0) {
        return alert("Veuillez renseigner un nickname et un message");
    }

    const message = {
        nickname: nicknameInput.value,
        message: messageInput.value,
    };
    socket.send(`newMessage ${JSON.stringify(message)}`);

    messageInput.value = "";
}

function refreshMessages(messages) {
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = "";
    for (const message of messages) {
        const messageDiv = document.createElement("div");
        messageDiv.innerHTML = `<b>${message.nickname}</b> : ${message.message}`;
        messagesDiv.appendChild(messageDiv);
    }

    messagesDiv.scrollTop = messagesDiv.scrollHeight - messagesDiv.clientHeight;
}