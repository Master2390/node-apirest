const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');
let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    let tipo = req.params.tipo;
    let nombImg = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombImg}`);
    if (!fs.existsSync(pathImg)) {
        pathImg = path.resolve(__dirname, `../assets/no-image.jpg`);
    }
    res.sendFile(pathImg);
})

module.exports = app;