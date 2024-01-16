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

///// Correos de confirmación
api.put('/actualizar_user_verificado/:id/:codigo', UserController.actualizar_user_verificado);

////RESERVACION
api.post('/crear_reservacion_user', auth.auth, UserController.crear_reservacion_user);
api.get('/obtener_reservaciones_user/:id', auth.auth, UserController.obtener_reservaciones_user);
api.get('/obtener_reservaciones_public/:id', UserController.obtener_reservaciones_public);

////Contacto
api.post('/enviar_mensaje_contacto', UserController.enviar_mensaje_contacto);


//Exportar los módulos
module.exports = api;