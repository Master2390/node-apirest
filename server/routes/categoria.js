const express = require('express');
const app = express();
const Categoria = require('../models/categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

//Listar Categorias
app.get('/categoria', (req, res) => {
    Categoria.find()
        //Orden asendente de los resultados
        .sort('descripcion')
        //Mostrar determinado Item con id asociado a otra tabla
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias
            });
        })
});

//Buscar Una Categoria por ID
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: "La Categoria No Existe"
            });
        }
        res.json({
            ok: true,
            categoria
        });
    })
});

//Crear Nueva Categoria
app.post('/categoria', verificaToken, (req, res) => {
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    })
});

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let descripcionModif = {
        descripcion: req.body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descripcionModif, { new: true, runValidators: true }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDel) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDel) {
            return res.status(400).json({
                ok: false,
                error: {
                    msg: 'No Existe la Categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoriaDel
        });
    });
});

module.exports = app;