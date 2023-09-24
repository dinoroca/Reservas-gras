'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el carrito de compras
var CanchaSchema = Schema({
    empresa: {type: Schema.ObjectId, ref: 'empresa', required: true},
    galeria: [{type: Object, required: false}],
    descripcion: {type: String, required: true},
    tipo: {type: String, required: true},
    largo: {type: Number, required: true},
    ancho: {type: Number, required: true},
    precio_dia: {type: Number, required: true},
    precio_noche: {type: Number, required: true},
    n_reservas: {type: Number, required: false},
    techado: {type: Boolean, required: true},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('cancha', CanchaSchema);