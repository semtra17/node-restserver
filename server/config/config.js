// Este archivo es para definir los entornos, produccion o desarrollo


// Process es un objeto que esta corriendo siempre con node que es una configuracion predeterminada del puerto al que se conecta nuestra app

// ============================
// Puerto
// ============================

process.env.PORT = process.env.PORT || 3000;
// ============================
// Entorno
// ============================

// NODE_ENV es la variable que nos da heroku para saber si nuestro sistema esta desplegado en el
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

// ============================
// Vencimiento el Token             
// ============================
// 60 segundos
//  60 minutos
//  24horas
//  30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 *30;


// ============================
// SEED o SIGN de autenticacion
// ============================
process.env.SEED = process.env.SEED || "este es el seed desarrolo"








// ============================
// BASE DE DATOS
// ============================
let urlDB;

if(process.env.NODE_ENV === "dev"){
    urlDB = "mongodb://localhost:27017/cafe"
}else{
    urlDB = process.env.MONGO_URI
}

// inventamos un enviroment para poder manipularlo
process.env.URLDB = urlDB;

// ============================
// Google CLient ID
// ============================

process.env.CLIENT_ID = process.env.CLIENT_ID || "469622746469-hbmbfu7qcg0k3go88i5sho86eermrvqp.apps.googleusercontent.com";
