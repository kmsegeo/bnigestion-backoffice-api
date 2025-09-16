const db = require('../config/database')

const acteur_table = '_sc_auth.t_acteur';

// const Acteur = {

//     async findAllInactive() {
//         const queryString = `SELECT * FROM ${acteur_table} WHERE r_statut=$1`;
//         const res = db.query(queryString, [0]);
//         return (await res).rows;
//     }
// }

const Particulier = {

    tableName: '_sc_auth.t_particulier',
    
    async findAll() {
        const queryString = `
            SELECT 
                tp.r_i,
                tp.r_civilite, 
                tp.r_nom,
                tp.r_nom_jeune_fille,
                tp.r_prenom,
                tp.r_date_naissance,
                tp.r_nationalite,
                tp.r_type_piece,
                tp.r_numero_piece,
                tp.r_validite_piece,
                tp.r_ncompte_titre,
                ta.r_i as acteur_id,
                ta.r_email, 
                ta.r_telephone_prp, 
                ta.r_telephone_scd, 
                ta.r_adresse, 
                ta.r_statut,
                ta.r_profil_investisseur,
                ta.r_langue,
                ta.r_date_creer, 
                ta.r_date_modif, 
                ta.r_date_activation,
                ta.e_type_acteur
            FROM ${this.tableName} As tp, ${acteur_table} As ta 
            WHERE ta.r_i=tp.e_acteur`;
        const res = db.query(queryString);
        return (await res).rows;
    }, 

    async findById(id) {
        const res = db.query(`
            SELECT  
                tp.r_civilite, 
                tp.r_nom,
                tp.r_nom_jeune_fille,
                tp.r_prenom,
                tp.r_date_naissance,
                tp.r_nationalite,
                tp.r_type_piece,
                tp.r_numero_piece,
                tp.r_validite_piece,
                tp.r_ncompte_titre,
                ta.r_i as acteur_id,
                ta.r_email, 
                ta.r_telephone_prp, 
                ta.r_telephone_scd, 
                ta.r_adresse, 
                ta.r_statut,
                ta.r_profil_investisseur,
                ta.r_langue,
                ta.r_date_creer, 
                ta.r_date_modif, 
                ta.r_date_activation,
                ta.e_type_acteur
            FROM ${this.tableName} As tp, ${acteur_table} As ta 
            WHERE ta.r_i=tp.e_acteur AND tp.r_i=$1`, [id]);
        return (await res).rows[0];
    },

    async updateCompteTitre(particulierId, {ncompte_titre}) {
        const res = await db.query(`
            UPDATE ${this.tableName} 
            SET r_ncompte_titre=$1 
            WHERE r_i=$2
            RETURNING *`, [ncompte_titre, particulierId]);
        return res.rows[0];
    }
}

const Entrepise = {

    tableName: '_sc_auth.t_entreprise',

    async findAll() {
        const queryString = `
            SELECT 
                te.r_i,
                te.r_raison_sociale,
                te.r_forme_juridique,
                te.r_capital_social,
                te.r_siege_social,
                te.r_compte_contribuable,
                te.r_registre_com,
                te.r_ncompte_titre,
                te.r_ncompte_espece,
                ta.r_i as acteur_id,
                ta.r_email, 
                ta.r_telephone_prp, 
                ta.r_telephone_scd, 
                ta.r_adresse, 
                ta.r_statut,
                ta.r_profil_investisseur,
                ta.r_langue,
                ta.r_date_creer, 
                ta.r_date_modif, 
                ta.r_date_activation,
                ta.e_type_acteur
            FROM ${this.tableName} As te, ${acteur_table} As ta WHERE ta.r_i=te.e_acteur`;
        const res = db.query(queryString)
        return (await res).rows;
    },

    async findById(id) {
        const res = db.query(`
            SELECT 
                te.r_i,
                te.r_raison_sociale,
                te.r_forme_juridique,
                te.r_capital_social,
                te.r_siege_social,
                te.r_compte_contribuable,
                te.r_registre_com,
                te.r_ncompte_titre,
                te.r_ncompte_espece,
                ta.r_i as acteur_id,
                ta.r_email, 
                ta.r_telephone_prp, 
                ta.r_telephone_scd, 
                ta.r_adresse, 
                ta.r_statut,
                ta.r_profil_investisseur,
                ta.r_langue,
                ta.r_date_creer, 
                ta.r_date_modif, 
                ta.r_date_activation,
                ta.e_type_acteur
            FROM ${this.tableName} As te, ${acteur_table} As ta
            WHERE ta.r_i=te.e_acteur AND te.r_i=$1`, [id]);
        return (await res).rows[0];
    }
}

module.exports = {
    Particulier, 
    Entrepise
};