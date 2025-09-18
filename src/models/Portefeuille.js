const db = require('../config/database');

const Portefeuille = {

    tableName: '_sc_gestion.t_portefeuille',

    async findAll() {
        const res = db.query(`SELECT * FROM ${this.tableName}`, []);
        return (await res).rows;
    },

    async findAllByActeurId(id) {
        const res = db.query(`SELECT * FROM ${this.tableName} WHERE e_acteur=$1`, [id]);
        return (await res).rows;
    },

    async valid(id) {
        const res = db.query(`UPDATE ${this.tableName} SET r_statut=$1 WHERE e_operation=$2 RETURNING *`, [1, id]);
        return (await res).rows[0];
    },

    async rejected(id) {
        const res = db.query(`UPDATE ${this.tableName} SET r_statut=$1 WHERE e_operation=$2 RETURNING *`, [2, id]);
        return (await res).rows[0];
    }
}

module.exports = Portefeuille;