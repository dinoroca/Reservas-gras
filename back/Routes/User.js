'use strict';

var express = require('express');
var UserController = require('../Controllers/UserController');
var api = express.Router();
var auth = require('../Middlewares/authenticate');

//Peticiones
api.post('/registro_user', UserController.registro_user);
api.post('/login_user', UserController.login_user);
api.get('/obtener_user/:id', auth.auth, UserController.obtener_user);
api.put('/actualizar_user/:id', auth.auth, UserController.actualizar_user);
api.post('/comparar_password', UserController.comparar_password);
api.put('/actualizar_password_user/:id', auth.auth, UserController.actualizar_password_user);

/////// CUENTAS
api.post('/registro_cuenta_admin', auth.auth, UserController.registro_cuenta_admin);
api.get('/obtener_cuentas_admin/:id', auth.auth, UserController.obtener_cuentas_admin);
api.get('/obtener_cuenta_admin/:id', auth.auth, UserController.obtener_cuenta_admin);
api.delete('/eliminar_cuenta_admin/:id', auth.auth, UserController.eliminar_cuenta_admin);
api.put('/actualizar_cuenta_admin/:id', auth.auth, UserController.actualizar_cuenta_admin);
api.get('/obtener_cuentas_de_admin', auth.auth, UserController.obtener_cuentas_de_admin);

///// Correos de confirmación
api.put('/actualizar_user_verificado/:id/:codigo', UserController.actualizar_user_verificado);

////RESERVACION
api.post('/crear_reservacion_user', auth.auth, UserController.crear_reservacion_user);
api.get('/obtener_reservaciones_user/:id', auth.auth, UserController.obtener_reservaciones_user);
api.get('/obtener_reservaciones_public/:id', UserController.obtener_reservaciones_public);

//////EMPRESA
api.get('/obtener_empresas_admin', auth.auth, UserController.obtener_empresas_admin);
api.put('/actualizar_empresa_verificado_admin/:id', auth.auth, UserController.actualizar_empresa_verificado_admin);

////Contacto
api.post('/enviar_mensaje_contacto', UserController.enviar_mensaje_contacto);


//Exportar los módulos
module.exports = api;