(() => {
  const modal = document.getElementById('recipe-modal');
  if (!modal) return;
  const panel = modal.querySelector('.modal-panel');
  const columns = modal.querySelector('.modal-columns');
  if (!panel || !columns) return;

  const section = document.createElement('section');
  section.className = 'recipe-extras';
  section.style.cssText = 'margin:24px 0 8px;padding:18px;border:1px solid var(--line,rgba(255,255,255,.14));border-radius:16px;background:rgba(255,255,255,.025)';
  section.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:22px">
      <div>
        <h3 style="margin:0 0 10px">⏱ Таймер готовки</h3>
        <p class="small-note" style="margin:0 0 10px">Поставь время по рецепту. Таймер работает, пока страница открыта.</p>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
          <input id="cook-timer-minutes" type="number" min="1" max="240" value="10" aria-label="Минуты" style="width:76px;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface,#171916);color:inherit">
          <strong id="cook-timer-display" aria-live="polite" style="font-variant-numeric:tabular-nums;font-size:1.25rem">10:00</strong>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button type="button" class="btn btn-acid" id="cook-timer-start">Старт</button>
          <button type="button" class="btn btn-outline" id="cook-timer-reset">Сброс</button>
        </div>
        <p id="cook-timer-status" class="small-note" aria-live="polite"></p>
      </div>
      <div>
        <h3 style="margin:0 0 10px">★ Оценка и отзыв</h3>
        <p class="small-note" style="margin:0 0 10px">Оценки сохраняются только в этом браузере и не видны другим посетителям.</p>
        <label for="recipe-review-rating" class="small-note">Твоя оценка</label>
        <select id="recipe-review-rating" style="display:block;margin:5px 0 10px;padding:9px;border-radius:10px;background:var(--surface,#171916);color:inherit;border:1px solid var(--line)">
          <option value="5">5 из 5</option><option value="4">4 из 5</option><option value="3">3 из 5</option><option value="2">2 из 5</option><option value="1">1 из 5</option>
        </select>
        <textarea id="recipe-review-text" maxlength="500" rows="3" placeholder="Что получилось? Что изменил(а)?" style="box-sizing:border-box;width:100%;padding:10px;border-radius:10px;background:var(--surface,#171916);color:inherit;border:1px solid var(--line)"></textarea>
        <button type="button" class="btn btn-outline" id="recipe-review-save" style="margin-top:8px">Сохранить отзыв</button>
        <div id="recipe-review-summary" class="small-note" aria-live="polite" style="margin-top:10px"></div>
      </div>
    </div>`;
  columns.insertAdjacentElement('afterend', section);

  const $ = id => document.getElementById(id);
  const storeKey = 'tarelka_recipe_reviews_local_v1';
  let recipeKey = '';
  let remaining = 600;
  let deadline = 0;
  let ticker = null;
  let running = false;

  function reviews() {
    try { return JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch { return {}; }
  }
  function renderReview() {
    const list = reviews()[recipeKey] || [];
    const summary = $('recipe-review-summary');
    if (!list.length) { summary.textContent = 'Пока нет отзывов в этом браузере.'; return; }
    const avg = list.reduce((sum, item) => sum + item.rating, 0) / list.length;
    summary.textContent = 'Твоя оценка: ' + avg.toFixed(1) + '/5 · отзывов: ' + list.length + (list[0].text ? ' · Последний: ' + list[0].text : '');
  }
  function stopTimer() { if (ticker) clearInterval(ticker); ticker = null; running = false; }
  function showTimer() {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    $('cook-timer-display').textContent = String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
  }
  function resetTimer() {
    stopTimer();
    const value = Math.max(1, Math.min(240, Number($('cook-timer-minutes').value) || 10));
    $('cook-timer-minutes').value = value;
    remaining = value * 60;
    $('cook-timer-status').textContent = '';
    $('cook-timer-start').textContent = 'Старт';
    showTimer();
  }
  function tick() {
    remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    showTimer();
    if (remaining <= 0) {
      stopTimer();
      $('cook-timer-status').textContent = 'Время вышло!';
      $('cook-timer-start').textContent = 'Старт';
      if ('Notification' in window && Notification.permission === 'granted') new Notification('Тарелка: таймер готовки', { body: 'Время вышло.' });
    }
  }
  $('cook-timer-start').addEventListener('click', () => {
    if (running) {
      remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      stopTimer();
      $('cook-timer-start').textContent = 'Продолжить';
      showTimer();
      return;
    }
    if (remaining <= 0) resetTimer();
    deadline = Date.now() + remaining * 1000;
    running = true;
    $('cook-timer-start').textContent = 'Пауза';
    $('cook-timer-status').textContent = '';
    ticker = setInterval(tick, 250);
  });
  $('cook-timer-reset').addEventListener('click', resetTimer);
  $('cook-timer-minutes').addEventListener('change', resetTimer);
  $('recipe-review-save').addEventListener('click', () => {
    if (!recipeKey) return;
    const all = reviews();
    const list = all[recipeKey] || [];
    const entry = { rating: Number($('recipe-review-rating').value), text: $('recipe-review-text').value.trim().slice(0, 500), date: new Date().toISOString() };
    all[recipeKey] = [entry, ...list].slice(0, 20);
    try { localStorage.setItem(storeKey, JSON.stringify(all)); $('recipe-review-text').value = ''; renderReview(); }
    catch { $('recipe-review-summary').textContent = 'Не удалось сохранить отзыв. Проверь настройки хранилища браузера.'; }
  });

  let wasOpen = false;
  const observer = new MutationObserver(() => {
    const isOpen = modal.classList.contains('open');
    if (isOpen && !wasOpen) {
      recipeKey = (modal.querySelector('#modal-title')?.textContent || 'Рецепт').trim();
      resetTimer();
      renderReview();
    }
    if (!isOpen && wasOpen) stopTimer();
    wasOpen = isOpen;
  });
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
})();