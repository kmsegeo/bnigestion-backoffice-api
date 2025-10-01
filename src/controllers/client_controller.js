const { format } = require("winston");
const response = require("../middlewares/response");
const { Particulier } = require("../models/Client");
const CompteDepot = require("../models/CompteDepot");

const findAllParticulier = async (req, res, next) => {

    const pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 10;
    const pagenumber = req.query.pagenumber ? parseInt(req.query.pagenumber) : 1;
    
    console.log(`Récupération des clients particuliers.. Page: ${pagenumber} | Taille: ${pagesize}`);

    await Particulier.findAll().then(async clients => {
        for(let client of clients) {
            await CompteDepot.findByActeurId(client.acteur_id).then(async compte => {
                client.compte_depot = compte;
            })
        }
        
        return response(res, 200, `Lists des clients particulier`, {
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
        await CompteDepot.create({numero_compte: ncompte ,acteur: client.acteur_id}).then(async compte => {
            await Particulier.updateCompteTitre(particulierId, {ncompte_titre: ncompte}).then(async particulier => {
                client.r_ncompte_titre = particulier.r_ncompte_titre;
                client.compte_depot = compte;
                return response(res, 200, `Compte client validé avec succès`, client);
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => next(err));
}

module.exports = {
    findAllParticulier,
    validerCompteParticulier
}