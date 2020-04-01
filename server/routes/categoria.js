const express = require("express");

const app = express();

const { verificarToken, verificarRole } = require("../middleware/autenticacion");

const Categoria = require("../models/categoria");


//==============================
//  MOSTRAR TODAS LAS CATEGORIAS
//==============================
app.get("/categoria", (req, res) => {

    Categoria.find({})
        .sort("nombre")
        .populate("usuarioID")
        .exec(( err, categoriasDB) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if(!categoriasDB) {
                return res.status(500).json({
                    ok:false,
                    message: "No hay categorias cargadas"
                })
            }
    
            res.json({
                ok: true,
                categoriasDB
            })
        })
    
    })


//==============================
//  MOSTRAR UNA CATEGORIA POR ID
//==============================
app.get("/categoria/:id", (req, res) => {
    let id = req.params.id;

    Categoria.find({ _id: id }, ( err, categoriaDB ) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!categoriaDB) {
            return res.status(400).json({
                ok:false,
                message: "No se encontro la categoria"
            })
        }

        res.json({
            ok: true,
            categoriaDB
        })
    })

})


//==============================
//  CREA UNA NUEVA CATEGORIA
//==============================
app.post("/categoria", verificarToken, ( req, res ) => {
    
    let usuarioID = req.usuario._id;
    let body = req.body;
    
    let categoria = new Categoria({
        nombre : body.nombre,
        usuarioID : usuarioID
    })

    categoria.save({new: true, runValidators: true},( err, categoriaDB) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }       

        res.json({
            ok: true,
            categoriaDB
        })
    })
})


//==============================
//  ACTUALIZA UNA CATEGORIA
//==============================
app.put("/categoria/:id",( req, res ) => {
    let id = req.params.id;
    let body = req.body;

    Categoria.findOneAndUpdate({ _id: id }, { nombre: req.body.nombre }, {new: true, runValidators: true}, ( err, categoriaDB ) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }   

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }      

        res.json({ 
            ok: true,
            categoriaDB
        })

    })
})

//==============================
//  BORRAR UNA CATEGORIA
//==============================
app.delete("/categoria/:id", [verificarToken, verificarRole], ( req, res ) => {
    let id = req.params.id;
    
    Categoria.remove({_id:id}, ( err, categoriaDB ) => {
        if( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }   
        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                message: "La categoria no existe"
            })
        }   
        res.json({ 
            ok: true,
            categoriaBorrada: categoriaDB
        })       
    })
})

module.exports = app;