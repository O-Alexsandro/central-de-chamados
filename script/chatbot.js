document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-widget-container');
    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');

    // Estado do chat
    let isChatOpen = false;
    
    // Alternar visibilidade do chat
    chatToggle.addEventListener('click', function() {
      isChatOpen = !isChatOpen;
      chatContainer.style.display = isChatOpen ? 'flex' : 'none';
      chatToggle.textContent = isChatOpen ? '×' : '⊥';
      
      if (isChatOpen) {
        userInput.focus();
      }
    });
    
    // Adicionar mensagem ao chat
    function addMessage(text, isUser) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('message');
      messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
      messageDiv.textContent = text;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Simulação da API Gemini 
    async function callGeminiAPI(message) {
      typingIndicator.style.display = 'block';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      try {
        
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          },
          body: JSON.stringify({ message: message })
        });
        
        if (!response.ok) throw new Error('Erro na resposta');
        
        const data = await response.json();
        return data.reply;
        
      } catch (error) {
        console.error('Erro:', error);
        return "Desculpe, estou tendo problemas técnicos. Por favor, tente novamente mais tarde.";
      } finally {
        typingIndicator.style.display = 'none';
      }
    }
    
    // Enviar mensagem
    async function sendMessage() {
      const message = userInput.value.trim();
      if (message === '') return;
      
      addMessage(message, true);
      userInput.value = '';
      
      const response = await callGeminiAPI(message);
      addMessage(response, false);
    }
    
    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Mensagem inicial quando o chat é aberto pela primeira vez
    addMessage("Olá! Sou o SmartBot, seu assistente de TI. Como posso ajudar?", false);
  });