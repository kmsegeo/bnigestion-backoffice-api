const errorhandling = require('./src/middlewares/error_handler'); 
require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 

const bodyParser = require('body-parser'); 
const defaultController = require('./src/controllers/default_controller'); 
const authRoutes = require('./src/routes/auth_routes'); 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 

const base_path = '/v1'

app.use(`${base_path}/auth`, authRoutes);

// Error handling middlware 

app.use(errorhandling); 

// Default data

console.log("Initialisation des données par défaut..");
defaultController.defaultCanals().then(() => {
defaultController.defaultTypeActeur().then(() => {
defaultController.defaultOperations().then(() => {
defaultController.defaultTypeDocument().then(() => {
defaultController.defaultProfil().then(() => {
defaultController.defaultAdmin().then(() => {
    console.log("Initialisation terminée");
});});});});});});

module.exports = app; 