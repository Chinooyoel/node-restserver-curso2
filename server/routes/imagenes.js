const express = require("express");
const path = require("path");
const fs = require("fs");
const { verificarTokenImg } = require("../middleware/autenticacion");

let app = express();

app.get("/imagen/:tipo/:img", verificarTokenImg, ( req, res ) => {
    let img = req.params.img;
    let tipo = req.params.tipo;


    
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ img }`)
    console.log(pathImagen)
    if( fs.existsSync( pathImagen )) {
        return res.sendFile( pathImagen );
    }

    let noImagen = path.resolve(__dirname, "../assets/original.jpg");

    res.sendFile(noImagen);
})

module.exports=app;