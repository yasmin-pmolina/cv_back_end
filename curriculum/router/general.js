const express = require('express');
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const config = require('../config.js'); 
const readJsonFile = require('../util').readJsonFile;
const uploadPdf = require('../util').uploadPdf;
const uploadFilePdf = require('../util').uploadFilePdf;
const sendFilePdf = require('../util').sendFilePdf;
const path = require('path');
const fs = require('fs');

// endpoint '/' 
public_users.get('/contact', async function (req, res) {

  try {

    const { language, applicant } = req.query;
    if (!language || !applicant) {
      return res.status(400).json({ error: 'missing information required for consultation'});
    }
    
    let rutaRelativa = `..\\models\\users\\${applicant}\\${language}\\userData.json`;
    const rutaAbsoluta = path.resolve(__dirname, rutaRelativa);

    const bookDetails = await readJsonFile(rutaAbsoluta);

    if(bookDetails){
      return res.status(200).json(bookDetails);
    }
  
    return res.status(404).json({message: `applicant information (${rutaAbsoluta}) not found`});
} catch (error) {

  return res.status(404).json({message: error.message });
}
   
});  


// Ruta para recibir el archivo PDF y determinar su tipo
public_users.post('/contact/:certificates', (req, res) => {

  certificates = req.params.certificates;

  const { language, applicant } = req.query;

  if (!language || !applicant) {      
    return res.status(400).json({ error: 'missing information required for consultation'});
  }
    
  let rutaRelativa = `..\\models\\users\\${applicant}\\${language}\\certificates\\${certificates}`;
  const rutaAbsoluta = path.resolve(__dirname, rutaRelativa);

  // Llama a cargarArchivosPDF con la ruta personalizada para esta solicitud
  const middlewareMulter = uploadFilePdf(rutaAbsoluta);

  // Ejecuta el middleware Multer para esta solicitud
  middlewareMulter(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ error: 'Error al cargar el archivo PDF' });
    }
  });
});
  

// Ruta para enviar un archivo PDF por su nombre
public_users.get('/download/:certificates', (req, res) => {
  // Obtén el nombre del archivo PDF desde la consulta (query parameter)
  certificates = req.params.certificates;

  const { language, applicant } = req.query;

  if (!language || !applicant) {      
    return res.status(400).json({ error: 'missing information required for consultation'});
  }
    
  let rutaRelativa = `..\\models\\users\\${applicant}\\${language}\\certificates\\${certificates}.pdf`;
  const rutaAbsoluta = path.resolve(__dirname, rutaRelativa);

  sendFilePdf(res,rutaAbsoluta,certificates)
  // Lee el archivo PDF y envíalo como respuesta

});

/*
public_users.get('/', function (req, res) {

  const url =  `${config.apiUrl}:${config.port}/books/`;
  axios.get(url)  
    .then((response) => {
      res.status(200).json({ books: response.data });
    })
    .catch((error) => {
      res.status(500).json(`Error interno del servidor ${error.message} `);
    });
});
*/

module.exports.general = public_users;
