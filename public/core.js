/**
 * CORE.JS — La Última Tarde
 * Cerebro central del sistema. Firebase Realtime DB listener.
 * Carga Firebase de forma SERIAL (no paralela) para evitar race conditions.
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAN9mrvYU4IEcXN7bk4AF2bmTYJjprPwos",
  authDomain: "graduacion2026-a2d40.firebaseapp.com",
  databaseURL: "https://graduacion2026-a2d40-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "graduacion2026-a2d40",
  storageBucket: "graduacion2026-a2d40.firebasestorage.app",
  messagingSenderId: "374426090547",
  appId: "1:374426090547:web:96db94e7f43fb886a87746"
};

const Core = (() => {
  let _db = null;
  let _lastTs = 0;
  let _handlers = {};
  let _onlineCallbacks = [];
  let _offlineCallbacks = [];
  let _initialized = false;

  function _emit(type, data) {
    if (_handlers[type]) _handlers[type].forEach(fn => { try { fn(data); } catch(e){ console.error('[Core] handler error', e); } });
    if (_handlers['*']) _handlers['*'].forEach(fn => { try { fn({ type, ...data }); } catch(e){} });
  }

  function _parseCmd(snap) {
    if (!snap || !snap.val) return;
    const cmd = snap.val();
    if (!cmd || !cmd.type) return;
    const ts = cmd.ts || 0;
    if (ts <= _lastTs) return;
    _lastTs = ts;
    console.log('[Core] cmd:', cmd.type, cmd);
    _emit(cmd.type, cmd);
  }

  // Carga scripts de forma SERIAL: primero app, luego database
  function _loadScript(src) {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolver inmediatamente
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(); return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error('Failed to load: ' + src));
      document.head.appendChild(s);
    });
  }

  function init() {
    if (_initialized) return;
    _initialized = true;

    console.log('[Core] Iniciando...');

    // Carga SERIAL: primero firebase-app, luego firebase-database
    _loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js')
      .then(() => _loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-database-compat.js'))
      .then(() => _initFirebase())
      .catch(err => {
        console.error('[Core] Firebase SDK load failed:', err);
        _offlineCallbacks.forEach(fn => fn());
      });
  }

  function _initFirebase() {
    try {
      console.log('[Core] Firebase SDK cargado. Inicializando app...');
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      _db = firebase.database();

      // Estado de conexión
      _db.ref('.info/connected').on('value', snap => {
        console.log('[Core] connected:', snap.val());
        if (snap.val() === true) {
          _onlineCallbacks.forEach(fn => fn());
        } else {
          _offlineCallbacks.forEach(fn => fn());
        }
      });

      // Escuchar hub/cmd
      _db.ref('hub/cmd').on('value', _parseCmd);

      console.log('[Core] Firebase activo ✓');

    } catch (e) {
      console.error('[Core] Firebase init error:', e);
      _offlineCallbacks.forEach(fn => fn());
    }
  }

  function on(type, fn) {
    if (!_handlers[type]) _handlers[type] = [];
    _handlers[type].push(fn);
  }

  function onOnline(fn) { _onlineCallbacks.push(fn); }
  function onOffline(fn) { _offlineCallbacks.push(fn); }

  function sendCmd(cmd) {
    if (!_db) { console.warn('[Core] DB not ready'); return Promise.reject('DB not ready'); }
    const ts = Date.now();
    const full = { ...cmd, ts };
    console.log('[Core] sendCmd:', full);
    return _db.ref('hub/cmd').set(full);
  }

  return {
    init,
    on,
    onOnline,
    onOffline,
    sendCmd,
    get db() { return _db; }
  };
})();

window.Core = Core;
