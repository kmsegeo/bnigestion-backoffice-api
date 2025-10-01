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
    const {intitule, type, valeur_action, taux_allocation, description, commission_souscription, commission_sortie} = req.body;
    Utils.expectedParameters({intitule}).then(async () => { 
        await Utils.generateCode(Fonds.codePrefix, Fonds.tableName, Fonds.codeColumn).then(async code => {
            await Fonds.create(code, {intitule, type, valeur_action, taux_allocation, description, commission_souscription, commission_sortie}).then(fonds => {
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
                console.log( "valeur_precedente:", oldvl?.r_valeur_courante, "date_precedente:", oldvl?.r_datevl)
                const valeur_precedente = oldvl.r_valeur_courante ? Number(oldvl.r_valeur_courante) : 0;
                const taux_redement = ((Number(valeur)-valeur_precedente)/valeur_precedente) * 100
                const rendement_positive= (Number(valeur)-valeur_precedente) < 0 ? false: true;
                await ValeurLiquidative.create(fonds.r_i, {
                    valeur, 
                    datevl, 
                    description, 
                    valeur_precedente, 
                    date_precedente: oldvl?.r_datevl, 
                    taux_redement, 
                    rendement_positive
                }).then(vl => {
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
    
    const pagesize = req.query.pagesize ? parseInt(req.query.pagesize) : 10;
    const pagenumber = req.query.pagenumber ? parseInt(req.query.pagenumber) : 1;
    console.log(`Récupération du fonds ${code}.. Page: ${pagenumber} | Taille: ${pagesize}` );

    await Fonds.findByCode(code).then(async fonds => {
        if (!fonds) return response(res, 404, "Fonds non trouvé", null)
        await ValeurLiquidative.findAllByFonds(fonds.r_i).then(vls => {
            const total = vls.length;
            const pages = vls.length % pagesize === 0 ? Math.floor(vls.length / pagesize) : Math.floor(vls.length / pagesize) + 1;
            vls = vls.slice((pagenumber - 1) * pagesize, pagenumber * pagesize);
            return response(res, 200, "Détails du fonds", {fonds, vls, total, pages});
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