/* =========================================================
   NUESTRO CAFÉ RACING
   Service Worker - PWA
   ========================================================= */

const CACHE_NAME = "nuestro-cafe-racing-v1.0.0";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",

    /* CSS */
    "./css/style.css",
    "./css/responsive.css",

    /* JavaScript */
    "./js/app.js",

    /* Offline */
    "./offline.html",

    /* Iconos */
    "./img/icon-192.png",
    "./img/icon-512.png",
    "./img/icon-512-maskable.png"
];


/* =========================================================
   INSTALACIÓN
   ========================================================= */

self.addEventListener("install", event => {

    console.log(
        "[Nuestro Café Racing] Instalando Service Worker..."
    );

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log(
                    "[Nuestro Café Racing] Guardando archivos..."
                );

                return cache.addAll(APP_FILES);

            })
            .then(() => {

                /*
                 * Permite que la nueva versión
                 * pueda activarse inmediatamente.
                 */

                return self.skipWaiting();

            })
            .catch(error => {

                console.error(
                    "[Nuestro Café Racing] Error durante la instalación:",
                    error
                );

            })

    );

});


/* =========================================================
   ACTIVACIÓN
   ========================================================= */

self.addEventListener("activate", event => {

    console.log(
        "[Nuestro Café Racing] Service Worker activado."
    );

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        /*
                         * Elimina versiones antiguas
                         * de nuestra aplicación.
                         */

                        if (
                            cacheName.startsWith(
                                "nuestro-cafe-racing-"
                            ) &&
                            cacheName !== CACHE_NAME
                        ) {

                            console.log(
                                "[Nuestro Café Racing] Eliminando caché antigua:",
                                cacheName
                            );

                            return caches.delete(
                                cacheName
                            );

                        }

                        return Promise.resolve(false);

                    })

                );

            })
            .then(() => {

                /*
                 * Hace que el Service Worker tome
                 * control de las páginas abiertas.
                 */

                return self.clients.claim();

            })

    );

});


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener("fetch", event => {

    const request = event.request;

    /*
     * Solo trabajamos con peticiones GET.
     */

    if (request.method !== "GET") {
        return;
    }


    /*
     * Navegación a una página.
     *
     * Primero intenta caché.
     * Si no existe, intenta red.
     * Si no hay red, muestra offline.html.
     */

    if (request.mode === "navigate") {

        event.respondWith(

            caches.match(request)
                .then(cachedResponse => {

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(request)
                        .then(networkResponse => {

                            /*
                             * Guardamos una copia de la página.
                             */

                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        request,
                                        responseClone
                                    );

                                });

                            return networkResponse;

                        })
                        .catch(() => {

                            return caches.match(
                                "./offline.html"
                            );

                        });

                })

        );

        return;
    }


    /*
     * Recursos como:
     * CSS
     * JS
     * imágenes
     * manifest
     * fuentes
     * etc.
     *
     * Estrategia:
     * CACHE FIRST
     */

    event.respondWith(

        caches.match(request)
            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)
                    .then(networkResponse => {

                        /*
                         * Si la respuesta es válida,
                         * guardamos una copia.
                         */

                        if (
                            networkResponse &&
                            networkResponse.status === 200
                        ) {

                            const responseClone =
                                networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then(cache => {

                                    cache.put(
                                        request,
                                        responseClone
                                    );

                                });

                        }

                        return networkResponse;

                    })
                    .catch(() => {

                        /*
                         * Si es una imagen que no pudo
                         * cargarse, simplemente dejamos
                         * que el navegador maneje el error.
                         */

                        if (
                            request.destination === "image"
                        ) {

                            return new Response(
                                "",
                                {
                                    status: 404,
                                    statusText:
                                        "Imagen no disponible"
                                }
                            );

                        }

                        /*
                         * Para otros recursos no hay
                         * una respuesta disponible.
                         */

                        return new Response(
                            "",
                            {
                                status: 503,
                                statusText:
                                    "Recurso no disponible sin conexión"
                            }
                        );

                    });

            })

    );

});


/* =========================================================
   MENSAJES DESDE LA APLICACIÓN
   ========================================================= */

self.addEventListener("message", event => {

    if (!event.data) {
        return;
    }


    /*
     * Permite solicitar actualización inmediata.
     */

    if (
        event.data.action ===
        "SKIP_WAITING"
    ) {

        self.skipWaiting();

    }


    /*
     * Permite limpiar completamente
     * la caché de la aplicación.
     */

    if (
        event.data.action ===
        "CLEAR_CACHE"
    ) {

        event.waitUntil(

            caches.keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames
                            .filter(cacheName =>
                                cacheName.startsWith(
                                    "nuestro-cafe-racing-"
                                )
                            )
                            .map(cacheName =>
                                caches.delete(
                                    cacheName
                                )
                            )

                    );

                })

        );

    }

});