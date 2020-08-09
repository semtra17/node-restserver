const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();

const fs = require("fs");
const path = require("path");




const Usuario = require("../models/usuario");
const Producto = require("../models/producto");


// Default option


app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Nuestro tipo en parametros nos va a dar la pauta hacia donde va  aparar las imagenes o archivos subidos

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: "No se ha seleccionado ningun archivo"
                }
            })
    }


    // Validar TIPO
    let tiposValidos = ["productos", "usuarios"];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Las tipos permitidas son " + tiposValidos.join(", "),
            }
        })

    }








    // archivo es el nombre que le ponemos a la variable que va a entrar por el body(postman)

    // Extensiones validas
    let archivo = req.files.archivo;
    let extesionesVAlidas = ["png", "jpg", "jpeg", "gif"];
    let nombreSeparado = archivo.name.split(".")

    // Quiero obtener el tipo de extension y no el nombre del archivo
    let extension = nombreSeparado[nombreSeparado.length - 1];

    if (extesionesVAlidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "Las extensiones permitidas son " + extesionesVAlidas.join(", "),
                ext: extension,
            }
        });
    }

    // CAmbiar nombre al archivo
    // 183912kuasdkawdokaosd-123.jpg
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;



    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (tipo === "usuarios") {

            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }

    });

});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, "usuarios");
            return res.status(500).json({
                ok: false,
                err,
            })
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no existe"
                }
            })
        }


        borrarArchivo(usuarioDB.img, "usuarios");

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {
            // A pesar del error o que el usuarioDB no exista, sellama igual la funcion borrar archivo porque se evita de llenar el servidor de basura, sino se haria la imagen que se intenta subir, se subiria igual.


            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    })


}

function imagenProducto(id, res, nombreArchivo) {


    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err,
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Producto no existe"
                }
            })
        }



        borrarArchivo(productoDB.img, "productos");

        productoDB.img = nombreArchivo;


        productoDB.save((err, productoGuardado) => {
            // A pesar del error o que el usuarioDB no exista, sellama igual la funcion borrar archivo porque se evita de llenar el servidor de basura, sino se haria la imagen que se intenta subir, se subiria igual.


            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo,
            })
        })
    })
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}



module.exports = app;