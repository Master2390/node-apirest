//===================
// Puerto
//===================

process.env.PORT = process.env.PORT || 3000

//===================
// Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// Vencimiento del Token
//===================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//===================
// Seed de Autenticacion (Semilla del token)
//===================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'este-es-el-seet-desarrollo';

//===================
// BD
//===================
let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URL;

//Variable inventada con nombre URLDB
process.env.URLDB = urlDB;

//===================
// Google Client ID
//===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '590662029250-59hspi36h2b8t75qp2t3ekvl4oc7csif.apps.googleusercontent.com';