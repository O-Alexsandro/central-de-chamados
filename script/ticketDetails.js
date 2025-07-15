function renderTicketDetails(container, ticket) {
  container.innerHTML = `
    <div class="ticket-details-container">
      <h2>Detalhes do Chamado #${ticket.id}</h2>
      
      <div class="ticket-details">
        <div class="detail-row">
          <span class="detail-label">Título:</span>
          <span class="detail-value">${ticket.titulo}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Status:</span>
          <span class="detail-value status-${ticket.status.toLowerCase().replace(' ', '-')}">
            ${ticket.status}
          </span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Setor:</span>
          <span class="detail-value">${ticket.setor}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Prioridade:</span>
          <span class="detail-value priority-${ticket.prioridade.toLowerCase()}">
            ${ticket.prioridade}
          </span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Criado em:</span>
          <span class="detail-value">${formatarData(ticket.dataCriacao)}</span>
        </div>
        
        <div class="detail-row">
          <span class="detail-label">Criado por:</span>
          <span class="detail-value">${ticket.criador}</span>
        </div>
        
        <div class="detail-row full-width">
          <span class="detail-label">Descrição:</span>
          <p class="detail-value">${ticket.descricao}</p>
        </div>
        
        ${ticket.anexoNome ? `
        <div class="detail-row">
          <span class="detail-label">Anexo:</span>
          <span class="detail-value">
            <a href="#" class="download-link">${ticket.anexoNome}</a>
          </span>
        </div>` : ''}
      </div>

      <div class="comment-box">
        <h3>Comentários</h3>
        <div id="comentarios">
          ${(ticket.comentarios || []).map(c => `
            <div class="comment">
              <div class="comment-header">
                <strong>${c.autor}</strong>
                <span class="comment-date">${formatarData(c.data)}</span>
              </div>
              <p class="comment-text">${c.texto}</p>
            </div>
          `).join('')}
        </div>
        <textarea id="comentarioNovo" placeholder="Adicionar comentário..." rows="3"></textarea>
        <button id="btnComentario" class="primary">Enviar Comentário</button>
      </div>

      <div class="ticket-actions">
        ${ticket.status !== 'Resolvido' ? `
          <button id="btnMarcarResolvido" class="success">✅ Marcar como Resolvido</button>
          <button id="btnEncaminhar" class="warning">🔁 Encaminhar para outro setor</button>
        ` : ''}
        <button id="btnVoltar" class="secondary">🔙 Voltar para a lista</button>
      </div>
    </div>
  `;

  document.getElementById('btnComentario').addEventListener('click', () => {
    const texto = document.getElementById('comentarioNovo').value.trim();
    if (!texto) {
      alert('Por favor, digite um comentário');
      return;
    }

    ticket.comentarios.push({
      autor: getUsuarioAtual(),
      texto,
      data: new Date().toISOString(),
    });

    if (salvarChamado(ticket)) {
      document.getElementById('comentarioNovo').value = '';
      renderTicketDetails(container, ticket);
    }
  });

  document.getElementById('btnMarcarResolvido')?.addEventListener('click', () => {
    if (confirm('Deseja realmente marcar este chamado como resolvido?')) {
      ticket.status = 'Resolvido';
      ticket.comentarios.push({
        autor: getUsuarioAtual(),
        texto: 'Chamado marcado como resolvido',
        data: new Date().toISOString(),
      });
      
      if (salvarChamado(ticket)) {
        renderDashboard(container);
      }
    }
  });

  document.getElementById('btnVoltar').addEventListener('click', () => {
    renderDashboard(container);
  });

  document.getElementById('btnEncaminhar')?.addEventListener('click', () => {
    const novoSetor = prompt("Para qual setor deseja encaminhar?", ticket.setor);
    if (novoSetor && novoSetor !== ticket.setor) {
      ticket.setor = novoSetor;
      ticket.comentarios.push({
        autor: getUsuarioAtual(),
        texto: `Chamado encaminhado para o setor: ${novoSetor}`,
        data: new Date().toISOString(),
      });
      
      if (salvarChamado(ticket)) {
        alert(`Chamado encaminhado para ${novoSetor}`);
        renderTicketDetails(container, ticket);
      }
    }
  });
}

function salvarChamado(chamadoAtualizado) {
  try {
    let chamados = JSON.parse(localStorage.getItem('chamados')) || [];
    chamados = chamados.map(c => 
      c.id === chamadoAtualizado.id ? chamadoAtualizado : c
    );
    localStorage.setItem('chamados', JSON.stringify(chamados));
    return true;
  } catch (error) {
    console.error('Erro ao salvar chamado:', error);
    alert('Ocorreu um erro ao salvar as alterações. Por favor, tente novamente.');
    return false;
  }
}