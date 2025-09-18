const errorhandling = require('./src/middlewares/error_handler'); 
require('dotenv').config(); 
const express = require('express'); 
const cors = require('cors'); 

const swaggerUI = require('swagger-ui-express');
const swaggerDocument = require('./swagger-outpout.json');
const bodyParser = require('body-parser'); 
const defaultController = require('./src/controllers/default_controller'); 
const authRoutes = require('./src/routes/auth_routes'); 
const clientRoutes = require('./src/routes/client_routes');
const fondsRoutes = require('./src/routes/fonds_routes');
const operationRoutes = require('./src/routes/operation_routes');

const app = express(); 

app.use(cors()); 
app.use(express.json()); 

app.use(bodyParser.json({limit: '50mb'})); 
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 

const base_path = '/v1'

app.use(base_path + '/auth', authRoutes);
app.use(base_path + '/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(base_path + '/fonds', fondsRoutes);
app.use(base_path + '/acteurs/clients', clientRoutes);

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