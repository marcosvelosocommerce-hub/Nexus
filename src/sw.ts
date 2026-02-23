/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// 1. Isso aqui é a injeção mágica do Vite para o app funcionar offline
precacheAndRoute(self.__WB_MANIFEST);

// 2. O nosso ouvinte de Notificações Push (O Carteiro)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};

  const title = data.title || 'Nexus';
  const options = {
    body: data.body || 'Você tem um novo lembrete!',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/dashboard' // Abre o dashboard se não tiver URL específica
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 3. O que acontece quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Fecha o balão da notificação
  
  // Abre o app na URL correta
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});