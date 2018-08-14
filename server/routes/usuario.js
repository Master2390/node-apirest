const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    //Metodo de Mongoose find() verificar documentacion
    Usuario.find({ estado: true }, 'nombre email role estado google ')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, cont) => {
                res.json({
                    ok: true,
                    usuarios,
                    cont
                });
            });
        });
});

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBD
        });
    })
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    // funcion de la libreria Underscore => pick
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // funcion de la libreria mongoosse => findByIdAndUpdate
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        })

    })

});

// app.delete('/usuario/:id', function(req, res) {
//     let id = req.params.id;
//     let fisica = req.query.fisica;

//     if (fisica == 0) {
//         Usuario.findByIdAndRemove(id, (err, usuarioDel) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }
//             if (!usuarioDel) {
//                 return res.status(400).json({
//                     ok: false,
//                     error: {
//                         msg: 'Usuario no Encontrado'
//                     }
//                 });
//             }
//             res.json({
//                 ok: true,
//                 usuarioDel
//             });
//         });
//     } else {
//         let usuario = new Usuario({
//             estado: false
//         })
//         Usuario.findByIdAndUpdate(id, usuario, { new: true, runValidators: true }, (err, usuarioBD) => {
//             if (err) {
//                 return res.status(400).json({
//                     ok: false,
//                     err
//                 });
//             }
//             res.json({
//                 ok: true,
//                 usuario: usuarioBD
//             })

//         })
//     }
// });

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let fisica = req.query.fisica;

    let usuario = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, usuario, { new: true }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBD
        })

    })
});

module.exports = app;