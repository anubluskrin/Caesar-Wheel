(function(){
  const pages = [
    { href: "/", label: "Caesar" },
    { href: "/vigenere", label: "Vigenère" },
    { href: "/des", label: "DES" },
    { href: "/rc4", label: "RC4" },
    { href: "/super", label: "Super" }
  ];

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";

  const style = document.createElement('style');
  style.textContent = `
  .cipher-nav{
    display:flex;
    background:transparent;
    border:none;
    padding:0;
    margin-bottom:24px;
    font-family:'VT323', monospace;
    font-size:16px;
    gap:8px;
    overflow-x:auto;
  }
  .cipher-nav a{
    flex:1;
    text-align:center;
    padding:9px 6px;
    color:var(--ink);
    text-decoration:none;
    border:3px solid var(--ink);
    border-radius:0;
    font-weight:700;
    white-space:nowrap;
    background:#fff;
    box-shadow:3px 3px 0 #000;
    transition:transform .08s ease, box-shadow .08s ease;
  }
  .cipher-nav a:hover{ transform:translate(1px,1px); box-shadow:2px 2px 0 #000; }
  .cipher-nav a.active{
    background:var(--ink);
    color:#fff;
    transform:translate(3px,3px);
    box-shadow:0 0 0 #000;
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