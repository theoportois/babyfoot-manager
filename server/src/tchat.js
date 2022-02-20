import { broadcast } from "./ws.js";

const messages = [];

export function getMessages() {
    return messages;
}

export function newMessage(message) {
    const msg = message.toString();
    const index = msg.indexOf(" ");
    const dataString = msg.substring(index + 1);
    messages.push(JSON.parse(dataString));
    broadcast("refreshMessages", messages);
}