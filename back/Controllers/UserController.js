'use strict';

var User = require('../Models/User');
var Reservacion = require('../Models/Reservacion');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../Helpers/jwt');

// var fs = require('fs');
var handlebars = require('handlebars');
var ejs = require('ejs');
var nodemailer = require('nodemailer');

const registro_user = async function (req, res) {
  //Obtiene los parámetros del cliente
  var data = req.body;
  var users_arr = [];

  //Generar un aleatorio de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000);

  //Verifica que no exista correo repetido
  users_arr = await User.find({ email: data.email });

  if (users_arr.length == 0) {
    //Registro del usuario

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          data.codigo = code;
          var reg = await User.create(data);
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

const login_user = async function (req, res) {
  var data = req.body;
  var users_arr = [];

  //Busca un cliente mediante el correo
  users_arr = await User.find({ email: data.email });

  if (users_arr.length == 0) {
    res
      .status(200)
      .send({ message: "Correo o contraseña incorrectos", data: undefined });
  } else {
    //Si existe el cliente se manda al login
    let user = users_arr[0];

    //Comparar contraseñas
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({
          data: user,
          token: jwt.createToken(user),
        });
      } else {
        res
          .status(200)
          .send({ message: "Correo o contraseña incorrectos", data: undefined });
      }
    });
  }
}

const actualizar_user_verificado = async function (req, res) {

  var id = req.params['id'];
  var codigo = req.params['codigo'];

  var user = await User.findById({ _id: id });

  if (codigo == user.codigo) {
    var reg = await User.findByIdAndUpdate({ _id: id }, { verificado: true });

    res.status(200).send({ data: reg });
  } else if (codigo != user.codigo) {
    res.status(200).send({ data: undefined });
  }
}

const obtener_user = async function (req, res) {
  if (req.user) {

    var id = req.params['id'];

    try {
      var reg = await User.findById({ _id: id });
      res.status(200).send({ data: reg });

    } catch (error) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const actualizar_user = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    var data = req.body;

    var reg = await User.findByIdAndUpdate({ _id: id }, {
      nombres: data.nombres,
      ciudad: data.ciudad,
      telefono: data.telefono
    });

    res.status(200).send({ data: reg });

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const comparar_password = async function (req, res) {
  var data = req.body;
  var users_arr = [];

  //Busca un cliente mediante el correo
  users_arr = await User.find({ email: data.email });

  if (users_arr.length == 0) {
    res
      .status(200)
      .send({ message: "Correo o contraseña incorrectos", data: undefined });
  } else {
    //Si existe el cliente se manda al login
    let user = users_arr[0];

    //Comparar contraseñas
    bcrypt.compare(data.password, user.password, async function (error, check) {
      if (check) {
        res.status(200).send({ data: true });
      } else {
        res
          .status(200)
          .send({ message: "Contraseña incorrecta", data: undefined });
      }
    });
  }
}

const actualizar_password_user = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    var data = req.body;

    if (data.password) {
      bcrypt.hash(data.password, null, null, async function (err, hash) {
        if (hash) {
          data.password = hash;
          var reg = await User.findByIdAndUpdate({ _id: id }, {
            password: data.password
          });

          res.status(200).send({ data: true });

        } else {
          res.status(200).send({ message: "Error server", data: undefined });
        }
      });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

// Reservaciones
const crear_reservacion_user = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'USER') {

      var data = req.body;

      // Verificar si hay reservas existentes que se solapen con la nueva reserva
      const reservasExistente = await Reservacion.find({
        cancha: data.cancha,
        fecha: data.fecha,
        $or: [
          { $and: [{ hora_inicio: { $lt: data.hora_fin } }, { hora_fin: { $gt: data.hora_inicio } }] },
          { $and: [{ hora_inicio: { $lte: data.hora_fin } }, { hora_fin: { $gte: data.hora_fin } }] },
          { $and: [{ hora_inicio: { $lte: data.hora_inicio } }, { hora_fin: { $gte: data.hora_inicio } }] }
        ]
      });

      // Si hay reservas existentes, enviar un mensaje de conflicto
      if (reservasExistente.length > 0) {
        res.status(200).send({ data: undefined, message: 'La cancha ya está reservada para ese horario' });
      } else {
        // Si no hay conflictos, crear la reserva
        let reg = await Reservacion.create(data);
        res.status(200).send({ data: reg });
      }

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_reservaciones_user = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'USER') {
      let id = req.params['id'];

      let reservas = [];
      try {
        reservas = await Reservacion.find({ cliente: id }).sort({ createdAt: -1 }).populate('empresa').populate('cancha');
        res.status(200).send({ data: reservas });
      } catch (error) {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_reservaciones_public = async function (req, res) {
  let id = req.params['id'];

  let reservas = [];
  try {
    reservas = await Reservacion.find({ cancha: id }).sort({ createdAt: -1 }).populate('empresa').populate('cancha');
    res.status(200).send({ data: reservas });
  } catch (error) {
    res.status(200).send({ data: undefined });
  }
}




////////CONTACTO
const enviar_mensaje_contacto = async function (req, res) {
  let data = req.body;
  data.estado = 'Abierto';
  let reg = await Contacto.create(data);

  res.status(200).send({ data: reg })
}


module.exports = {
  registro_user,
  login_user,
  actualizar_user_verificado,
  obtener_user,
  actualizar_user,
  comparar_password,
  actualizar_password_user,
  crear_reservacion_user,
  obtener_reservaciones_user,
  obtener_reservaciones_public,
  enviar_mensaje_contacto
}