
const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

// CREAMOS ESQUEMA MONGOOSE
let Schema = mongoose.Schema;

let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE"],
    message: "{VALUE} no es un rol válido", 
}



//Nnuevo esquema
let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required: [true,"el nombre es necesario"],
    },
    email:{
        type: String,
        unique:true,
        required:[true,"El email es obligatorio"],
    },
    password:{
        type: String,
        required:[true,"El password es obligatorio"],
    },
    img:{
        type:String,
        required:false,//No es obligat
    },
    role:{
        type:String,
        default:"USER_ROLE",
        enum: rolesValidos,//Introducimos los unicos roles que puede haber, asi validemos su entrada
    },
    estado:{
        type:Boolean,
        default:true,
    },//BOOLEAN
    google:{
        type:Boolean,
        default:false,
    },//BOOLEAN
});

//segunda forma de sacar la contraseña del frontend.NO USAR FUNCION FLECHA.
usuarioSchema.methods.toJSON = function() {

    let user = this; // obtenemos el usuario en formato JSON
    let userObject = user.toObject(); // lo convertimos a un objeto y guardamos en otra variable
    delete userObject.password;// eliminamos la informacion de la contraseña del objeto, solo esta en la base de datos
    return userObject; //devolvemos el objeto sin la contraseña, asi no se muestre en el frontend.

}

// Agregamos el plugin para poder personalizar errores por validaciones de datos
usuarioSchema.plugin(uniqueValidator, {message: "{PATH} debe de ser único" });
//Exportamos el esquema pero dentro del modelo usuario es decir, podemos poner el esquema creado es muchos modelos, no es solo uno.
module.exports = mongoose.model("Usuario", usuarioSchema);