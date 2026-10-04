/* =========================================================
   PORTAIL NUMÉRIQUE DE LA JEUNESSE DE MBAO
   JavaScript principal
   Menu mobile + Google Apps Script + formulaires
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION API
   ========================================================= */

const API_URL =
    "https://script.google.com/macros/s/AKfycbxoyUHZT5xdOU3_cML6wVoPPZjK-xjvGRe9FEdIpNGvM6yuDBx2Zxvc-q7GASbdSbDa/exec";

/* =========================================================
   UTILITAIRES
   ========================================================= */

function afficherMessage(element, message, type = "success") {
    if (!element) return;

    element.textContent = message;
    element.className = "form-message " + type;
    element.style.display = "block";
}

function masquerMessage(element) {
    if (!element) return;

    element.textContent = "";
    element.className = "form-message";
    element.style.display = "none";
}

/* =========================================================
   API GET
   ========================================================= */

async function apiGet(action, params = {}) {

    try {

        const url = new URL(API_URL);

        url.searchParams.set("action", action);

        Object.keys(params).forEach(key => {
            if (
                params[key] !== undefined &&
                params[key] !== null &&
                params[key] !== ""
            ) {
                url.searchParams.set(key, params[key]);
            }
        });

        console.log("GET API :", url.toString());

        const response = await fetch(url.toString(), {
            method: "GET",
            cache: "no-cache"
        });

        const text = await response.text();

        console.log("Réponse API GET :", text);

        let data;

        try {
            data = JSON.parse(text);
        } catch (error) {
            throw new Error("La réponse du serveur n'est pas un JSON valide.");
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Erreur HTTP " + response.status
            );
        }

        return data;

    } catch (error) {

        console.error("Erreur apiGet :", error);

        throw error;
    }
}

/* =========================================================
   API POST
   ========================================================= */

async function apiPost(action, data = {}) {

    try {

        const payload = {
            action: action,
            ...data
        };

        console.log("POST API :", payload);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(payload)
        });

        const text = await response.text();

        console.log("Réponse API POST :", text);

        let result;

        try {
            result = JSON.parse(text);
        } catch (error) {
            throw new Error("La réponse du serveur n'est pas un JSON valide.");
        }

        if (!response.ok) {
            throw new Error(
                result.message || "Erreur HTTP " + response.status
            );
        }

        return result;

    } catch (error) {

        console.error("Erreur apiPost :", error);

        throw error;
    }
}

/* =========================================================
   MENU MOBILE
   ========================================================= */

function initialiserMenuMobile() {

    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (!menuToggle || !navMenu) {
        console.log("ℹ️ Menu mobile non détecté sur cette page.");
        return;
    }

    console.log("✅ Menu mobile détecté");

    function ouvrirFermerMenu() {

        const ouvert = navMenu.classList.toggle("open");

        menuToggle.classList.toggle("active", ouvert);

        menuToggle.setAttribute(
            "aria-expanded",
            ouvert ? "true" : "false"
        );

        document.body.classList.toggle("menu-open", ouvert);
    }

    menuToggle.addEventListener("click", function (event) {

        event.stopPropagation();

        ouvrirFermerMenu();
    });

    /* Fermer après clic sur un lien */

    const liens = navMenu.querySelectorAll("a");

    liens.forEach(function (lien) {

        lien.addEventListener("click", function () {

            navMenu.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("menu-open");
        });

    });

    /* Fermer si on clique en dehors du menu */

    document.addEventListener("click", function (event) {

        const clicDansMenu =
            navMenu.contains(event.target);

        const clicSurBouton =
            menuToggle.contains(event.target);

        if (
            navMenu.classList.contains("open") &&
            !clicDansMenu &&
            !clicSurBouton
        ) {

            navMenu.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("menu-open");
        }

    });

    /* Fermer le menu si l'écran repasse en desktop */

    window.addEventListener("resize", function () {

        if (window.innerWidth > 700) {

            navMenu.classList.remove("open");
            menuToggle.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            document.body.classList.remove("menu-open");
        }

    });
}

/* =========================================================
   INSCRIPTION JEUNE
   ========================================================= */

async function inscrireJeune(data) {

    return await apiPost("inscription", data);
}

/* =========================================================
   ENVOI D'UNE IDÉE
   ========================================================= */

async function envoyerIdee(data) {

    return await apiPost("idee", data);
}

/* =========================================================
   ENVOI D'UN SIGNALEMENT
   ========================================================= */

async function envoyerSignalement(data) {

    return await apiPost("signalement", data);
}

/* =========================================================
   ENVOI D'UNE ACTIVITÉ
   ========================================================= */

async function envoyerActivite(data) {

    return await apiPost("activite", data);
}

/* =========================================================
   ENVOI D'UNE PARTICIPATION
   ========================================================= */

async function envoyerParticipation(data) {

    return await apiPost("participation", data);
}

/* =========================================================
   FORMULAIRE INSCRIPTION
   ========================================================= */

function initialiserFormulaireInscription() {

    const form = document.getElementById("inscriptionForm");

    if (!form) return;

    console.log("✅ Formulaire inscription détecté");

    const message =
        document.getElementById("inscriptionMessage");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        masquerMessage(message);

        const bouton =
            form.querySelector("button[type='submit']");

        if (bouton) {
            bouton.disabled = true;
            bouton.textContent = "Enregistrement...";
        }

        try {

            const data = {
                nom: document.getElementById("inscriptionNom")?.value.trim() || "",
                prenom: document.getElementById("inscriptionPrenom")?.value.trim() || "",
                telephone: document.getElementById("inscriptionTelephone")?.value.trim() || "",
                quartier: document.getElementById("inscriptionQuartier")?.value.trim() || "",
                email: document.getElementById("inscriptionEmail")?.value.trim() || "",
                domaine: document.getElementById("inscriptionDomaine")?.value || "",
                volontaire:
                    document.getElementById("inscriptionVolontaire")?.value || "Non"
            };

            if (!data.nom || !data.prenom || !data.telephone) {

                throw new Error(
                    "Veuillez remplir les champs obligatoires."
                );
            }

            const result =
                await inscrireJeune(data);

            if (result.success === false) {

                throw new Error(
                    result.message || "L'inscription a échoué."
                );
            }

            afficherMessage(
                message,
                "Votre inscription a été enregistrée avec succès.",
                "success"
            );

            form.reset();

        } catch (error) {

            console.error(error);

            afficherMessage(
                message,
                error.message ||
                "Une erreur est survenue. Veuillez réessayer.",
                "error"
            );

        } finally {

            if (bouton) {

                bouton.disabled = false;
                bouton.textContent = "S'inscrire";
            }
        }

    });
}

/* =========================================================
   FORMULAIRE VOLONTAIRE
   ========================================================= */

function initialiserFormulaireVolontaire() {

    const form =
        document.getElementById("volontaireForm");

    if (!form) return;

    console.log("✅ Formulaire volontaire détecté");

    const message =
        document.getElementById("volontaireMessage");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        masquerMessage(message);

        const bouton =
            form.querySelector("button[type='submit']");

        if (bouton) {

            bouton.disabled = true;
            bouton.textContent = "Enregistrement...";
        }

        try {

            const data = {

                nom:
                    document.getElementById("volontaireNom")?.value.trim() || "",

                prenom:
                    document.getElementById("volontairePrenom")?.value.trim() || "",

                telephone:
                    document.getElementById("volontaireTelephone")?.value.trim() || "",

                quartier:
                    document.getElementById("volontaireQuartier")?.value.trim() || "",

                domaine:
                    document.getElementById("volontaireDomaine")?.value || "",

                volontaire: "Oui"
            };

            if (
                !data.nom ||
                !data.prenom ||
                !data.telephone
            ) {

                throw new Error(
                    "Veuillez remplir les champs obligatoires."
                );
            }

            const result =
                await inscrireJeune(data);

            if (result.success === false) {

                throw new Error(
                    result.message ||
                    "L'inscription comme volontaire a échoué."
                );
            }

            afficherMessage(
                message,
                "Votre demande de volontariat a été enregistrée avec succès.",
                "success"
            );

            form.reset();

        } catch (error) {

            console.error(error);

            afficherMessage(
                message,
                error.message ||
                "Une erreur est survenue.",
                "error"
            );

        } finally {

            if (bouton) {

                bouton.disabled = false;
                bouton.textContent = "Devenir volontaire";
            }
        }

    });
}

/* =========================================================
   FORMULAIRE IDÉE
   ========================================================= */

function initialiserFormulaireIdee() {

    const form =
        document.getElementById("ideeForm");

    if (!form) return;

    console.log("✅ Formulaire idée détecté");

    const message =
        document.getElementById("ideeMessage");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        masquerMessage(message);

        const bouton =
            form.querySelector("button[type='submit']");

        if (bouton) {

            bouton.disabled = true;
            bouton.textContent = "Envoi...";
        }

        try {

            const data = {

                nom:
                    document.getElementById("ideeNom")?.value.trim() || "",

                telephone:
                    document.getElementById("ideeTelephone")?.value.trim() || "",

                quartier:
                    document.getElementById("ideeQuartier")?.value.trim() || "",

                categorie:
                    document.getElementById("ideeCategorie")?.value || "",

                idee:
                    document.getElementById("ideeTexte")?.value.trim() || ""
            };

            if (!data.idee) {

                throw new Error(
                    "Veuillez saisir votre idée."
                );
            }

            const result =
                await envoyerIdee(data);

            if (result.success === false) {

                throw new Error(
                    result.message ||
                    "L'envoi de l'idée a échoué."
                );
            }

            afficherMessage(
                message,
                "Merci ! Votre idée a bien été envoyée au Conseil.",
                "success"
            );

            form.reset();

        } catch (error) {

            console.error(error);

            afficherMessage(
                message,
                error.message ||
                "Une erreur est survenue.",
                "error"
            );

        } finally {

            if (bouton) {

                bouton.disabled = false;
                bouton.textContent = "Envoyer mon idée";
            }
        }

    });
}

/* =========================================================
   INITIALISATION GÉNÉRALE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("");
    console.log("====================================");
    console.log("CCJ MBAO – PORTAIL NUMÉRIQUE");
    console.log("JavaScript chargé correctement");
    console.log("====================================");

    initialiserMenuMobile();

    initialiserFormulaireInscription();

    initialiserFormulaireVolontaire();

    initialiserFormulaireIdee();

});
