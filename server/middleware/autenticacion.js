const jwt = require("jsonwebtoken");

//==============================
// VERIFICAR TOKEN
//==============================

let verificarToken = ( req, res, next ) => {
    let token = req.get("token");

    jwt.verify(token, process.env.SEMILLA, ( err, decodificado ) => {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: "Token no valido"
            })
        }

        req.usuario = decodificado.usuario;

        next();
    })



}

//==============================
// VERIFICAR TOKEN PARA IMAGEN
//==============================
let verificarTokenImg = ( req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEMILLA, ( err, decodificado ) => {
        if ( err ) {
            return res.status(401).json({
                ok: false,
                err: "Token no valido"
            })
        }

        req.usuario = decodificado.usuario;

        next();
})
}

//==============================
// VERIFICAR ADMINROLE
//==============================

let verificarRole = ( req, res, next ) => {
    let usuario = req.usuario;


    if( usuario.role !== "ADMIN_ROLE" ){
        return res.status(401).json({
            ok: false,
            err: "No tienes permiso de administrador"
        })
    }

    next();
}

module.exports = {
    verificarToken,
    verificarTokenImg,
    verificarRole
};