document.addEventListener('DOMContentLoaded', async function() {
  const container = document.getElementById('app');
    renderNewTicket(container, novoChamado => {
    console.log('Chamado criado:', novoChamado);
  });
});

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
              <option value="">Selecione...</option>
            </select>
          </div>

          <div class="form-group">
            <label for="inputSetor">Departamentos *</label>
            <select id="inputSetor" required>
              <option value="">Selecione...</option>
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

  prioridades();
  loadDepartamentosRelacionamento();

  const form = document.getElementById('formNovoChamado');
  const fileInput = document.getElementById('inputAnexo');
  const fileLabel = document.getElementById('fileLabel');

  fileInput.addEventListener('change', () => {
    fileLabel.textContent = fileInput.files[0]?.name || 'Nenhum arquivo selecionado';
  });

  document.getElementById('btnCancelar').addEventListener('click', () => {
    renderDashboard(container);
  });

  form.addEventListener('submit', async e => {
    
  e.preventDefault();

    // Validações
    const titulo = document.getElementById('inputTitulo').value.trim();
    const descricao = document.getElementById('inputDescricao').value.trim();
    let isValid = true;
    const prioridade = document.getElementById('inputPrioridade').value;
    const departamento = document.getElementById('inputSetor').value;
    const anexo = fileInput.files[0];

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


    const formData = new FormData();
    formData.append('tituloChamado', titulo);
    formData.append('descricao', descricao);
    formData.append('IdPrioridade', prioridade);
    formData.append('IdDepartamento', departamento);
    formData.append('IdStatus', 1);
    if (anexo) {
      formData.append('anexo', anexo); // nome deve bater com @RequestParam("anexo")
    }

    console.log("OS dados a serem enviados são: " + formData.json)

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8080/chamados/registrar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      alert('Erro ao abrir chamado');
      return;
    }

    const novoChamado = await response.json();
    addTicketCallback(novoChamado);
    alert('Chamado aberto com sucesso!');
    renderDashboard(container);
  } catch (error) {
    console.error('Erro ao registrar chamado:', error);
    alert('Erro ao abrir chamado. Tente novamente mais tarde.');
  }
})
};

async function prioridades() {
    try {
        const response = await fetch('http://localhost:8080/prioridades');
        if (response.ok) {
            const prioridades = await response.json();
            console.log('API Response:', prioridades); // Debug API response
            const select = document.getElementById('inputPrioridade');
            prioridades.forEach(prioridade => {
                const option = document.createElement('option');
                option.value = prioridade.idPrioridade;
                option.textContent = prioridade.nivelPrioridade;
                select.append(option);  
            });
        } else {
            console.error('Erro ao carregar prioridades');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
};

async function loadDepartamentosRelacionamento() {
    try {
        const response = await fetch('http://localhost:8080/departamento');
        if (response.ok) {
            const departamentos = await response.json();
            console.log('API Response:', departamentos); // Debug API response
            const select = document.getElementById('inputSetor');
            departamentos.forEach(departamento => {
                const option = document.createElement('option');
                option.value = departamento.idDepartamento;
                option.textContent = departamento.nomeDepartamento;
                select.append(option);  
            });
        } else {
            console.error('Erro ao carregar departamentos');
        }
    } catch (error) {
        console.error('Erro:', error);
    }
};