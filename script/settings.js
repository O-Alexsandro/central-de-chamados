function renderSettings(container) {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));

  container.innerHTML = `
    <h2>Configurações</h2>
    <label>Nome de exibição</label>
    <input type="text" id="inputNomeUsuario" value="${user.nome}" />
    <button id="btnSalvarConfig" class="primary">Salvar Alterações</button>
  `;

  document.getElementById('btnSalvarConfig').addEventListener('click', () => {
    const novoNome = document.getElementById('inputNomeUsuario').value.trim();
    if (!novoNome) {
      alert('Nome não pode estar vazio');
      return;
    }

    user.nome = novoNome;
    localStorage.setItem('usuarioLogado', JSON.stringify(user));

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios = usuarios.map(u => u.username === user.username ? user : u);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Configurações salvas com sucesso!');
    document.querySelector('.user-menu span').textContent = `Bem-vindo, ${user.nome}`;
  });
}
