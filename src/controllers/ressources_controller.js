const TypeActeur = require("../models/TypeActeur"); 
const default_data = require('../config/default_data');
const response = require("../middlewares/response");

const getCivilities = async (req, res, next) => {
    console.log("Récupération des civilités...");
    return response(res, 200, "Liste des civilités", default_data.civilites);
}

const getTypePieces = async (req, res, next) => {
    console.log("Récupération des types pièces...");
    response(res, 200, "Liste des types pièces", default_data.type_pieces);
}

module.exports = {
    getCivilities,
    getTypePieces,
}