/* =========================================================
   NUESTRO CAFÉ RACING
   Aplicación web progresiva - app.js
   Para Ángel Gabriel ❤️
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTOS GENERALES
       ===================================================== */

    const body = document.body;
    const header = document.querySelector(".header");
    const loader = document.getElementById("loader");
    const toast = document.getElementById("toast");


    /* =====================================================
       TOAST / NOTIFICACIONES
       ===================================================== */

    function showToast(message, duration = 3500) {

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(window.toastTimeout);

        window.toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    }


    /* =====================================================
       LOADER
       ===================================================== */

    function hideLoader() {

        if (!loader) return;

        setTimeout(() => {
            loader.classList.add("hidden");

            setTimeout(() => {
                loader.style.display = "none";
            }, 700);

        }, 700);
    }

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, { once: true });
    }


    /* =====================================================
       MENÚ MÓVIL
       ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");

    function closeMenu() {

        if (!menuToggle || !nav) return;

        nav.classList.remove("active");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");

        body.classList.remove("menu-open");
    }

    function openMenu() {

        if (!menuToggle || !nav) return;

        nav.classList.add("active");
        menuToggle.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");

        body.classList.add("menu-open");
    }

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = nav.classList.contains("active");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }

        });

        const navLinks = nav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {
                closeMenu();
            });

        });

        document.addEventListener("click", event => {

            if (
                nav.classList.contains("active") &&
                !nav.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }

        });

        document.addEventListener("keydown", event => {

            if (event.key === "Escape") {
                closeMenu();
            }

        });

    }


    /* =====================================================
       HEADER AL HACER SCROLL
       ===================================================== */

    function updateHeader() {

        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    updateHeader();

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });


    /* =====================================================
       SCROLL SUAVE
       ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight
                : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

        });

    });


    /* =====================================================
       BOTÓN DE CAFÉ
       ===================================================== */

    const coffeeButton = document.getElementById("coffeeButton");
    const coffeeMessage = document.getElementById("coffeeMessage");

    if (coffeeButton && coffeeMessage) {

        coffeeButton.addEventListener("click", () => {

            const isVisible =
                coffeeMessage.classList.contains("show");

            if (isVisible) {

                coffeeMessage.classList.remove("show");

                coffeeButton.innerHTML =
                    '<i class="fa-solid fa-heart"></i> Hay algo más...';

            } else {

                coffeeMessage.classList.add("show");

                coffeeButton.innerHTML =
                    '<i class="fa-solid fa-mug-hot"></i> Mi café favorito eres tú ☕❤️';

                showToast(
                    "Porque cualquier café sabe mejor contigo ❤️"
                );

            }

        });

    }


    /* =====================================================
       SECCIÓN DE MOTOS / RACING
       ===================================================== */

    const motorcycle = document.querySelector(".motorcycle");
    const racingMessage = document.querySelector(".racing-message");

    if (motorcycle && racingMessage) {

        motorcycle.addEventListener("click", () => {

            racingMessage.classList.toggle("show");

            if (racingMessage.classList.contains("show")) {

                showToast(
                    "Hasta las curvas son bonitas cuando las recorremos juntos 🏍️❤️"
                );

            }

        });

    }


    /* =====================================================
       REPRODUCTOR DE MÚSICA
       ===================================================== */

    const audioPlayer = document.getElementById("audioPlayer");
    const playButton = document.getElementById("playButton");
    const playIcon = document.getElementById("playIcon");
    const musicBars = document.getElementById("musicBars");
    const musicCard = document.querySelector(".music-card");

    const progressFill =
        document.getElementById("progressFill");

    const progressTrack =
        document.querySelector(".progress-track");

    const currentTimeElement =
        document.querySelector(".progress-current");

    const durationElement =
        document.querySelector(".progress-duration");


    let audioAvailable = false;


    /* -----------------------------------------------------
       Formatear tiempo
       ----------------------------------------------------- */

    function formatTime(seconds) {

        if (!Number.isFinite(seconds)) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60)
                .toString()
                .padStart(2, "0");

        return `${minutes}:${remainingSeconds}`;
    }


    /* -----------------------------------------------------
       Actualizar interfaz del reproductor
       ----------------------------------------------------- */

    function updatePlayInterface(isPlaying) {

        if (playIcon) {

            playIcon.className = isPlaying
                ? "fa-solid fa-pause"
                : "fa-solid fa-play";

        }

        if (musicBars) {

            musicBars.classList.toggle(
                "playing",
                isPlaying
            );

        }

        if (musicCard) {

            musicCard.classList.toggle(
                "playing",
                isPlaying
            );

        }

    }


    /* -----------------------------------------------------
       Comprobar audio
       ----------------------------------------------------- */

    if (audioPlayer) {

        audioPlayer.addEventListener("loadedmetadata", () => {

            audioAvailable = true;

            if (durationElement) {

                durationElement.textContent =
                    formatTime(audioPlayer.duration);

            }

        });

        audioPlayer.addEventListener("timeupdate", () => {

            if (!audioPlayer.duration) {
                return;
            }

            const percentage =
                (audioPlayer.currentTime /
                    audioPlayer.duration) * 100;

            if (progressFill) {
                progressFill.style.width =
                    `${percentage}%`;
            }

            if (currentTimeElement) {

                currentTimeElement.textContent =
                    formatTime(audioPlayer.currentTime);

            }

        });

        audioPlayer.addEventListener("play", () => {

            updatePlayInterface(true);

        });

        audioPlayer.addEventListener("pause", () => {

            updatePlayInterface(false);

        });

        audioPlayer.addEventListener("ended", () => {

            updatePlayInterface(false);

            if (progressFill) {
                progressFill.style.width = "0%";
            }

            if (currentTimeElement) {
                currentTimeElement.textContent = "0:00";
            }

        });

        audioPlayer.addEventListener("error", () => {

            audioAvailable = false;

            console.warn(
                "No se encontró el archivo de música. " +
                "Coloca beginning-middle-end.mp3 dentro de la carpeta music."
            );

        });

    }


    /* -----------------------------------------------------
       Play / Pause
       ----------------------------------------------------- */

    if (playButton && audioPlayer) {

        playButton.addEventListener("click", async () => {

            if (!audioAvailable &&
                audioPlayer.readyState === 0) {

                showToast(
                    "Agrega beginning-middle-end.mp3 dentro de la carpeta music 🎵"
                );

                return;
            }

            try {

                if (audioPlayer.paused) {

                    await audioPlayer.play();

                } else {

                    audioPlayer.pause();

                }

            } catch (error) {

                console.error(
                    "No se pudo reproducir la música:",
                    error
                );

                showToast(
                    "No fue posible reproducir la canción todavía 🎵"
                );

            }

        });

    }


    /* -----------------------------------------------------
       Barra de progreso
       ----------------------------------------------------- */

    if (progressTrack && audioPlayer) {

        progressTrack.addEventListener("click", event => {

            if (!audioPlayer.duration) {
                return;
            }

            const rect =
                progressTrack.getBoundingClientRect();

            const clickPosition =
                event.clientX - rect.left;

            const percentage =
                Math.max(
                    0,
                    Math.min(
                        1,
                        clickPosition / rect.width
                    )
                );

            audioPlayer.currentTime =
                percentage * audioPlayer.duration;

        });

    }


    /* =====================================================
       REGALO
       ===================================================== */

    const giftButton = document.getElementById("giftButton");
    const giftBox = document.getElementById("giftBox");
    const giftMessage = document.getElementById("giftMessage");


    function openGift() {

        if (giftBox) {
            giftBox.classList.add("open");
        }

        if (giftMessage) {
            giftMessage.classList.add("show");
        }

        if (giftButton) {

            giftButton.innerHTML =
                '<i class="fa-solid fa-heart"></i> Te amo, Ángel ❤️';

        }

        showToast(
            "Este regalo no cabe en una caja... porque eres tú ❤️"
        );

    }


    if (giftButton) {

        giftButton.addEventListener("click", () => {

            if (
                giftMessage &&
                giftMessage.classList.contains("show")
            ) {

                giftMessage.classList.remove("show");

                if (giftBox) {
                    giftBox.classList.remove("open");
                }

                giftButton.innerHTML =
                    '<i class="fa-solid fa-gift"></i> Abrir mi regalo';

            } else {

                openGift();

            }

        });

    }


    if (giftBox) {

        giftBox.addEventListener("click", () => {

            if (
                !giftMessage ||
                !giftMessage.classList.contains("show")
            ) {
                openGift();
            }

        });

    }


    /* =====================================================
       PWA - SERVICE WORKER
       ===================================================== */

    async function registerServiceWorker() {

        if (!("serviceWorker" in navigator)) {

            console.warn(
                "Este navegador no soporta Service Workers."
            );

            return;

        }

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "./sw.js",
                    {
                        scope: "./"
                    }
                );

            console.log(
                "Service Worker registrado correctamente:",
                registration.scope
            );

        } catch (error) {

            console.error(
                "Error al registrar el Service Worker:",
                error
            );

        }

    }

    registerServiceWorker();


    /* =====================================================
       PWA - INSTALACIÓN
       ===================================================== */

    const installButton =
        document.getElementById("installButton");

    const installHelp =
        document.getElementById("installHelp");

    let deferredPrompt = null;


    /* -----------------------------------------------------
       Detectar si ya está instalada
       ----------------------------------------------------- */

    function isAppInstalled() {

        const standalone =
            window.matchMedia &&
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches;

        const iosStandalone =
            window.navigator.standalone === true;

        return standalone || iosStandalone;
    }


    /* -----------------------------------------------------
       Detectar iPhone / iPad
       ----------------------------------------------------- */

    function isIOS() {

        return /iphone|ipad|ipod/i.test(
            navigator.userAgent
        );

    }


    /* -----------------------------------------------------
       Estado inicial de instalación
       ----------------------------------------------------- */

    if (isAppInstalled()) {

        if (installButton) {
            installButton.style.display = "none";
        }

        if (installHelp) {

            installHelp.textContent =
                "La aplicación ya está instalada en este dispositivo ❤️";

        }

    } else if (isIOS()) {

        if (installHelp) {

            installHelp.textContent =
                "En iPhone o iPad: toca Compartir y después selecciona “Añadir a pantalla de inicio”. ❤️";

        }

    }


    /* -----------------------------------------------------
       beforeinstallprompt
       ----------------------------------------------------- */

    window.addEventListener(
        "beforeinstallprompt",
        event => {

            event.preventDefault();

            deferredPrompt = event;

            console.log(
                "La PWA puede instalarse desde el botón personalizado."
            );

            if (installButton) {

                installButton.style.display = "inline-flex";

                installButton.innerHTML =
                    '<i class="fa-solid fa-download"></i> Instalar aplicación';

            }

            if (installHelp) {

                installHelp.textContent =
                    "Instala Nuestro Café Racing en tu celular para tenerlo siempre contigo. ❤️";

            }

        }
    );


    /* -----------------------------------------------------
       Botón instalar
       ----------------------------------------------------- */

    if (installButton) {

        installButton.addEventListener("click", async () => {

            /* ---------------------------------------------
               Si el navegador nos entregó el prompt
               --------------------------------------------- */

            if (deferredPrompt) {

                try {

                    deferredPrompt.prompt();

                    const result =
                        await deferredPrompt.userChoice;

                    console.log(
                        "Resultado de instalación:",
                        result.outcome
                    );

                    if (result.outcome === "accepted") {

                        showToast(
                            "¡Nuestro Café Racing ya está contigo! ❤️"
                        );

                    } else {

                        showToast(
                            "Puedes instalarlo cuando quieras desde este botón. ❤️"
                        );

                    }

                } catch (error) {

                    console.error(
                        "Error durante la instalación:",
                        error
                    );

                }

                deferredPrompt = null;

                return;
            }


            /* ---------------------------------------------
               iOS
               --------------------------------------------- */

            if (isIOS()) {

                showToast(
                    "En iPhone: Compartir → Añadir a pantalla de inicio ❤️",
                    5000
                );

                return;
            }


            /* ---------------------------------------------
               Si todavía no existe un prompt
               --------------------------------------------- */

            showToast(
                "Si el navegador ofrece la opción “Instalar aplicación”, selecciónala desde su menú. ❤️",
                5000
            );

        });

    }


    /* -----------------------------------------------------
       Aplicación instalada
       ----------------------------------------------------- */

    window.addEventListener(
        "appinstalled",
        () => {

            console.log(
                "Nuestro Café Racing fue instalado."
            );

            deferredPrompt = null;

            if (installButton) {
                installButton.style.display = "none";
            }

            if (installHelp) {

                installHelp.textContent =
                    "¡Listo! Nuestro Café Racing ya forma parte de tus aplicaciones. ❤️";

            }

            showToast(
                "¡Aplicación instalada! ❤️☕🏍️"
            );

        }
    );


    /* =====================================================
       ANIMACIONES AL HACER SCROLL
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".story-card, " +
        ".coffee-left, " +
        ".coffee-right, " +
        ".racing-text, " +
        ".motorcycle-display, " +
        ".music-card, " +
        ".gift-content, " +
        ".install-card, " +
        ".final-content"
    );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "reveal",
                                "visible"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(element => {

            element.classList.add("reveal");

            revealObserver.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add(
                "reveal",
                "visible"
            );

        });

    }


    /* =====================================================
       CORAZONES FLOTANTES
       ===================================================== */

    const loveButton =
        document.getElementById("loveButton");


    function createHeart() {

        const heart =
            document.createElement("span");

        heart.className = "floating-heart";

        heart.innerHTML = "♥";

        heart.style.left =
            `${Math.random() * 100}%`;

        heart.style.animationDuration =
            `${4 + Math.random() * 3}s`;

        heart.style.fontSize =
            `${14 + Math.random() * 16}px`;

        heart.style.opacity =
            `${0.45 + Math.random() * 0.45}`;

        document.body.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 7500);

    }


    if (loveButton) {

        loveButton.addEventListener("click", () => {

            /* Crear varios corazones */

            for (let i = 0; i < 15; i++) {

                setTimeout(() => {
                    createHeart();
                }, i * 100);

            }

            showToast(
                "Te elegiría una y otra vez, Ángel. ❤️"
            );

        });

    }


    /* =====================================================
       ACCESIBILIDAD
       ===================================================== */

    if (menuToggle) {

        if (!menuToggle.hasAttribute("aria-expanded")) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        }

        if (!menuToggle.hasAttribute("aria-label")) {

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menú"
            );

        }

    }


    /* =====================================================
       PREVENIR ERRORES POR BOTONES SIN DESTINO
       ===================================================== */

    document.querySelectorAll(
        "button"
    ).forEach(button => {

        button.addEventListener("keydown", event => {

            if (event.key === "Enter") {

                button.click();

            }

        });

    });


    /* =====================================================
       MENSAJE DE CONSOLA
       ===================================================== */

    console.log(
        "%c☕ Nuestro Café Racing ❤️",
        "font-size: 20px; font-weight: bold;"
    );

    console.log(
        "%cUna pequeña historia para Ángel Gabriel Ruíz.",
        "font-size: 14px;"
    );

});