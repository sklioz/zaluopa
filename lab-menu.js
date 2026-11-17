(() => {
  const picker = document.getElementById('lab-picker');
  if (!picker) return;
  const sections = Array.from(document.querySelectorAll('.lab-section'));
  const nav = document.querySelector('.lab-jump');
  const style = document.createElement('style');
  style.textContent = `
    .lab-picker{margin:24px 0 48px;padding:clamp(18px,3vw,30px);border:1px solid var(--line,rgba(255,255,255,.14));border-radius:22px;background:rgba(255,255,255,.025)}
    .lab-picker-head{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px}
    .lab-picker-head h2{margin:8px 0;font-size:clamp(25px,4vw,40px)}
    .lab-picker-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:12px}
    .lab-picker-card{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:9px;min-height:174px;padding:18px;border:1px solid var(--line,rgba(255,255,255,.14));border-radius:16px;background:rgba(255,255,255,.035);color:inherit;cursor:pointer;transition:transform .18s,border-color .18s,background .18s}
    .lab-picker-card:hover,.lab-picker-card:focus-visible{transform:translateY(-3px);border-color:var(--acid,#c8ff52);background:rgba(255,255,255,.07);outline:none}
    .lab-picker-icon{font-size:27px}.lab-picker-card strong{font-size:17px}.lab-picker-card small{color:var(--muted,#aaa);line-height:1.45}.lab-picker-arrow{margin-top:auto;color:var(--acid,#c8ff52);font-size:11px;letter-spacing:.08em;font-weight:700}
    .lab-back{margin:0 0 22px}.lab-section[hidden],.lab-picker[hidden]{display:none!important}
    @media(max-width:560px){.lab-picker-head{display:block}.lab-picker-head .recommend-stamp{display:inline-block;margin-top:8px}.lab-picker-card{min-height:145px}}
  `;
  document.head.appendChild(style);
  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'btn btn-outline lab-back';
  back.textContent = '← КО ВСЕМ ИГРАМ';
  back.addEventListener('click', showMenu);
  function showMenu() {
    sections.forEach(section => { section.hidden = true; });
    picker.hidden = false;
    if (nav) nav.hidden = true;
    picker.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function openSection(id) {
    const target = sections.find(section => section.id === id);
    if (!target) return;
    sections.forEach(section => { section.hidden = section !== target; });
    picker.hidden = true;
    if (nav) nav.hidden = true;
    if (!back.isConnected) target.insertBefore(back,target.firstChild);
    target.scrollIntoView({behavior:'smooth',block:'start'});
  }
  picker.addEventListener('click', event => {
    const button = event.target.closest('[data-lab-open]');
    if (button) openSection(button.dataset.labOpen);
  });
  sections.forEach(section => { section.hidden = true; });
  picker.hidden = false;
})();