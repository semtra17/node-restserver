const express = require("express");
let {verificaToken,verificaAdminRole}  =   require("../middlewares/autenticacion");
let app = express();


let Producto = require("../models/producto");


// =================================
//  Obtener Productos
// =================================

app.get("/productos",verificaToken,(req,res)=>{
    let desde = req.query.desde || 0 ;
    desde = Number(desde);

    Producto.find({disponible:true,})
    .skip(desde)
    .limit(5)
    .sort("nombre")
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        res.json({
            ok:true,
            productos:productoDB,
        })
    })


    
})

// ========================
// obtenemos un producto
// =====================
app.get("/productos/:id",verificaToken,(req,res)=>{
    
    let id = req.params.id;

    Producto.findById(id)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err,productoDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if(!productoDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }
        res.status(201).json({
            ok:true,
            productos:productoDB,
        })
    })


});

// ========================
// Actualizamos un producto
// =====================


app.put("/productos/:id",verificaToken,(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let descProducto = {
       
    }

    Producto.findById( id, (err, productoDB) => {
        
        if(err){
            return res.status(500).json({
               ok:false,
               err
           });
        }


        if(!productoDB){
            return res.status(400).json({
               ok:false,
               err
           });
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                   ok:false,
                   err
               });
            }
            res.json ({
                ok:true,
                producto:productoDB,
            });
    
        });
       

    })

    


    
})

// ========================
// Creamos un producto
// =====================

app.post("/productos",verificaToken,(req,  res)=>{

    let body = req.body

    let producto = new Producto({
        usuario:req.usuario._id,
        nombre:body.nombre,
        precioUni:body.precioUni,
        descripcion:body.descripcion,
        disponible:body.disponible,
        categoria:body.categoria
    })

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(400).json({
               ok:false,
               err
           });
        }
        if(!productoDB){
            return res.status(500).json({
               ok:false,
               err
           });
        }

        res.json({
            ok:true,
            producto :productoDB,
        });

        
    });


})

// ========================
// Buscar productos
// =====================
app.get("/productos/buscar/:termino",verificaToken,(req,res)=>{

    let termino = req.params.termino;

    let regex = RegExp(termino, "i");

    Producto.find({nombre: regex})
    .populate("categoria","nombre")
    .exec((err,productos)=>{
        if(err){
            return res.status(500).json({
               ok:false,
               err
           });
        }

        res.json({
            ok:true,
            productos,
        });


    })




})


// ========================
// Eliminamos un producto
// =====================

app.delete("/productos/:id",[verificaToken,verificaAdminRole],(req,  res)=>{

    let id = req.params.id;
    let cambiaEstado = {
        disponible:false,
    }

    Producto.findOneAndUpdate( id,cambiaEstado,{new:true},(err, productoDeleted) => {
        
        if(err){
            return res.status(500).json({
               ok:false,
               err
           });
        }
        if(!productoDeleted){
            return res.status(500).json({
               ok:false,
               err:{
                   message:"La categoria no existe"
               }
           });
        }

        res.json ({
            ok:true,
            produto: productoDeleted,
            message:"Producto Borrado",
        });


    })

});

module.exports = app;