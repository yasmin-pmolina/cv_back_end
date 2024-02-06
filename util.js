const config = require('./config.js'); 
const fs = require('fs');
const path = require('path');
const multer = require('multer'); 

function readJsonFile(file) {
   
    try {  
      const data = fs.readFileSync(file, {encoding:'utf8', flag:'r'});
      // Parsea el contenido JSON en un objeto JavaScript
      const userData = JSON.parse(data);
      return userData; // Devuelve los datos si es necesario
    } catch (error) {
      throw error; 
    }
}

// Configura multer para manejar la carga de archivos PDF
const uploadPdf = multer({ 
  dest: 'uploads/', // Directorio donde se guardarán los archivos PDF
  fileFilter: (req, file, callback) => {
    // Verifica que el archivo tenga una extensión válida (PDF en este caso)
    if (!file.originalname.match(/\.(pdf)$/)) {
      return callback(new Error('El archivo debe tener extensión PDF'));
    }
    callback(null, true);
  }
});

function uploadFilePdf(filePdf) {
  const upload = multer({ 
    dest: filePdf /*, // Directorio donde se guardarán los archivos PDF
    fileFilter: (req, file, callback) => {
      // Verifica que el archivo tenga una extensión válida (PDF en este caso)
      if (!file.originalname.match(/\.(pdf)$/)) {
        return callback(new Error('El archivo debe tener extensión PDF'));
      }
      callback(null, true);
    }*/
  })

  return upload.single('pdf');
}

function sendFilePdf(res, rutaAbsoluta, nombreArchivo) {
  fs.readFile(rutaAbsoluta, (error, data) => {
    if (error) {
      return res.status(404).json({ error: 'Archivo PDF no encontrado' });
    }
    // Configura las cabeceras de la respuesta para indicar que se envía un archivo PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}.pdf"`);

    // Envía el contenido del archivo PDF como respuesta
    res.send(data);
  });
}

let users = [];

module.exports.readJsonFile = readJsonFile;
module.exports.uploadPdf = uploadPdf;
module.exports.uploadFilePdf = uploadFilePdf;
module.exports.sendFilePdf = sendFilePdf;
module.exports.users = users;