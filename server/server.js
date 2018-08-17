const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('./config/config');
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//configuracion de rutas
app.use(require('./routes/index'));

// parse application/json
app.use(bodyParser.json())

//Habilitar directorio public
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos ACTIVA');
});

app.listen(port, () => console.log(`Escuchando Puerto ${port}`));