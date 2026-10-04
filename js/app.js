/*******************************************************
 * CCJ MBAO – PORTAIL NUMÉRIQUE
 * Connexion Google Apps Script → Google Sheets
 *******************************************************/


/* =====================================================
   CONFIGURATION API
===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyrnIMD_QG3G1gxc62hGgJEoo3SBNvl9jwTXcHWtCUHj1iOiYpb_p6UldhN-kz6L9qF/exec";


/* =====================================================
   MESSAGE
===================================================== */

function afficherMessage(elementId, message, succes = true) {

    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Élément introuvable :", elementId);
        return;
    }

    element.style.display = "block";
    element.textContent = message;
    element.style.padding = "12px";
    element.style.marginTop = "15px";
    element.style.borderRadius = "8px";

    if (succes) {

        element.style.background = "#dcfce7";
        element.style.color = "#166534";

    } else {

        element.style.background = "#fee2e2";
        element.style.color = "#991b1b";
    }
}


/* =====================================================
   API GET
===================================================== */

async function apiGet(action) {

    console.log("GET API :", action);

    try {

        const url =
            API_URL +
            "?action=" +
            encodeURIComponent(action);

        const response = await fetch(url);

        console.log("Réponse HTTP GET :", response.status);

        const texte = await response.text();

        console.log("Réponse GET :", texte);

        let resultat;

        try {

            resultat = JSON.parse(texte);

        } catch (error) {

            throw new Error(
                "La réponse de Google Apps Script n'est pas un JSON valide."
            );
        }

        return resultat;

    } catch (error) {

        console.error("ERREUR API GET :", error);

        return {
            success: false,
            message: error.message
        };
    }
}


/* =====================================================
   API POST
===================================================== */

async function apiPost(data) {

    console.log("====================================");
    console.log("POST API");
    console.log("Données envoyées :", data);
    console.log("====================================");

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(data)

        });


        console.log(
            "Réponse HTTP POST :",
            response.status
        );


        const texte = await response.text();


        console.log(
            "Réponse Google Apps Script :",
            texte
        );


        if (!texte) {

            throw new Error(
                "Google Apps Script a retourné une réponse vide."
            );
        }


        let resultat;

        try {

            resultat = JSON.parse(texte);

        } catch (error) {

            console.error(
                "Réponse reçue non JSON :",
                texte
            );

            throw new Error(
                "Réponse Google Apps Script invalide."
            );
        }


        return resultat;


    } catch (error) {

        console.error(
            "ERREUR API POST :",
            error
        );


        return {

            success: false,

            message:
                "Impossible d'envoyer les données. " +
                error.message

        };
    }
}


/* =====================================================
   INSCRIPTION JEUNE
===================================================== */

async function inscrireJeune(data) {

    return await apiPost({

        action: "inscription",

        nom: data.nom || "",

        prenom: data.prenom || "",

        telephone: data.telephone || "",

        quartier: data.quartier || "",

        email: data.email || "",

        domaine: data.domaine || "",

        volontaire: data.volontaire || "Non"

    });
}


/* =====================================================
   PROPOSER UNE IDÉE
===================================================== */

async function envoyerIdee(data) {

    return await apiPost({

        action: "idee",

        nom: data.nom || "",

        telephone: data.telephone || "",

        quartier: data.quartier || "",

        categorie: data.categorie || "",

        idee: data.idee || ""

    });
}


/* =====================================================
   SIGNALEMENT
===================================================== */

async function envoyerSignalement(data) {

    return await apiPost({

        action: "signalement",

        type: data.type || "",

        quartier: data.quartier || "",

        lieu: data.lieu || "",

        description: data.description || "",

        photo: data.photo || "",

        nom: data.nom || "",

        telephone: data.telephone || ""

    });
}


/* =====================================================
   ACTIVITÉ
===================================================== */

async function envoyerActivite(data) {

    return await apiPost({

        action: "activite",

        date: data.date || "",

        activite: data.activite || "",

        categorie: data.categorie || "",

        lieu: data.lieu || "",

        description: data.description || "",

        participants: data.participants || 0,

        responsable: data.responsable || "",

        statut: data.statut || "Prévue",

        photo: data.photo || ""

    });
}


/* =====================================================
   PARTICIPATION
===================================================== */

async function envoyerParticipation(data) {

    return await apiPost({

        action: "participation",

        jeune_id: data.jeune_id || "",

        activite_id: data.activite_id || "",

        nom: data.nom || "",

        telephone: data.telephone || "",

        present: data.present || "Oui",

        observation: data.observation || ""

    });
}


/* =====================================================
   FORMULAIRE INSCRIPTION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {


    console.log("====================================");
    console.log("CCJ MBAO – PORTAIL NUMÉRIQUE");
    console.log("JavaScript chargé correctement");
    console.log("====================================");


    /* =================================================
       INSCRIPTION
    ================================================= */

    const inscriptionForm =
        document.getElementById("inscriptionForm");


    if (inscriptionForm) {

        console.log("✅ Formulaire inscription détecté");


        inscriptionForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                afficherMessage(
                    "inscriptionMessage",
                    "⏳ Enregistrement en cours...",
                    true
                );


                const data = {

                    nom:
                        document
                            .getElementById("inscriptionNom")
                            .value
                            .trim(),

                    prenom:
                        document
                            .getElementById("inscriptionPrenom")
                            .value
                            .trim(),

                    telephone:
                        document
                            .getElementById("inscriptionTelephone")
                            .value
                            .trim(),

                    quartier:
                        document
                            .getElementById("inscriptionQuartier")
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById("inscriptionEmail")
                            .value
                            .trim(),

                    domaine:
                        document
                            .getElementById("inscriptionDomaine")
                            .value,

                    volontaire: "Non"
                };


                const resultat =
                    await inscrireJeune(data);


                console.log(
                    "Résultat inscription :",
                    resultat
                );


                if (resultat.success) {

                    afficherMessage(
                        "inscriptionMessage",
                        "✅ Votre inscription a été enregistrée avec succès. Votre identifiant est : " +
                        resultat.id,
                        true
                    );


                    inscriptionForm.reset();


                } else {

                    afficherMessage(
                        "inscriptionMessage",
                        "❌ " +
                        (
                            resultat.message ||
                            "Une erreur est survenue."
                        ),
                        false
                    );
                }

            }
        );

    } else {

        console.warn(
            "ℹ️ Aucun formulaire inscription sur cette page."
        );
    }



    /* =================================================
       VOLONTAIRE
    ================================================= */

    const volontaireForm =
        document.getElementById("volontaireForm");


    if (volontaireForm) {

        console.log("✅ Formulaire volontaire détecté");


        volontaireForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                afficherMessage(
                    "volontaireMessage",
                    "⏳ Enregistrement de votre candidature...",
                    true
                );


                const data = {

                    nom:
                        document
                            .getElementById("volontaireNom")
                            .value
                            .trim(),

                    prenom:
                        document
                            .getElementById("volontairePrenom")
                            .value
                            .trim(),

                    telephone:
                        document
                            .getElementById("volontaireTelephone")
                            .value
                            .trim(),

                    quartier:
                        document
                            .getElementById("volontaireQuartier")
                            .value
                            .trim(),

                    domaine:
                        document
                            .getElementById("volontaireDomaine")
                            .value,

                    volontaire: "Oui"

                };


                const resultat =
                    await inscrireJeune(data);


                console.log(
                    "Résultat volontaire :",
                    resultat
                );


                if (resultat.success) {

                    afficherMessage(
                        "volontaireMessage",
                        "✅ Votre demande pour devenir volontaire a été enregistrée. Votre identifiant est : " +
                        resultat.id,
                        true
                    );


                    volontaireForm.reset();


                } else {

                    afficherMessage(
                        "volontaireMessage",
                        "❌ " +
                        (
                            resultat.message ||
                            "Une erreur est survenue."
                        ),
                        false
                    );
                }

            }
        );

    } else {

        console.warn(
            "ℹ️ Aucun formulaire volontaire sur cette page."
        );
    }



    /* =================================================
       IDÉE
    ================================================= */

    const ideeForm =
        document.getElementById("ideeForm");


    if (ideeForm) {

        console.log("✅ Formulaire idée détecté");


        ideeForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                afficherMessage(
                    "ideeMessage",
                    "⏳ Envoi de votre idée...",
                    true
                );


                const data = {

                    nom:
                        document
                            .getElementById("ideeNom")
                            .value
                            .trim(),

                    telephone:
                        document
                            .getElementById("ideeTelephone")
                            .value
                            .trim(),

                    quartier:
                        document
                            .getElementById("ideeQuartier")
                            .value
                            .trim(),

                    categorie:
                        document
                            .getElementById("ideeCategorie")
                            .value,

                    idee:
                        document
                            .getElementById("ideeTexte")
                            .value
                            .trim()

                };


                const resultat =
                    await envoyerIdee(data);


                console.log(
                    "Résultat idée :",
                    resultat
                );


                if (resultat.success) {

                    afficherMessage(
                        "ideeMessage",
                        "✅ Merci ! Votre idée a bien été enregistrée. Référence : " +
                        resultat.id,
                        true
                    );


                    ideeForm.reset();


                } else {

                    afficherMessage(
                        "ideeMessage",
                        "❌ " +
                        (
                            resultat.message ||
                            "Une erreur est survenue."
                        ),
                        false
                    );
                }

            }
        );

    } else {

        console.warn(
            "ℹ️ Aucun formulaire idée sur cette page."
        );
    }


});