(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const grid = $('#recipe-grid');
  const search = $('#recipe-search');
  const form = $('#recipe-search-form');
  const clear = $('#recipe-search-clear');
  if (!grid) return;

  const normalize = value => String(value || '').toLocaleLowerCase('ru').replace(/ё/g, 'е').trim();
  let activeFilter = $('.filter-chip.selected')?.dataset.filter || 'all';

  let empty = $('#recipe-empty-state');
  if (!empty) {
    empty = document.createElement('p');
    empty.id = 'recipe-empty-state';
    empty.className = 'small-note';
    empty.hidden = true;
    empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:32px 12px;font-size:14px';
    empty.textContent = 'Ничего не найдено. Попробуй другое название или ингредиент.';
    grid.insertAdjacentElement('afterend', empty);
  }

  function applyFilters() {
    const query = normalize(search?.value);
    const cards = $$('.recipe-card', grid);
    let visible = 0;
    cards.forEach(card => {
      const categoryMatch = activeFilter === 'all' ||
        (activeFilter === 'favorites'
          ? (() => { try { return (JSON.parse(localStorage.getItem('tarelka_favorites_v1') || '[]')).includes(card.querySelector('[data-recipe]')?.dataset.recipe); } catch { return false; } })()
          : (card.dataset.category || '').split(/\s+/).includes(activeFilter));
      const textMatch = !query || normalize((card.dataset.name || '') + ' ' + card.textContent).includes(query);
      card.hidden = !(categoryMatch && textMatch);
      if (!card.hidden) visible++;
    });
    empty.hidden = visible !== 0;
  }

  $$('.filter-chip[data-filter]').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      activeFilter = button.dataset.filter || 'all';
      $$('.filter-chip[data-filter]').forEach(item => item.classList.toggle('selected', item === button));
      applyFilters();
    });
  });

  search?.addEventListener('input', applyFilters);
  form?.addEventListener('submit', event => {
    event.preventDefault();
    applyFilters();
    search?.blur();
  });
  clear?.addEventListener('click', () => {
    if (!search) return;
    search.value = '';
    applyFilters();
    search.focus();
  });

  window.addEventListener('storage', event => {
    if (event.key === 'tarelka_favorites_v1') applyFilters();
  });

  applyFilters();
})();
