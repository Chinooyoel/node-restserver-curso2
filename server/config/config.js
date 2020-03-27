

// =====================================
//   PUERTO
// =====================================

process.env.PORT = process.env.PORT || 3000;

// =====================================
//   ENTORNO
// =====================================

process.env.NODE_DEV = process.env.NODE_DEV || "desarrollo";


// =====================================
//   VENCIMIENTO DEL TOKEN
// =====================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60* 24 * 30;

// =====================================
//   SEED DE AUTENTICACION
// =====================================
process.env.SEMILLA = process.env.SEED || "este-es-el-seed-desarrollo"


// =====================================
//   BASE DE DATOS
// =====================================

let rutaDB;

if( process.env.NODE_DEV === "desarrollo" ){
    rutaDB = 'mongodb://localhost:27017/cafe'
}else {
    rutaDB = process.env.MONGO_URL;
}

process.env.RUTADB = rutaDB;

// =====================================
//   GOOGLE CLIENT ID
// =====================================

process.env.CLIENT_ID = process.env.CLIENT_ID || "779978261703-r2nmrd1ngnjnudn7iug7cldof0o8sk3e.apps.googleusercontent.com"