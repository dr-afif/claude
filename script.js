const claude = new PuterAI({ model: "claude-sonnet-4" }); // or add apiKey if needed
const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");

function appendMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  
  const timestamp = document.createElement("span");
  timestamp.className = "timestamp";
  timestamp.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  div.textContent = text;
  div.appendChild(timestamp);

  chatDiv.appendChild(div);
  chatDiv.scrollTop = chatDiv.scrollHeight;
  return div;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  appendMessage("user", message);
  userInput.value = "";

  const claudeDiv = appendMessage("claude", "");

  try {
    const stream = await claude.streamMessage(message);

    stream.on("data", chunk => {
      claudeDiv.textContent += chunk;
      chatDiv.scrollTop = chatDiv.scrollHeight;
    });

    stream.on("end", () => {
      // finished
    });

    stream.on("error", err => {
      claudeDiv.textContent += "\n[Error: " + err.message + "]";
    });

  } catch (err) {
    claudeDiv.textContent = "Error: " + err.message;
  }
}

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
