const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


const Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true

    },
    usuarioID: {
        type: Schema.Types.ObjectId,
        required: true
    }
})



module.exports= mongoose.model("Categoria", categoriaSchema);