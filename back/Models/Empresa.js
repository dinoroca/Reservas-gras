'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    verificado: {type: Boolean, default: false, required: true},
    token_pass: {type: String, required: false},
    nombre: {type: String, required: true},
    telefono: {type: String, required: true},
    region: {type: String, required: false},
    provincia: {type: String, required: false},
    distrito: {type: String, required: false},
    user_name: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'GRASS', required: true},

    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('empresa', EmpresaSchema);