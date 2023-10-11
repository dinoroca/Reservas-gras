'use strict';

var express = require('express');
var EmpresaController = require('../Controllers/EmpresaController');
var api = express.Router();
var auth = require('../Middlewares/authenticate');

//Peticiones
api.post('/registro_empresa', EmpresaController.registro_empresa);


//Buscar empresa
api.get('/listar_empresas_filtro/:filtro?', EmpresaController.listar_empresas_filtro);



//Exportar los módulos
module.exports = api;