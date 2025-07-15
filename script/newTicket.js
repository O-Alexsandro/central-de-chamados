function renderNewTicket(container, addTicketCallback) {
  container.innerHTML = `
    <div class="new-ticket">
      <h2><i class="fa fa-plus-circle"></i> Abrir Novo Chamado</h2>
      <form id="formNovoChamado" class="ticket-form">
        <div class="form-group">
          <label for="inputTitulo">Título *</label>
          <input type="text" id="inputTitulo" placeholder="Ex: Impressora sem papel" required minlength="5" />
          <small class="error-message" id="tituloError"></small>
        </div>

        <div class="form-group">
          <label for="inputDescricao">Descrição *</label>
          <textarea id="inputDescricao" rows="5" placeholder="Descreva o problema detalhadamente" required minlength="10"></textarea>
          <small class="error-message" id="descricaoError"></small>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="inputPrioridade">Prioridade *</label>
            <select id="inputPrioridade" required>
              <option value="Baixa">Baixa</option>
              <option value="Média" selected>Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          <div class="form-group">
            <label for="inputSetor">Setor *</label>
            <select id="inputSetor" required>
              <option value="TI" selected>TI</option>
              <option value="Financeiro">Financeiro</option>
              <option value="RH">RH</option>
              <option value="Comercial">Comercial</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="inputAnexo">Anexo (opcional)</label>
          <input type="file" id="inputAnexo" />
          <p id="fileLabel" class="file-name">Nenhum arquivo selecionado</p>
        </div>

        <div class="form-actions">
          <button type="submit" class="primary">Salvar Chamado</button>
          <button type="button" id="btnCancelar" class="secondary">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  const form = document.getElementById('formNovoChamado');
  const fileInput = document.getElementById('inputAnexo');
  const fileLabel = document.getElementById('fileLabel');

  fileInput.addEventListener('change', () => {
    fileLabel.textContent = fileInput.files[0]?.name || 'Nenhum arquivo selecionado';
  });

  document.getElementById('btnCancelar').addEventListener('click', () => {
    renderDashboard(container);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Validações
    const titulo = document.getElementById('inputTitulo').value.trim();
    const descricao = document.getElementById('inputDescricao').value.trim();
    let isValid = true;

    if (titulo.length < 5) {
      document.getElementById('tituloError').textContent = 'O título deve ter pelo menos 5 caracteres';
      isValid = false;
    } else {
      document.getElementById('tituloError').textContent = '';
    }

    if (descricao.length < 10) {
      document.getElementById('descricaoError').textContent = 'A descrição deve ter pelo menos 10 caracteres';
      isValid = false;
    } else {
      document.getElementById('descricaoError').textContent = '';
    }

    if (!isValid) return;

    const prioridade = document.getElementById('inputPrioridade').value;
    const setor = document.getElementById('inputSetor').value;
    const anexo = fileInput.files[0];

    const novoChamado = {
      titulo,
      descricao,
      prioridade,
      setor,
      status: 'Aberto',
      dataCriacao: new Date().toISOString(),
      criador: getUsuarioAtual(),
      anexoNome: anexo ? anexo.name : '',
      comentarios: [],
    };

    addTicketCallback(novoChamado);
    alert('Chamado aberto com sucesso!');
    renderDashboard(container);
  });
}