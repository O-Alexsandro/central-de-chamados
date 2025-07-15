// script/navigation.js
function renderMyTickets(container) {
  container.innerHTML = `
    <h2>Meus Chamados</h2>
    <div class="filter-options">
      <select id="filterMyStatus">
        <option value="all">Todos</option>
        <option value="open">Abertos</option>
        <option value="progress">Em andamento</option>
      </select>
    </div>
    <div id="myTicketsList"></div>
  `;
  
  // Lógica para carregar apenas os chamados do usuário atual
}

function renderResolvedTickets(container) {
  container.innerHTML = `
    <h2>Chamados Resolvidos</h2>
    <div class="resolved-stats">
      <div class="stat-card">
        <span class="stat-number">24</span>
        <span class="stat-label">Últimos 7 dias</span>
      </div>
      <div class="stat-card">
        <span class="stat-number">89</span>
        <span class="stat-label">Últimos 30 dias</span>
      </div>
    </div>
    <div id="resolvedTicketsList"></div>
  `;
  
  // Lógica para carregar chamados resolvidos
}

function renderFaq(container) {
  container.innerHTML = `
    <h2>FAQ - Perguntas Frequentes</h2>
    <div class="faq-container">
      <div class="faq-item">
        <h3 class="faq-question">Como criar um novo chamado?</h3>
        <div class="faq-answer">
          <p>Clique em "Novo Chamado" no menu lateral, preencha todos os campos obrigatórios e clique em "Enviar".</p>
        </div>
      </div>
      <div class="faq-item">
        <h3 class="faq-question">Como acompanhar meus chamados?</h3>
        <div class="faq-answer">
          <p>Na seção "Meus Chamados" você pode ver todos os seus chamados abertos e em andamento.</p>
        </div>
      </div>
      <!-- Adicione mais perguntas conforme necessário -->
    </div>
  `;
  
  // Adicione lógica para expandir/recolher as perguntas
}