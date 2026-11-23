
const CACHE = 'tarelka-ui-v48';

const ASSETS = [
  './',
  './index.html',
  './student.html',
  './profile.html',
  './timetable.html',
  './guide.html',
  './recipes.html',
  './planner.html',
  './quiz.html',
  './basket.html',
  './lab.html',
  './style.css',
  './app.js',
  './student.js',
  './student-schedule.js',
  './student.css',
  './lab-menu.js',
  './analytics.js',
  './recipes.js',
  './recipe-extras.js',
  './auth.js',
  './supabase-config.js',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache =>
            cache.put(event.request, copy)
          );
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
