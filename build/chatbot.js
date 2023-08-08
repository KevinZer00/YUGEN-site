// chatbot.js
document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn'); // Ensure this ID matches your HTML button ID
  
    if (!sendBtn) {
      console.error('Error: Could not find the send button element.');
      return;
    }
  
    sendBtn.addEventListener('click', async () => {
      const userMessage = userInput.value.trim();
  
      if (userMessage === '') {
        return;
      }
  
      // Clear user input field
      userInput.value = '';
  
      // Display user message in chat
      const userMessageElement = document.createElement('div');
      userMessageElement.textContent = `You: ${userMessage}`;
      userMessageElement.classList.add('chat-message', 'user-message');
      chatMessages.appendChild(userMessageElement);
  
      // Call the server-side API to get chatbot response
      const response = await fetch('/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });
  
      const data = await response.json();
      const chatbotResponse = data.chatbotResponse;
  
      // Display chatbot response in chat
      const chatbotResponseElement = document.createElement('div');
      chatbotResponseElement.textContent = `Chatbot: ${chatbotResponse}`;
      chatbotResponseElement.classList.add('chat-message', 'chatbot-message');
      chatMessages.appendChild(chatbotResponseElement);
    });
  });
  