const mongoose = require("mongoose");
const uniquevalidator = require("mongoose-unique-validator");

let Schema = mongoose.Schema;

let roleValidos = {
    values : ["USER_ROLE", "ADMIN_ROLE"],
    message : "{PATH} Role invalido"
}

let usuarioSchema = new Schema({
    nombre : {
        type : String,
        required : [true, "Es necesario el nombre"]
    },
    email : {
        type : String,
        unique : true,
        required : [true, "Es necesario el email"]
    },
    password : {
        type : String,
        required : [true, "Es necesario el password"]
    },
    google: {
        type : Boolean,
        default: false
    },
    role : {
        type : String,
        default: "USER_ROLE",
        enum : roleValidos
    },
    img : {
        type : String,
        required: false
    },
    estado : {
        type : Object,
        default: true
    }
})

usuarioSchema.plugin(uniquevalidator, { message : "{PATH} no se permite duplicados"});

module.exports = mongoose.model("Usuarios", usuarioSchema);