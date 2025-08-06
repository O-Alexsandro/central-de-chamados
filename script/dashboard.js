document.addEventListener('DOMContentLoaded', async function () {
  await getChamados(); // Coloque await aqui se quiser esperar a função terminar
});

async function getChamados() {
  const token = localStorage.getItem('token'); // ou onde você armazenou o token
  try {
    const response = await fetch('http://localhost:8080/chamados/usuario', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar chamados');
    }

    const data = await response.json();
    console.log('Chamados recebidos:', data);
    // aqui você pode chamar alguma função para renderizar os chamados na tela

  } catch (error) {
    console.error('Erro ao buscar os chamados:', error);
  }
}

function getUsuarioAtual() {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  return user?.username || 'desconhecido';
}

//  function addTicket(novoChamado) {
//    const chamados = getChamados();
//    const novo = {
//     ...novoChamado,
//      id: Date.now(),
//      criador: getUsuarioAtual(),
//      comentarios: [],
//      dataCriacao: new Date().toISOString()
//    };

//   chamados.push(novo);
//   localStorage.setItem('chamados', JSON.stringify(chamados));
//   return novo;
// }

// function contarPorStatus(status) {
//   const chamados = getChamados();
//   return chamados;
// }

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
      <div class="card open"><strong>('Aberto')}</strong><span>🔓 Abertos</span></div>
      <div class="card progress"><strong>10('Em andamento')}</strong><span>⚙️ Em Andamento</span></div>
      <div class="card closed"><strong>{10('Resolvido')}</strong><span>✅ Resolvidos</span></div>
    </div>

    <div id="ticketsList" class="ticket-list"></div>
  `;

  document.getElementById('btnNewTicket').addEventListener('click', () => {
    renderNewTicket(container);
  });

  document.getElementById('filterStatus').addEventListener('change', updateTicketsList);
  document.getElementById('filterPriority').addEventListener('change', updateTicketsList);
  document.getElementById('searchTickets').addEventListener('input', updateTicketsList);

  updateTicketsList();
}

async function updateTicketsList() {
  const ticketsList = document.querySelector('#ticketsList');
  const statusFilter = document.getElementById('filterStatus').value;
  const priorityFilter = document.getElementById('filterPriority').value;
  const searchTerm = document.getElementById('searchTickets').value.toLowerCase();

  const token = localStorage.getItem('token');
  let filtrados = [];

  try {
    const response = await fetch('http://localhost:8080/chamados/usuario', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar chamados');
    }

    const chamados = await response.json();

    filtrados = chamados.filter(c => {
      const titulo = c.tituloChamado?.toLowerCase() || '';
      const descricao = c.descricao?.toLowerCase() || '';
      const status = c.status?.valorStatus || '';
      const prioridade = c.prioridade?.nivelPrioridade || '';

      return (
        (!searchTerm || titulo.includes(searchTerm) || descricao.includes(searchTerm)) &&
        (!statusFilter || status === statusFilter) &&
        (!priorityFilter || prioridade === priorityFilter)
      );
    });

  } catch (error) {
    console.error('Erro ao carregar chamados:', error);
    ticketsList.innerHTML = '<p class="no-results">Erro ao carregar chamados.</p>';
    return;
  }

  ticketsList.innerHTML = '';

  if (filtrados.length === 0) {
    ticketsList.innerHTML = '<p class="no-results">Nenhum chamado encontrado.</p>';
    return;
  }

  filtrados.forEach(ticket => {
    const card = document.createElement('div');
    const status = ticket.status?.valorStatus || 'Desconhecido';
    const prioridade = ticket.prioridade?.nivelPrioridade || 'Sem prioridade';

    card.className = `ticket-card status-${status.replace(' ', '-').toLowerCase()}`;
    card.innerHTML = `
      <div class="ticket-header">
        <span class="ticket-id">#${ticket.idChamado}</span>
        <span class="ticket-status">${status}</span>
      </div>
      <h3>${ticket.tituloChamado}</h3>
      <p>${ticket.descricao?.substring(0, 100)}...</p>
      <div class="ticket-footer">
        <span>🕒 ${formatarData(ticket.dataCadastro)}</span>
        <span>📌 ${prioridade}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      renderTicketDetails(document.getElementById('app'), ticket);
    });

    ticketsList.appendChild(card);
  });
}