const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

app.get('/productos', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

app.get('/productos/:id', (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        msg: `No Existe Producto Registrado con el ID: ${id}`
                    }
                })
            }
            res.json({
                ok: true,
                producto
            });
        });
});

app.get('/productos/buscar/:termino', (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.status(201).json({
                ok: true,
                producto
            });
        });
});

app.post('/productos', verificaToken, (req, res) => {
    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto
        });
    });
});

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: `El Producto con la ID: ${id} no existe`
                }
            })
        } else {
            productoBD.nombre = req.body.nombre;
            productoBD.precioUni = req.body.precioUni;
            productoBD.descripcion = req.body.descripcion;
            productoBD.disponible = req.body.disponible;
            productoBD.categoria = req.body.categoria;

            productoBD.save((err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    producto
                });
            });
        }
    });

});

app.delete("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    msg: `El Producto con la ID: ${id} no existe`
                }
            })
        } else {
            productoBD.disponible = false;

            productoBD.save((err, producto) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                res.json({
                    ok: true,
                    producto,
                    msg: 'El Producto fue Borrado'
                });
            });
        }
    });
});

module.exports = app;