'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Se crea un modelo de objeto para el inventario
var ReservacionSchema = Schema({
    empresa: {type: Schema.ObjectId, ref: 'empresa', required: true},
    cancha: {type: Schema.ObjectId, ref: 'cancha', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    subtotal: {type: Number, required: true},
    día: {type: String, required: true},
    hora: {type: Number, required: true},
    descuento: {type: Number, required: false},
    
    createdAt: {type: Date, default: Date.now, required: true}
});

module.exports = mongoose.model('reservacion', ReservacionSchema);