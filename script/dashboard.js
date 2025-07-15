function getChamados() {
  return JSON.parse(localStorage.getItem('chamados')) || [];
}

function getUsuarioAtual() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  return user?.username || 'desconhecido';
}

function addTicket(novoChamado) {
  const chamados = getChamados();
  const novo = {
    ...novoChamado,
    id: Date.now(),
    criador: getUsuarioAtual(),
    comentarios: [],
    dataCriacao: new Date().toISOString()
  };

  chamados.push(novo);
  localStorage.setItem('chamados', JSON.stringify(chamados));
  return novo;
}

function contarPorStatus(status) {
  const chamados = getChamados();
  return chamados.filter(c => c.status === status && c.criador === getUsuarioAtual()).length;
}

function renderDashboard(container) {
  container.innerHTML = `
    <div class="dashboard-header">
      <h2><i class="fa fa-clipboard-list"></i> Meus Chamados</h2>
      <div class="dashboard-actions">
        <input type="text" id="searchTickets" placeholder="🔍 Buscar por título ou descrição..." />
        <button id="btnNewTicket" class="primary">
          <i class="fa fa-plus"></i> Novo Chamado
        </button>
      </div>
    </div>

    <div class="filters-bar">
      <label>Status:</label>
      <select id="filterStatus">
        <option value="">Todos</option>
        <option value="Aberto">Aberto</option>
        <option value="Em andamento">Em andamento</option>
        <option value="Resolvido">Resolvido</option>
      </select>

      <label>Prioridade:</label>
      <select id="filterPriority">
        <option value="">Todas</option>
        <option value="Baixa">Baixa</option>
        <option value="Média">Média</option>
        <option value="Alta">Alta</option>
      </select>
    </div>

    <div class="ticket-summary">
      <div class="card open"><strong>${contarPorStatus('Aberto')}</strong><span>🔓 Abertos</span></div>
      <div class="card progress"><strong>${contarPorStatus('Em andamento')}</strong><span>⚙️ Em Andamento</span></div>
      <div class="card closed"><strong>${contarPorStatus('Resolvido')}</strong><span>✅ Resolvidos</span></div>
    </div>

    <div id="ticketsList" class="ticket-list"></div>
  `;

  document.getElementById('btnNewTicket').addEventListener('click', () => {
    renderNewTicket(container, addTicket);
  });

  document.getElementById('filterStatus').addEventListener('change', updateTicketsList);
  document.getElementById('filterPriority').addEventListener('change', updateTicketsList);
  document.getElementById('searchTickets').addEventListener('input', updateTicketsList);

  updateTicketsList();
}

function updateTicketsList() {
  const ticketsList = document.querySelector('#ticketsList');
  const statusFilter = document.getElementById('filterStatus').value;
  const priorityFilter = document.getElementById('filterPriority').value;
  const searchTerm = document.getElementById('searchTickets').value.toLowerCase();
  const user = getUsuarioAtual();

  let filtrados = getChamados().filter(c => c.criador === user);

  if (statusFilter) filtrados = filtrados.filter(c => c.status === statusFilter);
  if (priorityFilter) filtrados = filtrados.filter(c => c.prioridade === priorityFilter);
  if (searchTerm) {
    filtrados = filtrados.filter(c =>
      c.titulo.toLowerCase().includes(searchTerm) ||
      c.descricao.toLowerCase().includes(searchTerm)
    );
  }

  ticketsList.innerHTML = '';

  if (filtrados.length === 0) {
    ticketsList.innerHTML = '<p class="no-results">Nenhum chamado encontrado.</p>';
    return;
  }

  filtrados.forEach(ticket => {
    const card = document.createElement('div');
    card.className = `ticket-card status-${ticket.status.replace(' ', '-').toLowerCase()}`;
    card.innerHTML = `
      <div class="ticket-header">
        <span class="ticket-id">#${ticket.id}</span>
        <span class="ticket-status">${ticket.status}</span>
      </div>
      <h3>${ticket.titulo}</h3>
      <p>${ticket.descricao.substring(0, 100)}...</p>
      <div class="ticket-footer">
        <span>🕒 ${formatarData(ticket.dataCriacao)}</span>
        <span>📌 ${ticket.prioridade}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      renderTicketDetails(document.getElementById('app'), ticket);
    });

    ticketsList.appendChild(card);
  });
}