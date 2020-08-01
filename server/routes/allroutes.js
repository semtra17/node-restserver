const express = require('express');
const app = express();
// CONFIGURACION GLOBAL DE RUTAS
app.use(require("./usuario"));
app.use(require("./login"));



module.exports = app;