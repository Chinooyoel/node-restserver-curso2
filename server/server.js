require("./config/config")

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.get("/", (req, res) => {

    res.json("get mundo")

})
app.post("/usuario", (req, res) => {

    let body = req.body;

    res.json(body)

})
app.put("/", (req, res) => {

    res.json("put mundo")

})

app.listen(process.env.PORT, () => {
    console.log("Escuchando el puerto", process.env.PORT)
})