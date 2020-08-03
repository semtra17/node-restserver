const express = require("express");
const _= require("underscore");
let {verificaToken, verificaAdminRole}  =   require("../middlewares/autenticacion");

let app = express();

let Categoria = require("../models/categoria");




// ======================================
// MOSTRAR TODAS LAS CATEGORIAS
// ======================================
app.get("/categoria",verificaToken,(req,  res)=>{

    
        Categoria.find({})
        .sort("descripcion")
        .populate("usuario", "nombre email")
        .exec((err,categorias)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                });
            }
            res.json({
                ok:true,
                categorias,
            })
        })
    

})

// ======================================
// MOSTRAR UNA CATEGORIA POR ID
// ======================================

app.get("/categoria/:id",verificaToken,(req,  res)=>{

    let id = req.params.id;

    Categoria.findById(id)
    .exec((err,categorias)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        if(!categorias){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            categoria: categorias,
        })
    })


})
app.put("/categoria/:id",verificaToken,(req,  res)=>{

    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion,
    }

    Categoria.findOneAndUpdate( id, body,{new:true, runValidators:true,}, (err, categoriaDB) => {
        
        if(err){
            return res.status(500).json({
               ok:false,
               err
           });
        }


        if(!categoriaDB){
            return res.status(400).json({
               ok:false,
               err
           });
        }

        res.json ({
            ok:true,
            categoria:categoriaDB,
        });


    })

});

// ======================================
// MOSTRAR UNA CATEGORIA POR ID
// ======================================

app.post("/categoria",verificaToken,(req,  res)=>{

    let body = req.body

    let categoria = new Categoria({
        descripcion:body.descripcion,
        usuario:req.usuario._id,
    })

    categoria.save((err, categoriaDB)=>{
        if(err){
            return res.status(400).json({
               ok:false,
               err
           });
        }
        if(!categoriaDB){
            return res.status(500).json({
               ok:false,
               err
           });
        }

        res.json({
            ok:true,
            categoria :categoriaDB,
        });

        
    });


})

app.delete("/categoria/:id",[verificaToken,verificaAdminRole],(req,  res)=>{

    let id = req.params.id;


    Categoria.findOneAndRemove( id,(err, categoriaDeleted) => {
        
        if(err){
            return res.status(500).json({
               ok:false,
               err
           });
        }
        if(!categoriaDeleted){
            return res.status(500).json({
               ok:false,
               err:{
                   message:"La categoria no existe"
               }
           });
        }

        res.json ({
            ok:true,
            categoria:categoriaDeleted,
            message:"Categoria borrada",
        });


    })

});



module.exports = app;