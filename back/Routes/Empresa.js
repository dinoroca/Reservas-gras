'use strict';

var express = require('express');
var EmpresaController = require('../Controllers/EmpresaController');
var api = express.Router();
var auth = require('../Middlewares/authenticate');

//Peticiones
api.post('/registro_empresa', EmpresaController.registro_empresa);


//Buscar empresa
api.get('/listar_empresas_filtro/:filtro?', EmpresaController.listar_empresas_filtro);
api.get('/listar_empresas_region/:region?', EmpresaController.listar_empresas_region);
api.get('/listar_empresas_prov/:region?/:provincia?', EmpresaController.listar_empresas_prov);
api.get('/listar_empresas_dist/:region?/:provincia?/:distrito?', EmpresaController.listar_empresas_dist);



//Exportar los módulos
module.exports = api;