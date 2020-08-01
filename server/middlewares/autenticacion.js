// ===============================
// verificar TOken
// ===============================
const jwt = require("jsonwebtoken");
// el next continua con la ejecucion del programa
let verificaToken = (req,res,next)=>{
    // para obtener los headers se utiliza el req.get()
    let token = req.get("token");

    // res.json({
    //     token:token
    // })

    jwt.verify(token, process.env.SEED, (err,decoded)=>{
        if(err){
            // status401 UNAUTHORIZED
            return res.status(401).json({
                ok:false,
                err:{
                    message:"Token INVALIDO"
                }
            });
        }
    // YO se que dentro del objeto que encripte viene le usuario decoded.usuario es el payload, la informacion del usuario
        req.usuario = decoded.usuario;
        next();


    });
    



};

// ===============================
// verificar admin role
// ===============================

let verificaAdminRole = (req,res,next)=>{


    let usuario = req.usuario;


    if(usuario.role !== "ADMIN_ROLE"){
        return res.status(401).json({
            ok:false,
            err:{
                message:"El usuario no es administrador",
            }
        });
    }
    next();
    
}


module.exports = {
    verificaToken,
    verificaAdminRole
}