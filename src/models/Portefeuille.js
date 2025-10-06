const db = require('../config/database');

const Portefeuille = {

    tableName: '_sc_gestion.t_portefeuille',

    async findAll() {
        const res = db.query(`SELECT * FROM ${this.tableName}`, []);
        return (await res).rows;
    },

    async findAllByActeurId(acteurId) {
        const res = db.query(`SELECT * FROM ${this.tableName} WHERE e_acteur=$1`, [acteurId]);
        return (await res).rows;
    },

    async valid(op) {
        const res = db.query(`UPDATE ${this.tableName} SET r_statut=$1 WHERE e_operation=$2 RETURNING *`, [1, op]);
        return (await res).rows[0];
    },

    async rejected(op) {
        const res = db.query(`UPDATE ${this.tableName} SET r_statut=$1 WHERE e_operation=$2 RETURNING *`, [2, op]);
        return (await res).rows[0];
    }
}

module.exports = Portefeuille;