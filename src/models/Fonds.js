const db = require('../config/database');

const Fonds = {

    tableName: 't_fonds',
    codePrefix: 'FCP',
    codeColumn: 'r_code',
    codeSpliter: '-',

    async findAll() {
        const res = db.query(`SELECT * FROM ${this.tableName} WHERE r_statut=$1`, [1]);
        return (await res).rows;
    },

    async create(code, {intitule, description, commission_souscription, commission_sortie}) {
        const create_date = new Date();
        const res = db.query(`INSERT INTO ${this.tableName}(
                r_code,
                r_intitule,
                r_description,
                r_date_creer,
                r_date_modif,
                r_statut,
                commission_souscription,
                commission_sortie)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING 
                r_i,
                r_code, 
                r_intitule, 
                r_description,
                commission_souscription,
                commission_sortie`, 
            [code, intitule, description, create_date, create_date, 1, commission_souscription, commission_sortie]);

        return (await res).rows[0];
    },

    async findById(id) {
        const res = db.query(`
            SELECT 
                r_code, 
                r_intitule, 
                r_description, 
                commission_souscription, 
                commission_sortie
            FROM ${this.tableName}
            WHERE r_i=$1 AND r_statut=$2`, [id, 1]);
        return (await res).rows[0];
    },

    async findByCode(code) {
        const res = db.query(`
            SELECT r_i,
                r_code, 
                r_intitule, 
                r_description, 
                commission_souscription, 
                commission_sortie
            FROM ${this.tableName}
            WHERE r_code=$1 AND r_statut=$2`, [code, 1]);
        return (await res).rows[0];
    },

    async findByIntitule(intitule) {
        const res = db.query(`
            SELECT r_i,
                r_code, 
                r_intitule, 
                r_description, 
                commission_souscription, 
                commission_sortie
            FROM ${this.tableName}
            WHERE r_intitule=$1 AND r_statut=$2`, [intitule, 1]);
        return (await res).rows[0];
    }

}

module.exports = Fonds;