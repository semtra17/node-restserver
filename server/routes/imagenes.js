const express = require("express");
const app = express();
const { verificaTokenImg } = require("../middlewares/autenticacion");
const path = require("path");

const fs = require("fs");

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;


    // Este path nos va a servir para saber si existe una imagen diferente, sino, mostramos no-image.jpg
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        // Creamos el path unico asi podemas mandarlo por el sendFile
        let noImagePath = path.resolve(__dirname, "../assets/no-image.jpg");

        res.sendFile(noImagePath);

    }



})





module.exports = app;