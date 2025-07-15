window.onload = function() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  if (!isLoggedIn || !user) {
    if (!window.location.pathname.includes('login.html')) {
      window.location.href = 'login.html';
    }
    return;
  }

  document.querySelector('.sidebar').style.display = 'block';
  document.querySelector('.top-bar').style.display = 'flex';
  document.querySelector('.user-menu span').textContent = `Bem-vindo, ${user.nome}`;
  
  setupMenuEvents();
  renderDashboard(document.getElementById('app'));
};

function setActiveMenu(selectedItem) {
  document.querySelectorAll('.main-menu li a').forEach(item => {
    item.classList.remove('active');
  });
  selectedItem.classList.add('active');
}

function setupMenuEvents() {
  const app = document.getElementById('app');

  document.getElementById('menuDashboard').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderDashboard(app);
  });

  document.getElementById('menuMyTickets').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderMyTickets(app);
  });

  document.getElementById('menuResolved').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderResolvedTickets(app);
  });

  document.getElementById('menuNewTicket').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderNewTicket(app, addTicket);
  });

  document.getElementById('menuFaq').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderFaq(app);
  });

  document.getElementById('menuReports').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderReports(app);
  });

  document.getElementById('menuSettings').addEventListener('click', e => {
    e.preventDefault();
    setActiveMenu(e.target);
    renderSettings(app);
  });

  document.querySelector('.btn-logout').addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'login.html';
    }
  });
}

// Função utilitária para formatar datas
function formatarData(dataISO) {
  if (!dataISO) return 'Data inválida';
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dataISO).toLocaleString('pt-BR', options);
}