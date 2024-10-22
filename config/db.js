const mongoose = require('mongoose');


mongoose.connect('mongodb://75.119.156.86:36017/poc-products-db?authSource=admin', {
    'auth': { 'authSource': 'admin' },
    'user': 'ntorres',
    'pass': 'nTorres.12',
}).then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB', error));

