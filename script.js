const claude = new PuterAI({ model: "claude-sonnet-4" }); // or add apiKey if needed
const chatDiv = document.getElementById("chat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Append a message with timestamp
function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;

    const timestamp = document.createElement("span");
    timestamp.className = "timestamp";
    timestamp.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});

    div.textContent = text;
    div.appendChild(timestamp);

    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
    return div;
}

// Send message and stream Claude response
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    appendMessage("user", message);
    userInput.value = "";

    const claudeDiv = appendMessage("claude", "");

    try {
        await puter.ai.chat(message, {
            model: "claude-sonnet-4", // or any supported Claude model
            stream: true,
            onStream: (chunk) => {
                claudeDiv.textContent += chunk.text || '';
                chatDiv.scrollTop = chatDiv.scrollHeight;
            }
        });
    } catch (err) {
        claudeDiv.textContent = "Error: " + err.message;
    }
}

// Event listeners
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
