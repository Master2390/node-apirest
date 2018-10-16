const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'No Existe Archivo'
            }
        });
    }
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Los Tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extencion = nombreArchivo[nombreArchivo.length - 1];

    console.log(nombreArchivo);

    //Extenciones Permitidas
    let extencionesValid = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValid.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                msg: 'Las extenciones permitidas son: ' + extencionesValid.join(', ')
            }
        });
    }

    let nombre = `${id}-${new Date().getMilliseconds()}.${extencion}`;

    archivo.mv(`uploads/${tipo}/${nombre}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        switch (tipo) {
            case "productos":
                imagenProduct(id, res, nombre);
                break;
            case "usuarios":
                imagenUser(id, res, nombre);
                break;
        }
    });
});

const imagenProduct = (id, res, nombreArch) => {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArch, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArch, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El productos no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArch;
        productoDB.save((err, producto) => {
            res.json({
                ok: true,
                producto,
                img: nombreArch
            });
        });

    });
}

const imagenUser = (id, res, nombreArch) => {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArch, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArch, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    msg: 'El Usuario no existe'
                }
            });
        }

        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArch;
        usuarioDB.save((err, usuario) => {
            res.json({
                ok: true,
                usuario,
                img: nombreArch
            });
        });

    })
}

const borrarArchivo = (nombImg, tipo) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;