const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const _= require("underscore");
const express = require('express');
const app = express();
const Usuario = require("../models/usuario");


app.post("/login",(req,res)=>{

    let body = req.body;
    
    Usuario.findOne({email:body.email}, (err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
               ok:false,
               err
           });
       }
       if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "Usuario o contraseña incorrectos"
                }
            });
       }
    //    bcrypt encriptamos la contraseña ingresada por el usuario, asi comparamos cada encriptacion sin desencriptar ninguna
       
        if(!bcrypt.compareSync(body.password, usuarioDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message: "Usuario o contraseña incorrectos"
                }
            });
        }
        let token =jwt.sign({
            usuario:usuarioDB,
        },"este es el seed desarrolo", { expiresIn: process.env.CADUCIDAD_TOKEN})
        res.json({
            ok:true,
            usuario:usuarioDB,
            token
        })

    })





})













module.exports = app;