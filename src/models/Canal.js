const db = require('../config/database');

const Canal = {
    
    table_name: `t_canal`,
    code_colunm: `r_code`,
    code_prefix: `CANAL`,

    async findAll() {
        const res = db.query(`SELECT * FROM ${this.table_name}`, []);
        return (await res).rows;
    },

    async create(code, {r_intitule, r_description, r_pass}) {
        const date = new Date();
        const res = db.query(`
            INSERT INTO ${this.table_name} (r_code, r_pass, r_intitule, r_description, r_date_creer, r_date_modif, r_statut) 
            VALUES($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`, [code, r_pass, r_intitule, r_description, date, date, 1]);
        return (await res).rows[0];
    },
    
    async findById(id) {
        const res = db.query(`SELECT * FROM ${this.table_name} WHERE r_i=$1`, [id]);
        return (await res).rows[0];
    },

    async findByCode(code) {
        const res = db.query(`SELECT * FROM ${this.table_name} WHERE r_code=$1`, [code]);
        return (await res).rows[0];
    },

    async update(code, {r_intitule, r_description}) {
        const res = db.query(`
            UPDATE ${this.table_name}
            SET r_intitule=$1, r_description=$2, r_date_modif=$3,
            WHERE r_code=$4 RETURNING *`, [r_intitule, r_description, new Date(), code]);
        return (await res).rows[0];
    }
}

module.exports = Canal;