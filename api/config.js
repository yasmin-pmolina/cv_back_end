 /*
//Configuracion local 
module.exports = {
    apiUrl: 'http://localhost',
    port: '5000',
    superUser: {"username":"yasmin-molina", "password":"123"}
 };
*/

 module.exports = {
    apiUrl: 'https://yasmin-pmolina.github.io/cv_back_end',
    port: process.env.PORT || '8080'  ,
    superUser: {"username":"yasmin-molina", "password":"123"}
 };