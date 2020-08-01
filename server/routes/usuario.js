// ===============================
// IMPORTACIONES
// ===============================

const express = require('express');
const app = express();
const Usuario = require("../models/usuario");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _= require("underscore");

const {verificaToken, verificaAdminRole} = require ("../middlewares/autenticacion");


// ===============================
// ===============================

// no es necesario definir los parentesisi de funcion al incorporar middleware com lo es el "verificaTokken"


app.get("/usuario", verificaToken, (req, res)=>{//peticion get
    
    




    let desde =  req.query.desde || 0;
    //transformo "desde" de string a numero para poder mandarlo como parametro.
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);









    //Si agregamos de parametro, en la funcion "find",vamos a buscar la cantidad de registros que posean esa propiedad. por ejemplo la propiedad "google:true", quiere decir encuentrame los usuarios creados mediante google. En esta app, no se muestra ninguno dado que ninguno fue creado de esa manera.

    //    Usuario.find({google:true})

    Usuario.find({estado:true},"nombre email edad role google estado")//agregando los nombres de cada elemento del objeto usuario se puede excluir los que no son puestos dentro.
            .skip(desde)//Salto de registros
            .limit(limite)//limite de datos o registros que van a ser devueltos
            .exec((err, usuarios)=>{

                if(err){
                    return res.status(400).json({
                       ok:false,
                       err
                   });
               }

               Usuario.countDocuments({estado:true},(err,conteo)=>{
                res.json({
                    ok:true,
                    usuarios,
                    users:conteo
                })

               })//Contar todos los registro de tipo usuario
            
               
            })//execute



    // res.json ("get usuario");




});






//"""""""""""""""""USUARIO POST"""""""""""""""""""
app.post("/usuario",[verificaToken,verificaAdminRole], (req, res)=>{//peticion post

    
    //Esto escribiria en formato json la informacion mandada desde la app.
    let body = req.body;//el body es el que aparece cuando el middleware(bodyparser) lo procese


    // introducimos el esquema usuario, dentro de nuestro nuevo usuario
    let usuario = new Usuario({
        nombre:body.nombre,
        email:body.email,
        password: bcrypt.hashSync(body.password, 10),//Uso bcrypt y encripto las contraseñas
        role:body.role,
    }); 

    usuario.save( (err, usuarioDB)=>{
        if(err){
             return res.status(400).json({
                ok:false,
                err
            });
        }

        //usuarioDB.password = null; una forma de eliminar la conrtaseña para que no sea devuelta al usuario

        res.json({
            ok:true,
            usuario :usuarioDB,
        });
    });



    
})




//"""""""""""""""""USUARIO PUT"""""""""""""""""""

app.put("/usuario/:id",[verificaToken,verificaAdminRole], (req, res)=>{//peticion put

    let id= req.params.id;
    let body =_.pick( req.body,["nombre","email","img","estado"] ) ;

    Usuario.findOneAndUpdate( id, body,{new:true, runValidators:true,}, (err, usuarioDB) => {



        if(err){
            return res.status(400).json({
               ok:false,
               err
           });
        }
        res.json ({
            ok:true,
            usuario:usuarioDB,
        });


    })


    

});






//"""""""""""""""""USUARIO DELETE"""""""""""""""""""
app.delete("/usuario/:id",[verificaToken,verificaAdminRole], (req, res)=>{//peticion post

    let id = req.params.id;
    let cambiaEstado = {
        estado:false,
    };
    // Usuario.findByIdAndRemove(id, (err,userDeleted)=>{
    Usuario.findOneAndUpdate(id, cambiaEstado,{new:true},(err,userDeleted)=>{

        if(err){
            return res.status(400).json({
               ok:false,
               err
           });
        };
        
        if(!userDeleted){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "Usuario no encontrado",
                }
            });
        }

        res.json({
            ok:true,
            usuario:userDeleted,
        })
    })

    
});


module.exports = app;