(function(){
  const pages = [
    { href: "/", label: "Caesar" },
    { href: "/vigenere", label: "Vigenère" },
    { href: "/rsa", label: "RSA" },
    { href: "/xor", label: "XOR" },
    { href: "/super", label: "Super" }
  ];

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

  const style = document.createElement('style');
  style.textContent = `
  .cipher-nav{
    display:flex;
    background:var(--paper);
    border:1px solid var(--line);
    border-radius:12px;
    padding:4px;
    margin-bottom:24px;
    font-family:-apple-system, 'Inter', sans-serif;
    font-size:13px;
    gap:4px;
    overflow-x:auto;
  }
  .cipher-nav a{
    flex:1;
    text-align:center;
    padding:8px 6px;
    color:var(--ink-soft);
    text-decoration:none;
    border-right:none;
    border-radius:9px;
    font-weight:600;
    white-space:nowrap;
    transition:all .15s ease;
  }
  .cipher-nav a.active{
    background:var(--paper-dark);
    color:var(--ink);
    box-shadow:0 1px 4px rgba(0,0,0,0.1);
  }
`;
  
  document.head.appendChild(style);

  const nav = document.createElement('nav');
  nav.className = 'cipher-nav';
  nav.innerHTML = pages.map(p => {
    const isActive = (p.href === "/" ? currentPath === "/" : currentPath === p.href);
    return `<a href="${p.href}" class="${isActive ? 'active' : ''}">${p.label}</a>`;
  }).join('');

  const slot = document.getElementById('nav-slot');
  if(slot) slot.replaceWith(nav);
})();