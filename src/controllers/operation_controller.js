const response = require("../middlewares/response");
const Acteur = require("../models/Acteur");
const CompteDepot = require("../models/CompteDepot");
const Fonds = require("../models/Fonds");
const Operation = require("../models/Operation");
const Portefeuille = require("../models/Portefeuille");
const TypeActeur = require("../models/TypeActeur");
const TypeOperation = require("../models/TypeOperation");

const statuts = {
    0: "En attente",
    1: "Validée",
    2: "Rejetée"
}

const getAllOperations = async (req, res, next) => {

    const pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 10;
    const pagenumber = req.query.pagenumber ? parseInt(req.query.pagenumber) : 1;
    
    console.log(`Récupération des opérations.. Page: ${pagenumber} | Taille: ${pagesize}`);

    await Operation.findAll().then(async operations => {
        for(let op of operations) { 
            await TypeOperation.findById(op.e_type_operation).then(async tyop => {
                if (tyop.r_i==op.e_type_operation) {
                    op.r_type_operation = tyop.r_intitule;
                    delete op.e_type_operation;
                }
            });

            await Acteur.findById(op.e_acteur).then(async acteur => {
                if (acteur) {
                    await TypeActeur.findById(acteur.e_type_acteur).then(async tyac => {
                        acteur.r_type_acteur = tyac.r_intitule;
                        op.r_acteur = acteur;

                        delete acteur.e_type_acteur;
                        delete acteur.r_statut;
                        delete acteur.r_date_creer;
                        delete acteur.r_date_modif;
                        delete acteur.r_date_activation;
                        delete acteur.r_langue;
                        delete acteur.r_telephone_scd;
                    });
                }
            });

            delete op.r_i;
            op.r_statut = statuts[op.r_statut];
        }
        return response(res, 200, `Liste des opérations`, {
            total: operations.length, 
            pages: operations.length % pagesize === 0 ? Math.floor(operations.length / pagesize) : Math.floor(operations.length / pagesize) + 1, 
            operations: operations.slice((pagenumber - 1) * pagesize, pagenumber * pagesize)
        });
    }).catch(err => next(err));
}

const getAllUnTreatedOp = async (req, res, next) => {
    console.log(`Récupération des opérations non traité..`);
    await Operation.findAllUnTreated().then(async operations => {
        for(let op of operations) { 
            await TypeOperation.findById(op.e_type_operation).then(async tyop => {
                op.r_type_operation = tyop.r_intitule;
                delete op.e_type_operation;
            });
            delete op.r_statut;
        }
        return response(res, 200, `Liste des opérations non traité..`, operations);
    }).catch(err => next(err));
}

const validOperation = async (req, res, next) => {
    const ref = req.params.ref;
    console.log(`Validation de l'opération ${ref}..`);
    await Operation.findByRef(ref).then(async operation => {
        if (!operation) return response(res, 404, `Opération introuvable !`);
        if (operation.r_statut!=0) return response(res, 409, `Opération traité !`);
        await Operation.valid(ref).then(async treated => {
            await TypeOperation.findById(treated.e_type_operation).then(async tyop => {
                if (!tyop) return response(res, 404, `Type opération introuvabe !`);
                await Portefeuille.valid(treated.r_i).then(async portefeuille => {
                    if (!portefeuille) return response(res, 404, `Portefeuille introuvabe !`);
                    await Fonds.findById(portefeuille.e_fonds).then(async fonds => {
                        return response(res, 200, `Opération validé avec succès`, {
                            r_intitule_fonds: fonds.r_intitule,
                            r_type_operation: tyop.r_intitule,
                            r_cours_placement: portefeuille.r_cours_placement,
                            r_nombre_parts: portefeuille.r_nombre_parts,
                            r_valeur_placement: portefeuille.r_valeur_placement,
                            r_statut: portefeuille.r_statut
                        });
                    }).catch(err => next(err));
                }).catch(err => next(err));
            }).catch(err => next(err));
            
        }).catch(err => next(err));
    }).catch(err => next(err));
}

const rejectedOperation = async (req, res, next) => {
    const ref = req.params.ref;
    console.log(`Validation de l'opération ${ref}..`);
    await Operation.findByRef(ref).then(async operation => {
        if (!operation) return response(res, 404, `Opération introuvable !`);
        if (operation.r_statut!=0) return response(res, 409, `Opération traité !`);
        await Operation.valid(ref).then(async treated => {
            await TypeOperation.findById(treated.e_type_operation).then(async tyop => {
                if (!tyop) return response(res, 404, `Type opération introuvabe !`);
                await Portefeuille.rejected(treated.r_i).then(async portefeuille => {
                    if (!portefeuille) return response(res, 404, `Portefeuille introuvabe !`);
                    await CompteDepot.findByActeurId(treated.e_acteur).then(async compte => {
                        if (!portefeuille) return response(res, 404, `Compte de dépôt introuvabe !`);
                        const solde = Number(compte.r_solde_disponible) + Number(portefeuille.r_valeur_placement);
                        await CompteDepot.mouvement(treated.e_acteur, {montant:solde}).then(async () => {
                            await Fonds.findById(portefeuille.e_fonds).then(async fonds => {
                                return response(res, 200, `Opération rejeté avec succès`, {
                                    r_intitule_fonds: fonds.r_intitule,
                                    r_type_operation: tyop.r_intitule,
                                    r_cours_placement: portefeuille.r_cours_placement,
                                    r_nombre_parts: portefeuille.r_nombre_parts,
                                    r_valeur_placement: portefeuille.r_valeur_placement,
                                    r_statut: portefeuille.r_statut
                                });
                            }).catch(err => next(err));
                        }).catch(err => next(err));
                    }).catch(err => next(err));
                }).catch(err => next(err));
            }).catch(err => next(err));
        }).catch(err => next(err));
    }).catch(err => next(err));
}

module.exports = {
    getAllOperations,
    getAllUnTreatedOp,
    validOperation,
    rejectedOperation
}