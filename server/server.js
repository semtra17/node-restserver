const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("./config/config")
// Path es un paquete ya integrado en node.js que nos 
const path = require("path");


app.use(bodyParser.urlencoded({ extended: false }))

// Habilitar la carpeta public
//  el paqeute PATH nos une nuestras direcciones de conexion, para decir de alguna manera, asi las conexiones se hagan bien
app.use(express.static(path.resolve(__dirname, "../public")));




// CONFIGURACION GLOBAL DE RUTAS
app.use(require("./routes/allroutes"))

//=================CONEXION MONGO DATABASE==================
mongoose.connect(process.env.URLDB,{
    useUnifiedTopology: true,//agregar esto para que no falle mongoose
    useNewUrlParser: true,//agregar esto para que no falle mongoose
    useCreateIndex:true,//agregar esto para que no falle mongoose
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});


 
app.listen(process.env.PORT, () =>{
    console.log("Escuchando puerto",3000)
})