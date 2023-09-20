'use strict';

var Empresa = require('../Models/Empresa');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../Helpers/jwt');

// var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');

const registro_empresa = async function (req, res) {
  //Obtiene los parámetros del cliente
  var data = req.body;
  var empresas_arr = [];

  //Verifica que no exista correo repetido
  empresas_arr = await Empresa.find({ nombre: data.nombre });

  if (empresas_arr.length == 0) {
    //Registro del usuario

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await Empresa.create(data);
          res.status(200).send({
            data: reg,
            token: jwt.createToken(reg)
          });
        } else {
          res.status(200).send({ message: "Error server", data: undefined });
        }
      });
    } else {
      res
        .status(200)
        .send({ message: "No hay una contraseña", data: undefined });
    }
  } else {
    res
      .status(200)
      .send({
        message: "El correo ya está registrado por otro usuario",
        data: undefined,
      });
  }
}


module.exports = {
    registro_empresa
}