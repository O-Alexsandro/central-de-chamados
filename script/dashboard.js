document.addEventListener('DOMContentLoaded', async function () {
  await getChamados();
  await pegarQtdChamadosEmAbertosUsuario();
  await pegarQtdChamadosEmTratativaUsuario();
  await pegarQtdChamadosResolvidosUsuario();
});

async function getChamados() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/chamados/usuario`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar chamados');
    }

    const data = await response.json();
    console.log('Chamados recebidooooos:', data);

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
      <div class="card open"><strong>0</strong><span><br> Chamados Abertos</span></div>
      <div class="card progress"><strong>0</strong><span><br> Em Andamento</span></div>
      <div class="card closed"><strong>0</strong><span><br> Resolvidos</span></div>
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


async function pegarQtdChamadosEmAbertosUsuario() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/chamados/emAberto`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar chamados');
    }

    const quantidade = await response.json(); // aqui vem o Long do backend
    console.log('Quantidade de chamados em aberto:', quantidade);

    // Atualiza o valor no HTML
    document.querySelector('.card.open strong').textContent = quantidade;

  } catch (error) {
    console.error('Erro ao buscar os chamados:', error);
  }
}

async function pegarQtdChamadosEmTratativaUsuario() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/chamados/emTratativa`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar chamados');
    }

    const quantidade = await response.json(); // aqui vem o Long do backend
    console.log('Quantidade de chamados em aberto:', quantidade);

    // Atualiza o valor no HTML
    document.querySelector('.card.progress strong').textContent = quantidade;

  } catch (error) {
    console.error('Erro ao buscar os chamados:', error);
  }
}

async function pegarQtdChamadosResolvidosUsuario() {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/chamados/resolvido`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar chamados');
    }

    const quantidade = await response.json(); // aqui vem o Long do backend
    console.log('Quantidade de chamados em aberto:', quantidade);

    // Atualiza o valor no HTML
    document.querySelector('.card.closed strong').textContent = quantidade;

  } catch (error) {
    console.error('Erro ao buscar os chamados:', error);
  }
}

async function updateTicketsList() {
  const ticketsList = document.querySelector('#ticketsList');
  const statusFilter = document.getElementById('filterStatus').value;
  const priorityFilter = document.getElementById('filterPriority').value;
  const searchTerm = document.getElementById('searchTickets').value.toLowerCase();

  const token = localStorage.getItem('token');
  let filtrados = [];

  try {
    const response = await fetch(`${BACKEND_BASE_URL}/chamados/status/emAbertoEemTratativa`, {
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

function renderTicketDetails(container, ticket) {
  container.innerHTML = `
    <div class="ticket-container">
      <div class="ticket-header">
        <h1 class="ticket-title">Detalhes do Chamado #${ticket.idChamado}</h1>
        <span class="ticket-status status-${(ticket.status?.valorStatus || 'Desconhecido').toLowerCase().replace(/\s+/g, '-')}">
          ${ticket.status?.valorStatus || 'Desconhecido'}
        </span>
      </div>

      <div class="ticket-details">
        <div class="detail-row">
          <span class="detail-label">Título:</span>
          <span class="detail-value">${ticket.tituloChamado}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Setor:</span>
          <span class="detail-value">${ticket.departamento?.nomeDepartamento || 'Não informado'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Prioridade:</span>
          <span class="detail-value priority-${(ticket.prioridade?.nivelPrioridade || 'sem-prioridade').toLowerCase()}">
            ${ticket.prioridade?.nivelPrioridade || 'Sem prioridade'}
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Criado em:</span>
          <span class="detail-value">${formatarData(ticket.dataCadastro)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Criado por:</span>
          <span class="detail-value">${ticket.usuarioSistema?.username || 'Desconhecido'}</span>
        </div>
      </div>

      <div class="ticket-description">
        <strong>Descrição:</strong><br>
        ${ticket.descricao || 'Sem descrição'}
      </div>

      ${ticket.anexoNome ? `
      <div class="ticket-attachment">
        <strong>Anexo:</strong><br>
        <div class="attachment-preview">
          <a href="#" class="attachment-link">
            <i class="fas fa-download"></i> ${ticket.anexoNome}
          </a>
        </div>
      </div>` : ''}

      <div class="ticket-actions">
        <button class="btn btn-secondary" id="btnVoltar">
          <i class="fas fa-arrow-left"></i> Voltar para a lista
        </button>
      </div>
    </div>
  `;

  // document.getElementById('btnComentario').addEventListener('click', () => {
  //   const texto = document.getElementById('comentarioNovo').value.trim();
  //   if (!texto) {
  //     alert('Por favor, digite um comentário');
  //     return;
  //   }

  //   ticket.comentarios.push({
  //     autor: getUsuarioAtual(),
  //     texto,
  //     data: new Date().toISOString(),
  //   });

  //   if (salvarChamado(ticket)) {
  //     document.getElementById('comentarioNovo').value = '';
  //     renderTicketDetails(container, ticket);
  //   }
  // });

  // document.getElementById('btnMarcarResolvido')?.addEventListener('click', () => {
  //   if (confirm('Deseja realmente marcar este chamado como resolvido?')) {
  //     ticket.status.valorStatus = 'Resolvido';
  //     ticket.comentarios.push({
  //       autor: getUsuarioAtual(),
  //       texto: 'Chamado marcado como resolvido',
  //       data: new Date().toISOString(),
  //     });
      
  //     if (salvarChamado(ticket)) {
  //       renderDashboard(container);
  //     }
  //   }
  // });

  document.getElementById('btnVoltar').addEventListener('click', async () => {
    renderDashboard(container);
    await pegarQtdChamadosEmAbertosUsuario();
    await pegarQtdChamadosEmTratativaUsuario();
    await pegarQtdChamadosResolvidosUsuario();
    await updateTicketsList();
  });
}