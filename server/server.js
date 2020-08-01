const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("./config/config")



app.use(bodyParser.urlencoded({ extended: false }))



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