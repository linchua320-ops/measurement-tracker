// 這個 App 的離線快取機制先前造成裝置抓不到最新版本，
// 現在讓它自我解除安裝、清空所有舊快取，之後不再攔截任何請求。
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const clientsList = await self.clients.matchAll({ type: 'window' });
    clientsList.forEach(client => client.navigate(client.url));
  })());
});
