//===================
// Puerto
//===================

process.env.PORT = process.env.PORT || 3000

//===================
// Entorno
//===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// BD
//===================
let urlDB;

if (process.env.NODE_ENV === 'dev')
    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = 'mongodb://cafeDB:1ClaveComplicada@ds051943.mlab.com:51943/cafe';

//Variable inventada con nombre URLDB
process.env.URLDB = urlDB;