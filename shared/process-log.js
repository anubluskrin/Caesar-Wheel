function renderProcessLog(containerId, columns, rows){
  const container = document.getElementById(containerId);
  if(!container) return;

  if(!rows || rows.length === 0){
    container.innerHTML = `<p class="log-empty">Belum ada proses untuk ditampilkan.</p>`;
    return;
  }

  const thead = `<tr>${columns.map(c => `<th>${c.label}</th>`).join('')}</tr>`;
  const tbody = rows.map(row => {
    const cells = columns.map(c => `<td>${row[c.key] ?? ''}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  container.innerHTML = `
    <table class="process-table">
      <thead>${thead}</thead>
      <tbody>${tbody}</tbody>
    </table>
  `;
}