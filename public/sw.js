/* sw.js — Kill-switch.
   Limpia y desregistra cualquier service worker viejo que haya quedado en este
   dominio (por ejemplo, el del anotador de truco que se subió por error) y recarga
   la página para que el visitante vea el sitio real de DS. No hace falta que haga nada. */

self.addEventListener('install', () => {
  // Activarse enseguida, sin esperar.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // 1) Borrar todas las cachés que dejó el service worker anterior.
      try {
        const keys = await caches.keys()
        await Promise.all(keys.map((key) => caches.delete(key)))
      } catch {
        // Si falla el borrado, igual seguimos con el desregistro.
      }

      // 2) Desregistrarse a sí mismo: este dominio deja de tener service worker.
      try {
        await self.registration.unregister()
      } catch {
        // No pasa nada si no se puede desregistrar.
      }

      // 3) Recargar las pestañas abiertas para que tomen la página real (ya sin SW).
      try {
        const clients = await self.clients.matchAll({ type: 'window' })
        for (const client of clients) {
          client.navigate(client.url)
        }
      } catch {
        // En navegadores viejos puede no estar disponible; no es crítico.
      }
    })(),
  )
})
