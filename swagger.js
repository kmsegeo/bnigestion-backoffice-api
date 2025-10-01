const swaggerAutogen = require('swagger-autogen');

const doc = {
    info: {
        title: 'BNI Gestion - Backoffice API',
        version: process.env.VERSION,
        description: `Application backoffice de gestion de fonds commun de placement`,
    },
    host: '192.168.20.38/bnigestion_api_bk',
    // host: 'localhost:3003',
    schemes: ['http']
};

const outpoutFile = './swagger-outpout.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outpoutFile, endpointsFiles, doc).then(()=>{
    require('./app.js');
});