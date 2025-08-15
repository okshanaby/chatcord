const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const chatMessageInput = document.getElementById("msg");
const socket = io();

// listen for message from the server
socket.on("message", message => {
  renderMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// hanlde message submit
chatForm.addEventListener("submit", e => {
  e.preventDefault();

  // get message value
  const msg = chatMessageInput.value;

  // send the message to the server
  socket.emit("chatMessage", msg);

  // clear input and focus
  chatMessageInput.value = "";
  chatMessageInput.focus();
});

// render message function
function renderMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
    <p class="meta"> ${message.username} <span> ${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>
  `;

  chatMessages.appendChild(div);
}
