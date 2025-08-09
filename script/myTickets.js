// // Adicione esta função utilitária
// function formatarData(data) {
//   return new Date(data).toLocaleString('pt-BR', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
// }

// // Em newTicket.js, modifique:
// const novoChamado = {
//   // ... outros campos
//   dataCriacao: new Date().toISOString() // Armazena como ISO
// };

// // Em dashboard.js, modifique a exibição:
// <span>🕒 ${formatarData(ticket.dataCriacao)}</span>