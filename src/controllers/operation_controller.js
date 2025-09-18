const response = require("../middlewares/response");
const Fonds = require("../models/Fonds");
const Operation = require("../models/Operation");
const Portefeuille = require("../models/Portefeuille");
const TypeOperation = require("../models/TypeOperation");

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

const validerOperation = async (req, res, next) => {
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

module.exports = {
    getAllUnTreatedOp,
    validerOperation
}