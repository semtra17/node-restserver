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