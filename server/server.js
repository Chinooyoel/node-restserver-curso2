require("./config/config")

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Configuracion global de rutas
app.use(require("./routes/index"));

mongoose.connect(process.env.RUTADB, {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true}, ( err, resp ) => {
    if (err) throw err

    console.log("base de datos ONLINE!!");
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto", process.env.PORT)
})