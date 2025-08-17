async function renderResolvedTickets(container) {
  const token = localStorage.getItem('token');
  let resolvidos = [];

  container.innerHTML = `
    <div class="resolved-header">
      <h2><i class="fa fa-check-circle"></i> Chamados Resolvidos</h2>
      <input type="text" id="searchResolved" placeholder="🔍 Buscar chamados resolvidos..." />
    </div>
    <div id="resolvedTicketsList" class="ticket-list"></div>
  `;

  async function fetchResolvedTickets() {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/chamados/status/resolvido`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao buscar chamados resolvidos');

      resolvidos = await response.json();
      updateList();
    } catch (error) {
      console.error(error);
      const list = document.getElementById('resolvedTicketsList');
      list.innerHTML = '<p class="no-results">Erro ao carregar chamados resolvidos.</p>';
    }
  }

  function updateList() {
    const searchTerm = document.getElementById('searchResolved').value.toLowerCase();
    const filtrados = searchTerm
      ? resolvidos.filter(c =>
          (c.tituloChamado || '').toLowerCase().includes(searchTerm) ||
          (c.descricao || '').toLowerCase().includes(searchTerm)
        )
      : resolvidos;

    const list = document.getElementById('resolvedTicketsList');
    list.innerHTML = '';

    if (filtrados.length === 0) {
      list.innerHTML = '<p class="no-results">Nenhum chamado resolvido encontrado.</p>';
      return;
    }

    filtrados.forEach(ticket => {
      const card = document.createElement('div');
      card.className = 'ticket-card resolved';
      card.innerHTML = `
        <div class="ticket-header">
          <span class="ticket-id">#${ticket.idChamado}</span>
          <span class="ticket-date">${formatarData(ticket.dataCadastro)}</span>
        </div>
        <h3>${ticket.tituloChamado}</h3>
        <p>${(ticket.descricao || '').substring(0, 120)}...</p>
        <div class="ticket-footer">
          <span>📌 ${ticket.prioridade?.nivelPrioridade || 'Sem prioridade'}</span>
          <span>🏷️ ${ticket.departamento?.nomeDepartamento || 'Não informado'}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        renderTicketDetails(container, ticket);
      });
      list.appendChild(card);
    });
  }

  document.getElementById('searchResolved').addEventListener('input', updateList);

  await fetchResolvedTickets();
}