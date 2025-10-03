const { format } = require("winston");
const response = require("../middlewares/response");
const { Particulier } = require("../models/Client");
const CompteDepot = require("../models/CompteDepot");
const default_data = require("../config/default_data");
const Acteur = require("../models/Acteur");
const Utils = require("../utils/utils.methods");

const findAllParticulier = async (req, res, next) => {

    const pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 10;
    const pagenumber = req.query.pagenumber ? parseInt(req.query.pagenumber) : 1;
    
    console.log(`Récupération des clients particuliers.. Page: ${pagenumber} | Taille: ${pagesize}`);

    await Particulier.findAll().then(async clients => {
        for(let client of clients) {
            client.r_solde_disponible = 0;
            await CompteDepot.findByActeurId(client.acteur_id).then(async compte => {
                if (compte) client.r_solde_disponible = compte.r_solde_disponible;
            })
            client.r_civilite = default_data.civilites[client.r_civilite];
            client.r_type_piece = default_data.type_pieces[client.r_type_piece];
            client.r_statut = {
                'code': client.r_statut,
                'libelle': default_data.default_status[client.r_statut],
                'couleur': default_data.status_couleur[client.r_statut]
            };
            delete client.e_type_acteur;
        }
        
        return response(res, 200, `Liste des clients particulier`, {
            total: clients.length, 
            pages: clients.length % pagesize === 0 ? Math.floor(clients.length / pagesize) : Math.floor(clients.length / pagesize) + 1, 
            clients: clients.slice((pagenumber - 1) * pagesize, pagenumber * pagesize)
        });

    }).catch(err => next(err));
}

const validerCompteParticulier = async (req, res, next) => {
    console.log(`Validation de compte particulier..`);
    const particulierId = req.params.particulierId;
    await Particulier.findById(particulierId).then(async client => {
        if(!client) return response(res, 404, `Client introuvable !`);
        if (client.r_ncompte_titre) return response(res, 409, `Le compte du client est déjà validé !`);
        console.log(`Creation du compte de dépôt`);
        const min = 100000000; const max = 999999999; 
        const ncompte = Math.floor(Math.random() * (max - min + 1)) + min;
        client.r_solde_disponible = 0;
        await CompteDepot.create({numero_compte: ncompte ,acteur: client.acteur_id}).then(async compte => {
            if (compte) client.r_solde_disponible = compte.r_solde_disponible;
            await Particulier.updateCompteTitre(particulierId, {ncompte_titre: ncompte}).then(async particulier => {
                client.r_civilite = default_data.civilites[client.r_civilite];
                client.r_type_piece = default_data.type_pieces[client.r_type_piece];
                client.r_ncompte_titre = particulier.r_ncompte_titre;
                return response(res, 200, `Compte client validé avec succès`, client);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => next(err));
}

const updateParticulier = async (req, res, next) => {
    console.log("Mise à jour d'un client particulier...");
    const particulierId = req.params.particulierId;
    const {civilite, nom, prenom, email, telephone} = req.body;
    console.log(`Récupération des données client`);
    
    console.log(req.body);
    console.log("civilite:", civilite);
    console.log("nom:", nom);
    console.log("prenom:", prenom);
    console.log("email:", email);
    console.log("telephone:", telephone);
    
    await Utils.expectedParameters({civilite, nom, prenom, email, telephone}).catch(err => { return response(res, 400, err); });

    await Particulier.findById(particulierId).then(async client => {
        if(!client) return response(res, 404, `Client introuvable !`);
        const nom_complet = nom + ' ' + prenom;
        console.log(`Mise à jour des données acteur`);
        await Acteur.update(client.acteur_id, {civilite, nom_complet, email, telephone}).then(async acteur => {
            console.log(`Mise à jour des données particulier`);
            await Particulier.update(particulierId, {civilite, nom, prenom}).then(async particulier => {
                client.r_civilite = default_data.civilites[particulier.r_civilite];
                client.r_nom = particulier.r_nom;
                client.r_prenom = particulier.r_prenom;
                client.r_email = acteur.r_email;
                client.r_telephone_prp = acteur.r_telephone_prp;
                client.r_statut = default_data.default_status[client.r_statut];
                client.r_type_piece = default_data.type_pieces[client.r_type_piece];
                client.r_solde_disponible = 0;
                // await CompteDepot.findByActeurId(client.acteur_id).then(async compte => {
                //     if (compte) client.r_solde_disponible = compte.r_solde_disponible;
                // })
                delete client.e_type_acteur;
                return response(res, 200, `Mise à jour effectuée avec succès`, client);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => next(err));
}

module.exports = {
    findAllParticulier,
    validerCompteParticulier,
    updateParticulier
}