const express = require("express");

const { verificarToken } = require("../middleware/autenticacion");

let Producto = require("../models/producto");

let app = express();

// ====================================
// MOSTRAR TODOS LOS PRODUCTOS PRODUCTOS
// ====================================
app.get("/producto", verificarToken, ( req, res ) => {

    Producto.find({ disponible : true})
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .limit(5)
        .exec( ( err, productosDB ) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productosDB) {
                return res.status(400).json({
                    ok:false,
                    message: "No hay productos cargados en la BD"
                })
            }

            res.json({
                ok: true,
                productosDB
            })
        })

})

// ====================================
// OBTENER UN PRODUCTO POR ID
// ====================================
app.get("/producto/:id", verificarToken, ( req, res ) => {

    let id = req.params.id;

    Producto.findOne({_id : id})
        .populate("usuario", "nombre email")
        .populate("categoria", "descripcion")
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productoDB) {
                return res.status(400).json({
                    ok:false,
                    message: "El producto solitado no existe"
                })
            }

            res.json({
                ok: true,
                productoDB
            })
    })
})

// ====================================
// BUSCADOR DE PRODUCTOS
// ====================================
app.get("/producto/buscar/:termino", verificarToken, ( req, res ) => {
    let termino = req.params.termino;

    let expresion_regular = new RegExp(termino, "i");

    Producto.find({ nombre: expresion_regular })
        .limit(5)
        .exec( (err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productosDB) {
                return res.status(400).json({
                    ok:false,
                    message: "El producto solitado no existe"
                })
            }

            res.json({
                ok: true,
                productosDB
            })
        })
})
// ====================================
// CREAR UN PRODUCTO
// ====================================
app.post("/producto", verificarToken, (req, res ) => {
    let body = req.body;
    let usuario = req.usuario;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id
    })

    producto.save(( err, productoDB ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoDB
        })     
    })
})

// ====================================
// ACTUALIZAR UN PRODUCTO
// ====================================
app.put("/producto/:id", verificarToken, ( req, res ) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findOne({_id: id},  ( err, productoDB ) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok:false,
                message: "El producto no existe"
            })
        }
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save( (err, productoGuardado) => {
            res.json({
                ok: true,
                productoGuardado
            })
        })

    })
})

// ====================================
// BORRA UN PRODUCTO
// ====================================
app.delete("/producto/:id", verificarToken, ( req, res ) => {
    let id = req.params.id;

    Producto.findOneAndUpdate({_id: id}, { disponible: false}, {new: true}, ( err, productoDB ) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok:false,
                message: "El producto no existe"
            })
        }
        res.json({
            ok: true,
            productoDB
        })
    })
})
module.exports = app;