const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

chatWindow.textContent = "👋 Hello! How can I help you today?";

function addMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = sender;
  messageDiv.textContent = text;
  chatWindow.appendChild(messageDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function getOpenAIResponse(userMessage) {
  addMessage("user", userMessage);
  addMessage("assistant", "Thinking...");

  try {
    const response = await fetch("https://loreal-worker.anthonythan2001.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "Only formulate responses that correspond and correlate to L'Oréal and their products. You will be their chatbot and only be used for that purpose. Be peppy and have an energetic personality. If someone asks a question not related to your tasks, make it clear that you can only help with L'Oréal specific questions. Keep the responses relatively short to prevent from losing the customer's interest."
          },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    chatWindow.removeChild(chatWindow.lastChild);

    if (data.reply) {
      addMessage("assistant", data.reply);
    } else {
      addMessage("assistant", "⚠️ Unexpected response format.");
      console.error("Missing 'reply' in response:", data);
    }
  } catch (error) {
    chatWindow.removeChild(chatWindow.lastChild);
    addMessage("assistant", "❌ Error reaching assistant.");
    console.error("Fetch error:", error);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message) {
    getOpenAIResponse(message);
    userInput.value = "";
  }
});
