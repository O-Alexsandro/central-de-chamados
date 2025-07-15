function renderResolvedTickets(container) {
  const user = getUsuarioAtual();
  const chamados = getChamados();
  const resolvidos = chamados.filter(c => c.status === 'Resolvido' && c.criador === user);

  container.innerHTML = `
    <div class="resolved-header">
      <h2><i class="fa fa-check-circle"></i> Chamados Resolvidos</h2>
      <input type="text" id="searchResolved" placeholder="🔍 Buscar chamados resolvidos..." />
    </div>
    <div id="resolvedTicketsList" class="ticket-list"></div>
  `;

  const updateList = () => {
    const searchTerm = document.getElementById('searchResolved')?.value.toLowerCase() || '';
    const filtrados = searchTerm 
      ? resolvidos.filter(c => 
          c.titulo.toLowerCase().includes(searchTerm) || 
          c.descricao.toLowerCase().includes(searchTerm))
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
          <span class="ticket-id">#${ticket.id}</span>
          <span class="ticket-date">${formatarData(ticket.dataCriacao)}</span>
        </div>
        <h3>${ticket.titulo}</h3>
        <p>${ticket.descricao.substring(0, 120)}...</p>
        <div class="ticket-footer">
          <span>📌 ${ticket.prioridade}</span>
          <span>🏷️ ${ticket.setor}</span>
        </div>
      `;
      card.addEventListener('click', () => {
        renderTicketDetails(container, ticket);
      });
      list.appendChild(card);
    });
  };

  document.getElementById('searchResolved')?.addEventListener('input', updateList);
  updateList();
}