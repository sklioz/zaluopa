(() => {
  const byId = (id) => document.getElementById(id);
  const panel = byId('account-panel');
  if (!panel) return;
  const message = (text, isError = false) => {
    const el = byId('auth-message');
    if (el) { el.textContent = text; el.style.color = isError ? '#ff9b9b' : ''; }
  };
  const status = (text) => { const el = byId('auth-status'); if (el) el.textContent = text; };
  const configOk = window.TARELKA_SUPABASE_URL &&
    window.TARELKA_SUPABASE_PUBLISHABLE_KEY &&
    window.supabase && window.supabase.createClient;
  if (!configOk) {
    message('Не удалось загрузить библиотеку или настройки Supabase. Проверь подключение к интернету.', true);
    return;
  }
  const client = window.supabase.createClient(
    window.TARELKA_SUPABASE_URL,
    window.TARELKA_SUPABASE_PUBLISHABLE_KEY
  );
  const syncKeys = [
    'ebp_habits_v1', 'tarelka_menu_v3', 'ebp_shopping_v2',
    'ebp_quiz_v2', 'ebp_budget_v1', 'ebp_kitchen_v1',
    'food_you_basket_v1', 'tarelka_lab_achievements_v1',
    'tarelka_lab_progress_v1'
  ];
  const readLocalSnapshot = () => {
    const result = {};
    syncKeys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        if (value !== null) result[key] = JSON.parse(value);
      } catch (_) {}
    });
    return result;
  };
  const writeSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot !== 'object') return;
    syncKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(snapshot, key)) {
        try { localStorage.setItem(key, JSON.stringify(snapshot[key])); } catch (_) {}
      }
    });
  };
  let currentUser = null;
  let syncTimer = null;
  let lastSnapshot = '';
  async function syncToCloud() {
    if (!currentUser) return;
    const snapshot = readLocalSnapshot();
    const encoded = JSON.stringify(snapshot);
    if (encoded === lastSnapshot) return;
    const { error } = await client.from('user_settings').upsert({
      user_id: currentUser.id,
      preferences: snapshot,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });
    if (error) { message('Не удалось синхронизировать данные: ' + error.message, true); return; }
    lastSnapshot = encoded;
    message('Прогресс сохранён в облаке.');
  }
  async function loadFromCloud() {
    if (!currentUser) return;
    const { data, error } = await client.from('user_settings')
      .select('preferences').eq('user_id', currentUser.id).maybeSingle();
    if (error) { message('Не удалось загрузить данные: ' + error.message, true); return; }
    if (data && data.preferences && Object.keys(data.preferences).length) {
      writeSnapshot(data.preferences);
      lastSnapshot = JSON.stringify(readLocalSnapshot());
      message('Облачный прогресс загружен на это устройство.');
      window.location.reload();
    } else {
      await syncToCloud();
    }
  }
  function showUser(user) {
    currentUser = user || null;
    byId('auth-guest-actions').hidden = !!user;
    byId('auth-user').hidden = !user;
    if (user) {
      status('Выполнен вход');
      byId('account-intro').textContent = 'Аккаунт подключён. Твой игровой прогресс можно синхронизировать между устройствами.';
      byId('auth-user-label').textContent = 'Ты вошёл как ' + (user.email || 'пользователь') + '.';
      const dialog = byId('auth-dialog');
      if (dialog?.open) dialog.close();
    } else {
      status('Гость');
      byId('account-intro').textContent = 'Войди или создай аккаунт, чтобы сохранять игровой прогресс и открывать его на других устройствах.';
    }
  }
  const dialog = byId('auth-dialog');
  const setAuthMode = (mode) => {
    const signup = mode === 'signup';
    byId('signup-form').hidden = !signup;
    byId('signin-form').hidden = signup;
    byId('show-signup').classList.toggle('active', signup);
    byId('show-signin').classList.toggle('active', !signup);
    byId('auth-dialog-title').textContent = signup ? 'Создать аккаунт' : 'С возвращением';
    byId('auth-dialog-copy').textContent = signup
      ? 'Сохраняй прогресс и возвращайся к нему с любого устройства.'
      : 'Войди, чтобы продолжить с того места, где остановился.';
  };
  byId('open-signup')?.addEventListener('click', () => { setAuthMode('signup'); dialog?.showModal(); });
  byId('open-signin')?.addEventListener('click', () => { setAuthMode('signin'); dialog?.showModal(); });
  byId('show-signup')?.addEventListener('click', () => setAuthMode('signup'));
  byId('show-signin')?.addEventListener('click', () => setAuthMode('signin'));
  byId('close-auth')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  byId('signup-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = form.email.value.trim();
    const username = form.username.value.trim();
    const displayName = (form.displayName?.value || username).trim() || username;
    const avatar = form.avatar?.value || '🌿';
    const bio = (form.bio?.value || '').trim();
    const password = form.password.value;
    if (!/^[A-Za-z0-9_]{3,24}$/.test(username)) {
      message('Логин должен содержать 3–24 латинских буквы, цифры или подчёркивания.', true); return;
    }
    if (password.length < 8) { message('Пароль должен содержать минимум 8 символов.', true); return; }
    message('Создаём аккаунт…');
    const { data, error } = await client.auth.signUp({
      email, password, options: { data: { username, display_name: displayName, avatar, bio } }
    });
    if (error) { message(error.message, true); return; }
    if (data.user) {
      const { error: profileError } = await client.from('profiles').upsert({
        id: data.user.id, username, display_name: displayName
      }, { onConflict: 'id' });
      if (profileError) message('Аккаунт создан, но профиль не сохранился: ' + profileError.message, true);
      else message(data.session ? 'Аккаунт создан. Ты вошёл.' : 'Аккаунт создан. Проверь почту и подтверди email, затем войди.');
    }
  });
  byId('signin-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    message('Входим…');
    const { error } = await client.auth.signInWithPassword({
      email: form.email.value.trim(), password: form.password.value
    });
    if (error) { message(error.message, true); return; }
    message('Вход выполнен. Загружаем твой прогресс…');
  });
  byId('signout-button')?.addEventListener('click', async () => {
    const { error } = await client.auth.signOut();
    if (error) message(error.message, true);
    else { showUser(null); message('Ты вышел из аккаунта.'); }
  });
  byId('sync-now')?.addEventListener('click', syncToCloud);
  client.auth.onAuthStateChange(async (_event, session) => {
    const user = session?.user || null;
    const changed = (currentUser?.id || null) !== (user?.id || null);
    showUser(user);
    if (user && changed) await loadFromCloud();
  });
  client.auth.getSession().then(({ data }) => {
    const user = data.session?.user || null;
    const changed = (currentUser?.id || null) !== (user?.id || null);
    showUser(user);
    if (user && changed) loadFromCloud();
  });
  window.addEventListener('focus', () => { if (currentUser) syncToCloud(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && currentUser) syncToCloud();
  });
  syncTimer = window.setInterval(() => { if (currentUser) syncToCloud(); }, 15000);
})();
