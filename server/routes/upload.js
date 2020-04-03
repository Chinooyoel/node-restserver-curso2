const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

let app = express();
let Usuario = require("../models/usuario")
let Producto = require("../models/producto")

app.use(fileUpload());

app.put("/upload/:tipo/:id", (req, res) => {
    if (!req.files.archivo){
        return res.status(500).json({
            ok: false,
            message: "No se selecciono ningun archivo"
        })
    }

    let tipo = req.params.tipo;
    let id = req.params.id;

    let tiposValidos = ["usuarios", "productos"];

    if( tiposValidos.indexOf(tipo) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Extensiones validas: " + tiposValidos.join(", ")
        })
    }

    let archivo = req.files.archivo;
    let nombreCortado= req.files.archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    let extensionesValidas = ["jpg", "jpeg", "png", "ico"];

    if( extensionesValidas.indexOf( extension ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: "Extensiones validas: " + extensionesValidas.join(", ")
        })
    }

    let nombreArchivo =  `${id}--${ new Date().getMilliseconds()}.${extension}`;

    archivo.mv( `./uploads/${ tipo }/${ nombreArchivo }`, ( err ) => {
        if(err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        if( tipo === "usuarios"){
            imagenUsuario(id, res, nombreArchivo)
        }else{
            imagenProducto(id, res, nombreArchivo)
        }
        
    })
})


let imagenUsuario = (id, res, nombreArchivo) => {
    Usuario.findById(id, ( err, usuarioDB ) => {
        if( err ) {
            borrarArchivo( nombreArchivo, "usuarios");
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!usuarioDB) {
            borrarArchivo( nombreArchivo, "usuarios");
            return res.status(400).json({
                ok: false,
                message: "Usuario no encontrado"
            })
        }
        
        borrarArchivo( usuarioDB.img, "usuarios");

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuarioGuardado
            })
        })

    })
}

let imagenProducto = (id, res, nombreArchivo) => {
    Producto.findById(id, ( err, productoDB ) => {
        if( err ) {
            borrarArchivo(nombreArchivo, "productos")
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, "productos")
            return res.status(400).json({
                ok: false,
                message: "Producto no encontrado"
            })
        }

        borrarArchivo( productoDB.img, "productos");

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado
            })
        })
    })
}

let borrarArchivo = ( nombreArchivo, tipo ) => {
    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreArchivo }`);
    if ( fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;