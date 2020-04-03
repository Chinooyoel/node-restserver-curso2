const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario");
const _ = require("underscore");
const { verificarToken, verificarRole } = require("../middleware/autenticacion");

app.get("/", (req, res) => {

    res.json("get mundo")

})

app.get("/usuario", verificarToken, ( req, res ) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({ estado:true }, "nombre email role estado google")
            .skip(desde)
            .limit(5)
            .exec( (err, usuarios ) => {
                if( err ) {
                    return res.status(400).json({
                       ok: false,
                       err
                   })
               }

            Usuario.countDocuments({estado: true}, (err, contador ) => {
                
                res.json({
                    ok: true,
                    contador: contador,
                    usuarios
                })
            })

            })
            
})
app.post("/usuario", [verificarToken, verificarRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role
    })

    usuario.save(( err, usuarioDB ) => {
        if( err ) {
             return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

    /*
    if( body.nombre === undefined){
        res.status(400).json({
            codigo: 400,
            error: "Es necesario el nombre"
        })
    }else {
        res.json(body)
    }
   */

})
app.put("/", (req, res) => {

    res.json("put mundo")

})


app.put("/usuario/:id", [verificarToken, verificarRole],  ( req, res ) => {

    let id = req.params.id;
    let body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);


    Usuario.findByIdAndUpdate(id, body,{ new : true }, (err, usuarioDB) => {
        if ( err ) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok:true,
            usuarioDB
        })
    })
})
/*
//borrando el documento fisicamente
app.delete("/usuario/:id", (req, res) => {
        let id = req.params.id;

        Usuario.findByIdAndRemove(id, ( err, usuarioDB ) => {
            if( err ) {
                res.status(400);
                res.json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuarioBorrado: usuarioDB,
            })
        })
})
*/
//borrando el documento digitalmente
app.delete("/usuario/:id", [verificarToken, verificarRole], (req, res) => {
    let id = req.params.id;

    let desactivado = { estado : false }
    Usuario.findByIdAndUpdate(id, desactivado, {new: true}, ( err, usuarioDB ) => {
        if( err ) {
            res.status(400);
            res.json({
                ok: false,
                err
            })
        }else{
            
        }


        res.json({
            ok: true,
            usuarioEliminado: usuarioDB
        })

    })
})
module.exports = app;