const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:36017/poc-products-db?authSource=admin', {
    'auth': { 'authSource': 'admin' },
    'user': 'ntorres',
    'pass': 'nTorres.12',
}).then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB', error));
