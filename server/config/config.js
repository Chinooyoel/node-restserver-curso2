

// =====================================
//   PUERTO
// =====================================

process.env.PORT = process.env.PORT || 3000;

// =====================================
//   ENTORNO
// =====================================

process.env.NODE_DEV = process.env.NODE_DEV || "desarrollo";

// =====================================
//   BASE DE DATOS
// =====================================

let rutaDB;

if( process.env.NODE_DEV === "desarrollo" ){
    rutaDB = 'mongodb://localhost:27017/cafe'
}else {
    rutaDB = "mongodb+srv://yoel:zwACFTmxyqZD1RdH@cluster0-su75x.mongodb.net/cafe"
}

process.env.RUTADB = rutaDB;