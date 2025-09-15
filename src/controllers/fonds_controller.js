const response = require("../middlewares/response");
const Fonds = require("../models/Fonds");
const ValeurLiquidative = require("../models/ValeurLiquidative");
const Utils = require("../utils/utils.methods");

const getAllFonds = async (req, res, next) => {
    console.log("Récupération de la liste des fonds...");
    await Fonds.findAll().then(async fonds => {
        for (let f of fonds) {
            await ValeurLiquidative.findLastByFonds(f.r_i).then(vl => {
                f['vl'] = vl;
            }).catch(err=>next(err));
        }
        return response(res, 200, "Liste des fonds", fonds);
    }).catch(err => next(err));
}

const getOneFonds = async (req, res, next) => { 
    const code = req.params.code;
    console.log("Récupération du fonds " + code + "...");
    await Fonds.findByCode(code).then(async fonds => {
        if (!fonds) return response(res, 404, "Fonds non trouvé", null)
        await ValeurLiquidative.findLastByFonds(fonds.r_i).then(vl => {
            fonds.vl = vl
            return response(res, 200, "Détails du fonds", fonds);
        }).catch(err => next(err));
    }).catch(err => next(err));
}

const createFonds = async (req, res, next) => {
    console.log("Création d'un nouveau fonds...");
    const {intitule, description, commission_souscription, commission_sortie} = req.body;
    Utils.expectedParameters({intitule}).then(async () => { 
        await Utils.generateCode(Fonds.codePrefix, Fonds.tableName, Fonds.codeColumn).then(async code => {
            await Fonds.create(code, {intitule, description, commission_souscription, commission_sortie}).then(fonds => {
                return response(res, 201, "Fonds créé avec succès", fonds)
            }).catch(err => next(err));
        }).catch(err => next(err));
    }).catch(err => response(res, 400, err));
}

const createVl = async (req, res, next) => {
    console.log("Création d'une nouvelle VL...");
    const code = req.params.code;
    const {valeur, datevl, description} = req.body;
    Utils.expectedParameters({code, valeur, datevl}).then(async () => {
        await Fonds.findByCode(code).then(async fonds => {
            if (!fonds) return response(res, 404, "Fonds non trouvé");
            await ValeurLiquidative.findLastByFonds(fonds.r_i).then(async oldvl => {
                console.log( "valeur_precedente:", oldvl?.r_valeur, "date_precedente:", oldvl?.r_datevl)
                await ValeurLiquidative.create(fonds.r_i, {valeur, datevl, description, valeur_precedente: oldvl?.r_valeur, date_precedente: oldvl?.r_datevl}).then(vl => {
                    return response(res, 201, "Valeur liquidative ajouté avec succès", vl);
                }).catch(err => next(err));
            }).catch(err => next(err));
        }).catch(err => next(err));
    }).catch(err => response(res, 400, err));
}

const getLastByFonds = async (req, res, next) => {
    console.log('Récupération de la dernière VL..')
    const code = req.params.code;
    await Fonds.findByCode(code).then(async fonds => {
        await ValeurLiquidative.findLastByFonds(fonds.r_i).then(vl => {
            return response(res, 200, 'Récupération terminé', vl);
        }).catch(err=>next(err));
    }).catch(err => next(err))
}

const getAllVlsByFonds = async (req, res, next) => {
    const code = req.params.code;
    console.log("Récupération du fonds " + code + "...");
    await Fonds.findByCode(code).then(async fonds => {
        if (!fonds) return response(res, 404, "Fonds non trouvé", null)
        await ValeurLiquidative.findAllByFonds(fonds.r_i).then(vls => {
            fonds.vls = vls
            return response(res, 200, "Détails du fonds", fonds);
        }).catch(err => next(err));
    }).catch(err => next(err));
}

module.exports = {
    getAllFonds,
    getOneFonds,
    createFonds,
    createVl,
    getLastByFonds,
    getAllVlsByFonds,
}