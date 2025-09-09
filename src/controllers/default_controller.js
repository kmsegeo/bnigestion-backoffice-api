const defaultType = require('../config/default_types');
const Acteur = require('../models/Acteur');
const Agent = require('../models/Agent');
const Canal = require('../models/Canal');
const Profil = require('../models/Profil');
const TypeActeur = require('../models/TypeActeur');
const TypeDocument = require('../models/TypeDocument');
const TypeOperation = require('../models/TypeOperation');
const Encryption = require('../utils/encryption.methods');
const Utils = require('../utils/utils.methods');
const bcrypt = require('bcryptjs');

const defaultCanals = async () => {
    
    /**
     * [x] Vérifier un par un que les canaux (applications satélites) par défauts listés existent dans la base de données
     * [x] Si oui: ne rien faire ; Sinon: Créer le canal par défaut inexistant
     */
    console.log(`Vérification des canaux par défaut..`);

    const canauxList = defaultType.canal;

    await Canal.findAll().then(async canaux => {
        for(let new_canal of canauxList) {
            let create = true;
            for(let cur_canal of canaux) {
                if (cur_canal.r_intitule && new_canal.intitule.toLowerCase()==cur_canal.r_intitule.toLowerCase())
                    create = false;
            }
            if (create) {
                console.log(`Creation du canal`, new_canal.intitule);
                Utils.generateCode(Canal.code_prefix, Canal.table_name, Canal.code_colunm).then(async code => {
                    await Canal.findByCode(code).then(async exists => {
                        if(exists) return;
                        console.log("Cryptage du mot passe");
                        const pass = await Encryption.encrypt(new_canal.pass);
                        console.log(pass);
                        await Canal.create(code, {
                            r_intitule: new_canal.intitule, 
                            r_description: new_canal.description, 
                            r_pass: pass 
                        }).then(async canal => {
                            // console.log(canal);
                        }).catch(err => console.log(err));
                    }).catch(err=>console.log(err));
                }).catch(err => console.log(err));
                Utils.sleep(500);
            }
        }

    }).catch(err => console.log(err));
    
}

const defaultTypeActeur = async () => {

    /**
     * [x] Vérifier un par un que les type acteur par défauts listés existent dans la base de données
     * [x] Si oui: ne rien faire ; Sinon: Créer les type acteur par défaut inexistant
     */
    console.log(`Vérification des type-acteur par défaut..`)

    const typeActeursList = defaultType.type_acteur;

    await TypeActeur.findAll().then(async type_acteurs => {
        for(let new_type_acteur of typeActeursList) {
            let create = true;
            for(let cur_type_acteur of type_acteurs) {
                if (cur_type_acteur.r_intitule && new_type_acteur.intitule.toLowerCase()==cur_type_acteur.r_intitule.toLowerCase())
                    create = false;
            }
            if (create) {
                console.log(`Creation du type-opération`, new_type_acteur.intitule);
                await Utils.generateCode(TypeActeur.codePrefix, TypeActeur.tableName, TypeActeur.codeColumn).then(async code => {
                    await TypeActeur.create(code, {
                        r_intitule: new_type_acteur.intitule, 
                        r_description: new_type_acteur.description
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                await Utils.sleep(500);
            }
        }
    }).catch(err => console.log(err));
}

const defaultOperations = async () => {
    
    /**
     * [x] Vérifier un par un que les opérations par défauts listés existent dans la base de données
     * [x] Si oui: ne rien faire ; Sinon: Créer l'opération par défaut inexistant
     */
    console.log(`Vérification des type-opérations par défaut..`);

    const typeOperationsList = defaultType.type_operation;

    await TypeOperation.findAll().then(async type_operations => {
        for(let new_type_op of typeOperationsList) {
            let create = true;
            for(let cur_type_op of type_operations) {
                if (cur_type_op.r_intitule && new_type_op.intitule.toLowerCase()==cur_type_op.r_intitule.toLowerCase())
                    create = false;
            }
            if (create) {
                console.log(`Creation du type-opération`, new_type_op.intitule);
                await Utils.generateCode(TypeOperation.code_prefix, TypeOperation.tableName, TypeOperation.code_colunm).then(async code => {
                    await TypeOperation.create(code, {
                        r_intitule: new_type_op.intitule, 
                        r_description: new_type_op.description, 
                        r_transaction: new_type_op.transaction ? 1 : 0
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                await Utils.sleep(500);
            }
        }
    }).catch(err => console.log(err.stack));
}

const defaultTypeDocument = async () => {
    
    /**
     * [x] Vérifier un par un que les types document par défauts listés existent dans la base de données
     * [x] Si oui: ne rien faire ; Sinon: Créer le type document par défaut inexistant
     */
    console.log(`Vérification des types document par défaut..`);

    const typeDocumentList = defaultType.type_document

    await TypeDocument.findAll().then(async typeDocuments => {
        for (let typedoc of typeDocumentList) {
            let create = true;
            for (let td of typeDocuments) 
                if (td.r_intitule && typedoc.intitule.toLowerCase()==td.r_intitule.toLowerCase())
                    create = false;

            if (create) {
                console.log(`Creation du type document`, typedoc.intitule);
                await Utils.generateCode(TypeDocument.code_prefix, TypeDocument.tableName, TypeDocument.code_colunm).then(async code => {
                    await TypeDocument.create(code, {
                        r_intitule: typedoc.intitule, 
                        r_description: typedoc.description,
                        r_format: typedoc.format
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                await Utils.sleep(500);
            }
        }
    }).catch(err => console.log(err));
}

const defaultProfil = async () => {

    /**
     * [x] Vérifier un par un que les type acteur par défauts listés existent dans la base de données
     * [x] Si oui: ne rien faire ; Sinon: Créer les type acteur par défaut inexistant
     */
    console.log(`Vérification des profils par défaut..`)

    const profilList = defaultType.profil;

    await Profil.findAll().then(async profil => {
        for(let new_profil of profilList) {
            let create = true;
            for(let cur_profil of profil) {
                if (cur_profil.r_intitule && new_profil.intitule.toLowerCase()==cur_profil.r_intitule.toLowerCase())
                    create = false;
            }
            if (create) {
                console.log(`Creation du profil`, new_profil.intitule);
                await Utils.generateCode(Profil.codePrefix, Profil.tableName, Profil.codeColumn).then(async code => {
                    await Profil.create(code, {
                        r_intitule: new_profil.intitule, 
                        r_description: new_profil.description,
                        r_habilitation: new_profil.habilitations
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
                await Utils.sleep(500);
            }
        }
    }).catch(err => console.log(err));
}

const defaultAdmin = async () => {

    /**
     * [x] Vérifier qu'un agent/administrateur existe dans la base de données
     * [x] Si oui: ne rien faire ; Sinon: Créer un agent/administrateur par défaut
     *  __ login: admin@mediasoftci.net
     *  __ mdp: admin
     * [x] En passant, créer un profil Administrateur
     */
    console.log(`Vérification du compte admin par défaut..`)

    await Agent.findAll().then(async results => {
        if (results.length==0) {
            console.log("Création d'un agent/administrateur par défaut")
            bcrypt.hash("admin", 10).then(async hash => {
                console.log("Mise en place du compte acteur");
                await Acteur.createAgent({
                    r_nom_complet: `BNI` + ' ' + `Admin`,
                    r_email: `admin@bnigestion.net`,
                    r_telephone: `2250000000000`,
                    r_adresse: "Abidjan - Cocody",
                    r_mdp : hash,
                    type_acteur: 'TYAC001'
                }).then(async acteur => {
                    await Agent.create({
                        r_civilite : 1, 
                        r_nom : `BNI`, 
                        r_prenom : `Admin`, 
                        profil_code : 'PRFA001',
                        e_acteur : acteur.r_i
                    }).then(async admin => {
                        console.log("Création de l'agent/administrateur par défaut terminé.");
                        console.log("pwd:", "admin");
                    }).catch(error => console.log(error.stack));
                }).catch(error => console.log(error.stack));
            }).catch(error => console.log(error.stack));
        }
    }).catch(error => console.log(error.stack));
}

module.exports = {
    defaultCanals,
    defaultTypeActeur,
    defaultTypeDocument,
    defaultOperations,
    defaultProfil,
    defaultAdmin,
}