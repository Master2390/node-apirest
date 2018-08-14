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
                err: 'Error en la verificacion del token'
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

//===================
// Verificarcion de Token
//===================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== "ADMIN_ROLE") {
        return res.json({
            ok: false,
            err: 'No Tiene Permisos para Ejecutar la Accion'
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdminRole
}