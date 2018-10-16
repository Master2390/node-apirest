const jwt = require('jsonwebtoken');

//===================
// Verificarcion de Token
//===================

let verificaToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    msg: 'Token No Valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//===================
// Verificarcion de Rol
//===================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== "ADMIN_ROLE") {
        return res.json({
            ok: false,
            err: {
                msg: 'No Tiene Permisos para Ejecutar la Accion'
            }
        });
    }
    next();
};

//===================
// Verificarcion token de imagenes
//===================

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    msg: 'Token No Valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}