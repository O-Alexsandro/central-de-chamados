document.addEventListener('DOMContentLoaded', function() {
    const chatContainer = document.getElementById('chat-widget-container');
    const chatToggle = document.getElementById('chat-toggle');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');

    let isChatOpen = false;

    chatToggle.addEventListener('click', function() {
        isChatOpen = !isChatOpen;
        chatContainer.style.display = isChatOpen ? 'flex' : 'none';
        chatToggle.textContent = isChatOpen ? '×' : '⊥';
        
        if (isChatOpen) {
            userInput.focus();
        }
    });

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function callSmartBotAPI(message) {
        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;

    const token = localStorage.getItem('token');
    const payload = parseJwt(token);
    const usuario = payload ? payload.username || payload.sub || payload.email : "usuario_desconhecido";

        try {
            const response = await fetch('http://localhost:8080/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token

                },
                body: JSON.stringify({ 
                    mensagem: message, 
                    usuario: usuario
                })
            });

            if (!response.ok) throw new Error('Erro na resposta');

            const data = await response.json();
            return data.resposta;

        } catch (error) {
            console.error('Erro:', error);
            return "Desculpe, estou tendo problemas técnicos. Por favor, tente novamente mais tarde.";
        } finally {
            typingIndicator.style.display = 'none';
        }
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        addMessage(message, true);
        userInput.value = '';

        const response = await callSmartBotAPI(message);
        addMessage(response, false);
    }

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    addMessage("Olá! Sou o SmartBot, seu assistente de TI. Como posso ajudar?", false);
});