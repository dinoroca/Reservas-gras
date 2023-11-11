'use strict';

var express = require('express');
var EmpresaController = require('../Controllers/EmpresaController');
var api = express.Router();
var auth = require('../Middlewares/authenticate');

//Peticiones
api.post('/registro_empresa', EmpresaController.registro_empresa);
api.post('/login_empresa', EmpresaController.login_empresa);
api.get('/obtener_empresa/:id', auth.auth, EmpresaController.obtener_empresa);
api.put('/actualizar_empresa/:id', auth.auth, EmpresaController.actualizar_empresa);
api.post('/crear_caracteristicas_empresa/:id', auth.auth, EmpresaController.crear_caracteristicas_empresa);
api.get('/obtener_caracteristicas_empresa/:id', auth.auth, EmpresaController.obtener_caracteristicas_empresa);
api.put('/actualizar_caracteristicas_empresa/:id', auth.auth, EmpresaController.actualizar_caracteristicas_empresa);
api.get('/obtener_caracteristicas_empresa_publico', EmpresaController.obtener_caracteristicas_empresa_publico);


//Buscar empresa
api.get('/listar_empresas_filtro/:filtro?', EmpresaController.listar_empresas_filtro);
api.get('/listar_empresas_region/:region?', EmpresaController.listar_empresas_region);
api.get('/listar_empresas_prov/:region?/:provincia?', EmpresaController.listar_empresas_prov);
api.get('/listar_empresas_dist/:region?/:provincia?/:distrito?', EmpresaController.listar_empresas_dist);



//Exportar los módulos
module.exports = api;