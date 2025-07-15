function renderRegister(container) {
  container.innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <div class="login-logo"></div>
        <h1>Criar Conta</h1>
        <p class="login-subtitle">Preencha seus dados para se cadastrar</p>
        
        <form id="registerForm" class="login-form">
          <div class="form-group">
            <label for="regNome">Nome Completo *</label>
            <input type="text" id="regNome" placeholder="Seu nome completo" required>
          </div>
          
          <div class="form-group">
            <label for="regUsername">Usuário *</label>
            <input type="text" id="regUsername" placeholder="Crie um nome de usuário" required>
          </div>
          
          <div class="form-group">
            <label for="regPassword">Senha *</label>
            <input type="password" id="regPassword" placeholder="Crie uma senha segura" required minlength="6">
          </div>
          
          <div class="form-group">
            <label for="regConfirmPassword">Confirmar Senha *</label>
            <input type="password" id="regConfirmPassword" placeholder="Repita sua senha" required>
          </div>
          
          <div class="form-group">
            <label for="regSetor">Setor *</label>
            <select id="regSetor" required>
              <option value="">Selecione seu setor</option>
              <option value="TI">TI</option>
              <option value="Financeiro">Financeiro</option>
              <option value="RH">RH</option>
              <option value="Comercial">Comercial</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          
          <button type="submit" class="btn-login">Cadastrar</button>
          
          <div class="login-link">
            Já tem uma conta? <a href="login.html">Faça login</a>
          </div>
        </form>
      </div>
    </div>
  `;

  const form = document.getElementById('registerForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('regNome').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const setor = document.getElementById('regSetor').value;
    
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    let users = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (users.some(u => u.username === username)) {
      alert('Este nome de usuário já está em uso!');
      return;
    }
    
    const newUser = {
      nome,
      username,
      password,
      setor
    };
    
    users.push(newUser);
    localStorage.setItem('usuarios', JSON.stringify(users));
    
    alert('Cadastro realizado com sucesso!');
    window.location.href = 'login.html';
  });
}