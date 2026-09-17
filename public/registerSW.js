// Self-cleaning script to ensure no stale service worker intercepts traffic
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (var i = 0; i < registrations.length; i++) {
      registrations[i].unregister();
    }
  }).catch(function() {});
}
if ('caches' in window) {
  caches.keys().then(function(names) {
    for (var i = 0; i < names.length; i++) {
      caches.delete(names[i]);
    }
  }).catch(function() {});
}
