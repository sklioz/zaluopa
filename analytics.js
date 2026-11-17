(() => {
  const path = location.pathname.split('/').pop() || 'index.html';
  if (path === 'admin.html' || !window.supabase?.createClient) return;
  const KEY = 'tarelka_analytics_consent_v1';
  const VISITOR = 'tarelka_visitor_id_v1';
  const css = `.ta-consent{position:fixed;z-index:9999;left:18px;right:18px;bottom:18px;max-width:560px;margin:auto;padding:18px 20px;background:#20221c;color:#f7f5ed;border:1px solid #64744b;border-radius:18px;box-shadow:0 14px 44px #0005;font:14px/1.5 system-ui}.ta-consent p{margin:0 0 12px}.ta-consent small{color:#c5c9b8}.ta-consent-actions{display:flex;gap:10px;flex-wrap:wrap}.ta-consent button{border:0;border-radius:999px;padding:10px 15px;cursor:pointer;font:inherit}.ta-yes{background:#cafa45;color:#20221c}.ta-no{background:#393d32;color:#fff}`;
  if (!document.getElementById('ta-consent-style')) { const style=document.createElement('style');style.id='ta-consent-style';style.textContent=css;document.head.append(style); }
  const record = async () => {
    let visitorId;
    try {
      visitorId = localStorage.getItem(VISITOR);
      if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem(VISITOR, visitorId); }
    } catch (_) { return; }
    try {
      const client = window.supabase.createClient(window.TARELKA_SUPABASE_URL, window.TARELKA_SUPABASE_PUBLISHABLE_KEY);
      const { data } = await client.auth.getSession();
      await client.rpc('record_site_visit', { p_visitor_id: visitorId, p_page: '/' + path });
    } catch (_) {}
  };
  const choice = localStorage.getItem(KEY);
  if (choice === 'yes') { record(); return; }
  if (choice === 'no') return;
  const panel = document.createElement('section');
  panel.className = 'ta-consent';
  panel.setAttribute('aria-label','Настройки статистики');
  panel.innerHTML = '<p><strong>Помочь улучшить «Тарелку»?</strong><br><small>Можно разрешить анонимную статистику посещений: случайный идентификатор в этом браузере, посещённые страницы и факт входа в аккаунт. Мы не собираем имя, email, IP или содержимое профиля. Без согласия статистика не записывается.</small></p><div class="ta-consent-actions"><button class="ta-yes" type="button">Разрешить статистику</button><button class="ta-no" type="button">Не сейчас</button></div>';
  panel.querySelector('.ta-yes').addEventListener('click',()=>{localStorage.setItem(KEY,'yes');panel.remove();record();});
  panel.querySelector('.ta-no').addEventListener('click',()=>{localStorage.setItem(KEY,'no');panel.remove();});
  document.body.append(panel);
})();