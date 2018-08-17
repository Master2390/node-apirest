const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');
const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario Incorrecto'
                }
            });
        }
        if (!bcrypt.compareSync(body.pass, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Clave Incorrecta'
                }
            });
        }
        let token = jwt.sign({ usuario: usuarioBD },
            process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
    })
});

//Configuraciones de Google
app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let userGoogle = await verify(token)
        .catch((e) => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: userGoogle.email }, (err, userDB) => {
        if (err) {
            //Validacion de Error Interno
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (userDB) {
            //Validar si el ingreso por google tiene autenticacion 'google: true' en la BD
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Su credencial es Normal'
                    }
                });
            }
            //Validar si tiene el token expirado para renovarlo
            else {
                let token = jwt.sign({ usuario: userDB },
                    process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }
                );

                res.json({
                    ok: true,
                    usuario: userDB,
                    token
                });
            }
        }
        //Validar si el Usuario no esta registrado en la BD
        else {
            let usuario = new Usuario();

            usuario.nombre = userGoogle.nombre;
            usuario.email = userGoogle.email;
            usuario.img = userGoogle.img;
            usuario.google = true;
            usuario.password = ":P";

            usuario.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({ usuario: usuario },
                    process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD_TOKEN }
                );

                res.json({
                    ok: true,
                    usuario: usuario,
                    token
                });
            });
        }
    })
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
verify().catch(console.error);

module.exports = app;