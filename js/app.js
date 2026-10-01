/* =========================================================
   PORTAIL NUMÉRIQUE DE LA JEUNESSE DE MBAO
   JAVASCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       VARIABLES
    ===================================================== */

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");

    const reportModal = document.getElementById("reportModal");
    const openReportModal = document.getElementById("openReportModal");
    const closeReportModal = document.getElementById("closeReportModal");
    const modalOverlay = document.getElementById("modalOverlay");

    const reportForm = document.getElementById("reportForm");

    const toast = document.getElementById("toast");

    const currentYear = document.getElementById("currentYear");


    /* =====================================================
       ANNÉE AUTOMATIQUE
    ===================================================== */

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    if (menuToggle && navbar) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navbar.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

        });


        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                navbar.classList.remove("open");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }


    /* =====================================================
       HEADER AU SCROLL
    ===================================================== */

    function updateHeader() {

        if (window.scrollY > 30) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener("scroll", updateHeader);

    updateHeader();


    /* =====================================================
       LIENS NAVIGATION ACTIVE
    ===================================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav-link");


    function updateActiveNavigation() {

        let currentSection = "";

        sections.forEach(section => {

            const sectionTop = section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {

                currentSection = section.getAttribute("id");

            }

        });


        navigationLinks.forEach(link => {

            link.classList.remove("active");

            const href = link.getAttribute("href");

            if (href === `#${currentSection}`) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );


    /* =====================================================
       ANIMATION DES COMPTEURS
    ===================================================== */

    const counters = document.querySelectorAll(
        "[data-counter]"
    );


    let countersStarted = false;


    function startCounters() {

        if (countersStarted) {
            return;
        }


        const statsSection =
            document.querySelector(".stats-section");


        if (!statsSection) {
            return;
        }


        const rect =
            statsSection.getBoundingClientRect();


        if (rect.top < window.innerHeight * 0.85) {

            countersStarted = true;


            /*
             * Les valeurs sont volontairement provisoires.
             * Elles seront remplacées par les données réelles
             * lorsque le portail sera connecté à la base de données.
             */

            const values = [
                0,
                0,
                0,
                0
            ];


            counters.forEach((counter, index) => {

                const target = values[index];

                animateCounter(counter, target);

            });

        }

    }


    function animateCounter(element, target) {

        let current = 0;

        const duration = 1200;

        const startTime = performance.now();


        function update(currentTime) {

            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(elapsed / duration, 1);


            current =
                Math.floor(progress * target);


            element.textContent =
                current.toLocaleString("fr-FR");


            if (progress < 1) {

                requestAnimationFrame(update);

            } else {

                element.textContent =
                    target.toLocaleString("fr-FR");

            }

        }


        requestAnimationFrame(update);

    }


    window.addEventListener(
        "scroll",
        startCounters
    );


    startCounters();


    /* =====================================================
       MODAL SIGNALEMENT
    ===================================================== */

    function openModal() {

        if (!reportModal) {
            return;
        }

        reportModal.classList.add("active");

        document.body.style.overflow = "hidden";

    }


    function closeModal() {

        if (!reportModal) {
            return;
        }

        reportModal.classList.remove("active");

        document.body.style.overflow = "";

    }


    if (openReportModal) {

        openReportModal.addEventListener(
            "click",
            openModal
        );

    }


    if (closeReportModal) {

        closeReportModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (modalOverlay) {

        modalOverlay.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       ESC POUR FERMER LE MODAL
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                reportModal &&
                reportModal.classList.contains("active")
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       FORMULAIRE DE SIGNALEMENT
    ===================================================== */

    if (reportForm) {

        reportForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                /*
                 * Pour cette V1, les données ne sont pas
                 * encore envoyées vers une base de données.
                 *
                 * Cette étape sera remplacée plus tard par :
                 *
                 * POST /api/signalements
                 *
                 * avec Laravel + PostgreSQL.
                 */


                const type =
                    document.getElementById(
                        "reportType"
                    ).value;


                const neighborhood =
                    document.getElementById(
                        "reportNeighborhood"
                    ).value.trim();


                const description =
                    document.getElementById(
                        "reportDescription"
                    ).value.trim();


                if (
                    !type ||
                    !neighborhood ||
                    !description
                ) {

                    showToast(
                        "Veuillez remplir les champs obligatoires.",
                        false
                    );

                    return;

                }


                /*
                 * Simulation d'enregistrement local
                 */

                const report = {

                    id:
                        "SIG-" +
                        Date.now(),

                    type: type,

                    quartier: neighborhood,

                    description: description,

                    date:
                        new Date().toISOString(),

                    statut: "nouveau"

                };


                const existingReports =
                    JSON.parse(
                        localStorage.getItem(
                            "mbao_signalements"
                        )
                    ) || [];


                existingReports.push(report);


                localStorage.setItem(
                    "mbao_signalements",
                    JSON.stringify(existingReports)
                );


                reportForm.reset();

                closeModal();


                showToast(
                    "Votre signalement a bien été enregistré.",
                    true
                );

            }
        );

    }


    /* =====================================================
       TOAST
    ===================================================== */

    function showToast(message, success = true) {

        if (!toast) {
            return;
        }


        const toastText =
            toast.querySelector("p");


        const toastIcon =
            toast.querySelector(".toast-icon");


        if (toastText) {

            toastText.textContent =
                message;

        }


        if (toastIcon) {

            toastIcon.textContent =
                success ? "✓" : "!";

        }


        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

    }


    /* =====================================================
       LIENS PLACEHOLDER
    ===================================================== */

    const placeholderLinks =
        document.querySelectorAll(
            'a[href="#"]'
        );


    placeholderLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();

                showToast(
                    "Cette rubrique sera bientôt disponible.",
                    true
                );

            }
        );

    });


    /* =====================================================
       ANIMATION D'APPARITION
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".feature-card, .opportunity-card, .climate-card, .event-card, .mini-card"
        );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    animatedElements.forEach(element => {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(18px)";

        element.style.transition =
            "opacity 0.55s ease, transform 0.55s ease";

        observer.observe(element);

    });


    /*
     * Classe ajoutée dynamiquement pour l'animation.
     */

    const animationStyle =
        document.createElement("style");


    animationStyle.textContent = `

        .feature-card.visible,
        .opportunity-card.visible,
        .climate-card.visible,
        .event-card.visible,
        .mini-card.visible {

            opacity: 1 !important;

            transform: translateY(0) !important;

        }

    `;


    document.head.appendChild(
        animationStyle
    );


    console.log(
        "Portail numérique de la Jeunesse de Mbao - V1 chargé."
    );

});