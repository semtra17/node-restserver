const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require("./config/config")

app.use(bodyParser.urlencoded({ extended: false }))

// Nuestro url para peticiones http es localhost/3000
app.get('/usuario', function (req, res) {
  res.send('get usuario')
})
app.post('/usuario', function (req, res) {
    // El req.body es la informacion mandada mediante formularios
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje: "El nombre es necesario",
        })
    }else{
            res.json({
                persona:body
            })
        }

    })
app.put('/usuario/:id', function (req, res) {
    // req.params es para obtener la informacion mandada por el url osea los parametros
    let id = req.params.id;


    res.json({
        id,
    })
})
app.delete('/usuario', function (req, res) {
  res.send('delete usuario')
})
 
app.listen(process.env.PORT, () =>{
    console.log("Escuchando puerto",3000)
})