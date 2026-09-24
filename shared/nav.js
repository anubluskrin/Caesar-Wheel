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
      border:1px solid var(--ink);
      margin-bottom:24px;
      font-family:'Courier Prime', monospace;
      font-size:14px;
      overflow-x:auto;
    }
    .cipher-nav a{
      flex:1;
      text-align:center;
      padding:9px 6px;
      color:var(--ink-soft);
      text-decoration:none;
      border-right:1px solid var(--ink);
      white-space:nowrap;
    }
    .cipher-nav a:last-child{ border-right:none; }
    .cipher-nav a.active{
      background:var(--ink);
      color:var(--paper);
      font-weight:700;
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