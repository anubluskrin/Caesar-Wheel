function renderProcessLog(containerId, columns, rows){
  // dipakai fallback statis kalau perlu — tapi sekarang kita pakai versi animasi:
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
  container.innerHTML = `<table class="process-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table>`;
}

// --- versi baru: log gaya terminal, muncul baris per baris ---
function runTerminalLog(containerId, lines, onDone, speed = 90){
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  container.classList.add('terminal-log');

  let i = 0;
  function nextLine(){
    if(i >= lines.length){
      if(onDone) onDone();
      return;
    }
    const p = document.createElement('p');
    p.className = 'term-line';
    p.textContent = '> ' + lines[i];
    container.appendChild(p);
    container.scrollTop = container.scrollHeight;
    i++;
    setTimeout(nextLine, speed);
  }
  nextLine();
}

// --- runner generik, dipakai semua halaman cipher ---
function wireCipherRunner({ runBtn, outputText, containerId, computeFn, formatLine, speed = 90 }){
  runBtn.addEventListener('click', ()=>{
    outputText.textContent = ' ';
    const { result, steps } = computeFn();
    const lines = steps.map(formatLine);

    runBtn.disabled = true;
    runTerminalLog(containerId, lines, ()=>{
      outputText.textContent = result || ' ';
      runBtn.disabled = false;
    }, speed);
  });
}