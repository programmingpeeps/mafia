// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket
// and connect at the socket path in "lib/web/endpoint.ex":
import {Socket} from "phoenix"

let socket = null;

document.querySelector('#user-submit').onclick = () => {
  let username = document.querySelector('#username').value;
  if (!username) return;

  socket = new Socket("/socket", { params: { user: username } });
  socket.connect();

  let channel = socket.channel("room:lobby", {});
  let dmChannel = socket.channel(`room:${username}`, {});
  let chatInput = document.querySelector("#chat-input");
  let whisperInput = document.querySelector("#bot-input");
  let messagesContainer = document.querySelector("#messages");

  chatInput.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      channel.push("new_msg", { body: chatInput.value });
      chatInput.value = "";
      event.stopPropagation();
      return false;
    }
  });

  whisperInput.addEventListener("keypress", event => {
    if (event.keyCode === 13) {
      channel.push("dm_msg", { to: "bot", message: whisperInput.value });
      whisperInput.value = "";
      event.stopPropagation();
      return false;
    }
  });

  channel.on("new_msg", payload => {
    let messageItem = document.createElement("p");
    messageItem.innerText = `[${payload.user}] ${payload.message}`;
    messagesContainer.appendChild(messageItem);
  });

  dmChannel.on("dm_msg", payload => {
    let messageItem = document.createElement("p");
    messageItem.innerText = `DM [${payload.user}] ${payload.message}`;
    messagesContainer.appendChild(messageItem);
  });

  channel
    .join()
    .receive("ok", resp => {
      console.log("Joined successfully", resp);
    })
    .receive("error", resp => {
      console.log("Unable to join", resp);
    });
  dmChannel.join();

}

export default socket;