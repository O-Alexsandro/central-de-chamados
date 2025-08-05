function parseJwt (token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1]; // pega só o meio do JWT
    return JSON.parse(atob(payload));    // decodifica Base64 → JSON
  } catch (e) {
    console.error('JWT inválido', e);
    return null;
  }
}



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

  const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, senha: password })
      });

      if (!response.ok) {
        const msg = response.status === 401 ? 'Credenciais inválidas!' : 'Erro ao fazer login.';
        alert(msg, 'error');
        return;
      }

      const { token } = await response.json();
      localStorage.setItem('token', token);

      const payload = parseJwt(token);
      const role = payload?.role || 'user';
      localStorage.setItem('role', role);
      localStorage.setItem('lastLoginEmail', payload?.sub || username);

      localStorage.setItem('usuarioLogado', JSON.stringify({
      nome: payload?.nome || 'Usuário',  // <-- certifique-se que o token tem isso
      email: payload?.sub,
      role: role
    }));

localStorage.setItem('isLoggedIn', 'true');

      window.location.href = 'index.html';
    } catch (err) {
      console.error(err);
      alert('Não foi possível entrar. Tente novamente.', 'error');
    }
  });
}