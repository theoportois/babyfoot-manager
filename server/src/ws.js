import { WebSocket, WebSocketServer } from "ws";
import { getMessages, newMessage } from "./tchat.js";

let wss;

export function initWebSocket() {
    wss = new WebSocketServer({ port: 5000 });

    wss.on("connection", ws => {
        console.log("Client connected");
        ws.on("message", message => {
            console.log("[ws:messageReceived]", message.toString());

            if (message.toString() === "getMessages") {
                return send(ws, "refreshMessages", getMessages());
            }
            
            if (message.toString().startsWith("newMessage")) {
                return newMessage(message);
            }
        });
    });
}

export function broadcast(message, data) {
    wss.clients.forEach(client => {
        send(client, message, data);
    });
}

function send(ws, message, data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(`${message} ${JSON.stringify(data)}`);
    }
}

export { wss };