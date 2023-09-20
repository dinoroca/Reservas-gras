'use strict';

var express = require('express');
var EmpresaController = require('../Controllers/EmpresaController');
var api = express.Router();
var auth = require('../Middlewares/authenticate');

//Peticiones
api.post('/registro_empresa', EmpresaController.registro_empresa);



//Exportar los módulos
module.exports = api;