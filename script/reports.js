function renderReports(container) {
  const chamados = getChamados();

  // Agrupar por setor e status
  const relatorio = {};
  chamados.forEach(c => {
    if (!relatorio[c.setor]) relatorio[c.setor] = {};
    if (!relatorio[c.setor][c.status]) relatorio[c.setor][c.status] = 0;
    relatorio[c.setor][c.status]++;
  });

  container.innerHTML = `
    <h2>Relatórios</h2>
    <div class="report-controls">
      <button id="btnExportCSV" class="primary">📊 Exportar CSV</button>
      <button id="btnExportJSON" class="secondary">📋 Exportar JSON</button>
    </div>
    
    <div class="report-summary">
      <h3>Resumo por Setor</h3>
      <div id="setorSummary"></div>
    </div>
    
    <div class="report-details">
      <h3>Detalhes dos Chamados</h3>
      <div id="ticketsDetails"></div>
    </div>
  `;

  // Resumo por setor
  const setorSummary = document.getElementById('setorSummary');
  let summaryHTML = '<div class="summary-grid">';
  
  for (const setor in relatorio) {
    summaryHTML += `
      <div class="summary-card">
        <h4>${setor}</h4>
        <ul>
          ${Object.entries(relatorio[setor]).map(([status, count]) => `
            <li class="status-${status.toLowerCase().replace(' ', '-')}">
              ${status}: ${count}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  setorSummary.innerHTML = summaryHTML + '</div>';

  // Detalhes dos chamados
  const ticketsDetails = document.getElementById('ticketsDetails');
  ticketsDetails.innerHTML = `
    <table class="report-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Setor</th>
          <th>Status</th>
          <th>Prioridade</th>
          <th>Criado em</th>
        </tr>
      </thead>
      <tbody>
        ${chamados.map(c => `
          <tr>
            <td>${c.id}</td>
            <td>${c.titulo}</td>
            <td>${c.setor}</td>
            <td class="status-${c.status.toLowerCase().replace(' ', '-')}">${c.status}</td>
            <td class="priority-${c.prioridade.toLowerCase()}">${c.prioridade}</td>
            <td>${formatarData(c.dataCriacao)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  // Exportação
  document.getElementById('btnExportCSV').addEventListener('click', () => {
    const headers = ['ID', 'Título', 'Setor', 'Status', 'Prioridade', 'Criado em', 'Criador'];
    const csvRows = [
      headers.join(','),
      ...chamados.map(c => 
        headers.map(h => {
          const value = h === 'Criado em' ? formatarData(c.dataCriacao) :
                        h === 'Criador' ? c.criador :
                        c[h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")];
          return `"${value}"`;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    downloadFile('relatorio_chamados.csv', 'text/csv', csvContent);
  });

  document.getElementById('btnExportJSON').addEventListener('click', () => {
    downloadFile('relatorio_chamados.json', 'application/json', JSON.stringify(chamados, null, 2));
  });
}

function downloadFile(filename, type, content) {
  const blob = new Blob(["\uFEFF" + content], { type: `${type};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}