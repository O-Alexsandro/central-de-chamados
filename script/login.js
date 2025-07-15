function renderLogin(container) {
  // Verifica se o container existe
  if (!container) {
    console.error('Container não encontrado para renderizar o login');
    return;
  }

  container.innerHTML = `
    <div class="login-container">
      <div class="login-box">
        <div class="login-logo"></div>
        <h1>Central de Chamados</h1>
        <p class="login-subtitle">Faça login para acessar o sistema</p>
        
        <form id="loginForm" class="login-form">
          <div class="form-group">
            <label for="username">Usuário</label>
            <input 
              type="text" 
              id="username" 
              placeholder="Insira seu usuário" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Insira sua senha" 
              required 
            />
            <a href="#" class="forgot-password">Esqueci minha senha</a>
          </div>
          
          <button type="submit" class="btn-login">Entrar</button>
        </form>
        
        <footer class="login-footer">
          <p>Sistema de Gestão de Chamados</p>
          <p>© ${new Date().getFullYear()} – Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  `;

  // Configura o evento de submit do formulário
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      // Dados de usuários padrão
      const users = JSON.parse(localStorage.getItem('usuarios')) || [
        { username: 'admin', password: 'admin123', nome: 'Administrador' },
        { username: 'tecnico', password: '1234', nome: 'Técnico de TI' }
      ];

      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('usuarioLogado', JSON.stringify(user));
        window.location.href = 'index.html';
      } else {
        alert('Usuário ou senha incorretos!');
        document.getElementById('password').value = '';
      }
    });
  }
}