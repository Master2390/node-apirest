const express = require('express')
const app = express()
const bodyParser = require('body-parser');
require('./config/config');
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('Get Usuario')
});

app.post('/usuario', function(req, res) {
    let body = req.body;
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            msg: "El nombre es necesario"
        });
    } else {
        res.json({
            people: body
        });
    }
});

app.put('/usuario/:id', function(req, res) {
    let identificador = req.params.id;
    res.json('Put Usuario ' + identificador)
});

app.delete('/usuario', function(req, res) {
    res.json('Delete Usuario')
});

app.listen(port, () => console.log(`Escuchando Puerto ${port}`));