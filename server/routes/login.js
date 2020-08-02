const bcrypt = require("bcrypt");
var jwt = require('jsonwebtoken');
const _= require("underscore");
const express = require('express');
const app = express();
const Usuario = require("../models/usuario");

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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





});
// CONFIGURACIONES DE GOOGLE
// CONFIGURACIONES DE GOOGLE
// CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true,
    }


    
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
}


app.post("/google", async (req,res)=>{
    // esat informacion pasa por la funcion verify de google
    // Si se logea alguien, obtenemos todos sus datos y sos datos los tendra la variable googleUser
    let token   = req.body.idtoken;
    let googleUser = await verify(token)
                    .catch(e =>{
                        return res.status(403).json({
                            ok:false,
                            err:e,
                        })
                    });


    Usuario.findOne({email:googleUser.email},  (err, usuarioDB)=>{

        if(err){
            return res.status(500).json({
                ok:false,
                err,
            });
        }


        // SI existe este usuario y uso el metodo normal sin google, se lo rechaza por login googlem debe ingresar como creo su cuenta
        if(usuarioDB){
            if(usuarioDB.google === false){
                return res.status(500).json({
                    ok:false,
                    err:{
                        message:"DEBE DE USAR SU AUTENTICACION NORMAL"
                    }
                });
            }
            else{
                // si no es asi, lo desencripto de la base de datos y se lo devuelvo al fornt end

                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token,
                })

            }
        }else{
            // ese else es por si no existe el usuario en nuestra base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ":/"

            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:true,
                        usuario:usuarioDB,
                        token,
                    })
                }
                
                let token = jwt.sign({
                    usuario:usuarioDB
                }, process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token,
                })

            });


        }






    });
})













module.exports = app;