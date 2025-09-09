const db = require('../config/database');

const Agent = {  

  tableName: 't_agent',

  async findAll() {
    // const queryString = `
    //   SELECT ag.*, ac.r_nom_complet, ac.r_email, ac.r_telephone_prp, ac.r_telephone_scd, ac.r_adresse, ac.r_date_activation, ac.r_langue, ac.r_statut
    //   FROM ${this.tableName} As ag 
    //   INNER JOIN t_acteur As ac
    //   ON ac.e_agent=ag.r_i`;
    const queryString = `SELECT * FROM ${this.tableName}`;
    const res = db.query(queryString);
    return (await res).rows;
  },

  async create({r_civilite, r_nom, r_prenom, profil_code, e_acteur}) {
    const queryString = `INSERT INTO ${this.tableName} (r_civilite, r_nom, r_prenom, e_profil, e_acteur)
      VALUES($1, $2, $3, (SELECT r_i FROM t_profil WHERE r_code=$4), $5) RETURNING *`;
    const res = db.query(queryString, [r_civilite, r_nom, r_prenom, profil_code, e_acteur]);
    return (await res).rows[0];
  },

  async findById(id) {
    const queryString = `
      SELECT ag.*, ac.r_nom_complet, ac.r_email, ac.r_telephone_prp, ac.r_telephone_scd, ac.r_adresse, ac.r_date_activation, ac.r_langue, ac.r_statut 
      FROM ${this.tableName} As ag 
      INNER JOIN t_acteur As ac
      ON ac.e_agent=ag.r_i
      WHERE ag.r_i = $1`;
    const res = db.query(queryString, [id]);
    return (await res).rows[0];
  },
  
  async update(id, {r_civilite, r_nom, r_prenom, e_profil}) {
    const queryString = `UPDATE ${this.tableName} SET r_civilite=$1, r_nom=$2, r_prenom=$3, e_profil=$4 WHERE r_i=$5 RETURNING *`;
    const res = db.query(queryString, [r_civilite, r_nom, r_prenom, e_profil, id])
    return (await res).rows[0];
  }

}

module.exports = Agent;