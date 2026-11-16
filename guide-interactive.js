(() => {
  const root = document.getElementById('plate-builder');
  if (!root) return;
  const groups = {
    plants: {
      title: 'Добавь цвета',
      description: 'Выбирай овощи и фрукты, которые тебе нравятся и доступны сейчас. Подойдут свежие, замороженные и консервированные варианты.',
      step: '01 / 03',
      products: [
        ['🥕','Морковь','Хрустит и подходит к салатам'],
        ['🍅','Томаты','Свежие или консервированные'],
        ['🥒','Огурец','Для сэндвичей и боулов'],
        ['🍎','Яблоко','Удобно взять с собой'],
        ['🥦','Брокколи','Свежая или замороженная'],
        ['🫑','Перец','Добавляет яркий вкус']
      ]
    },
    protein: {
      title: 'Выбери то, что нравится',
      description: 'Источники белка бывают разными. Можно выбирать растительные варианты или продукты животного происхождения.',
      step: '02 / 03',
      products: [
        ['🥚','Яйца','Для завтрака и сэндвичей'],
        ['🫘','Фасоль','Консервированная или сухая'],
        ['🧆','Нут','Для салатов и боулов'],
        ['🐟','Рыба','Свежая или консервированная'],
        ['🥛','Йогурт','Без добавок или по вкусу'],
        ['🧀','Творог','Для сладких и несладких блюд']
      ]
    },
    grains: {
      title: 'Добавь основу',
      description: 'Крупы, хлеб и другие зерновые продукты помогают собрать разные блюда. Выбирай удобный формат и то, что есть под рукой.',
      step: '03 / 03',
      products: [
        ['🍚','Рис','Подходит для боулов'],
        ['🌾','Гречка','Можно приготовить заранее'],
        ['🥣','Овсянка','Для завтрака или перекуса'],
        ['🍝','Макароны','Быстрая основа для блюда'],
        ['🍞','Хлеб','Для тостов и сэндвичей'],
        ['🌯','Лаваш','Для роллов и конвертиков']
      ]
    }
  };
  const selected = new Map();
  let active = 'plants';
  const grid = document.getElementById('plate-product-grid');
  const render = () => {
    const group = groups[active];
    document.getElementById('plate-group-title').textContent = group.title;
    document.getElementById('plate-group-description').textContent = group.description;
    document.getElementById('plate-step').textContent = group.step;
    document.querySelectorAll('.plate-sector').forEach((button) => {
      const on = button.dataset.foodGroup === active;
      button.classList.toggle('is-active', on);
      button.setAttribute('aria-pressed', String(on));
    });
    grid.innerHTML = '';
    group.products.forEach(([emoji, name, note]) => {
      const key = active + ':' + name;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'plate-product';
      button.setAttribute('aria-pressed', String(selected.has(key)));
      const icon = document.createElement('span');
      icon.className = 'product-emoji';
      icon.textContent = emoji;
      const title = document.createElement('strong');
      title.textContent = name;
      const caption = document.createElement('small');
      caption.textContent = note;
      button.append(icon, title, caption);
      button.addEventListener('click', () => {
        if (selected.has(key)) selected.delete(key);
        else selected.set(key, { emoji, name, group: active });
        render();
      });
      grid.append(button);
    });
    const count = selected.size;
    document.getElementById('plate-selected-count').textContent = count + (count === 1 ? ' продукт' : count > 1 && count < 5 ? ' продукта' : ' продуктов');
    const picked = document.getElementById('plate-picked');
    picked.hidden = count === 0;
    document.getElementById('plate-picked-list').textContent =
      [...selected.values()].map(item => item.emoji + ' ' + item.name).join(' · ');
    const idea = document.querySelector('#plate-idea p');
    if (count >= 2) {
      const names = [...selected.values()].map(item => item.name);
      idea.textContent = 'Можно попробовать сочетание: ' + names.join(' + ') + '. Например, собрать боул, салат или сэндвич — ориентируйся на свои вкусы и то, что есть дома.';
    } else if (count === 1) {
      idea.textContent = 'Хорошее начало! Выбери ещё один продукт из любого сектора, чтобы придумать сочетание.';
    } else {
      idea.textContent = 'Отметь несколько продуктов — соберём из них простую идею для блюда.';
    }
  };
  document.querySelectorAll('.plate-sector').forEach(button => {
    button.addEventListener('click', () => { active = button.dataset.foodGroup; render(); });
  });
  document.getElementById('plate-clear').addEventListener('click', () => { selected.clear(); render(); });
  render();
})();
