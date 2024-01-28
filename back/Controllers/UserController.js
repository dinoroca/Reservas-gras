'use strict';

var User = require('../Models/User');
var Reservacion = require('../Models/Reservacion');
var Reservacion = require('../Models/Reservacion');
var Empresa = require('../Models/Empresa');
var Caracteristicas = require('../Models/Caracteristicas');
const CuentaAdmin = require('../Models/CuentaAdmin');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../Helpers/jwt');
const moment = require('moment');

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

const obtener_reservaciones_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      let reservaciones = [];
      try {
        reservaciones = await Reservacion.find().sort({ createdAt: -1 })
        .populate('empresa')
        .populate('cancha')
        .populate({ path: 'cliente', model: 'user' });

        res.status(200).send({ data: reservaciones });
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

const actualizar_reserva_reservado_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      var id = req.params['id'];

      var reg = await Reservacion.findByIdAndUpdate({ _id: id }, { estado: 'Reservado' });

      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

// Función para eliminar reservas vencidas
const eliminarReservasVencidas = async () => {
  try {
    // Define el límite de tiempo para las reservas (en minutos)
    const limiteTiempo = 15;

    // Calcula la fecha límite para eliminar las reservas
    const fechaLimite = moment().subtract(limiteTiempo, 'minutes');

    // Busca las reservas con estado 'Ocupado' y fecha de creación anterior a la fecha límite
    const reservasVencidas = await Reservacion.find({
      estado: 'Ocupado',
      createdAt: { $lte: fechaLimite.toDate() }
    });

    // Elimina las reservas vencidas
    for (const reserva of reservasVencidas) {
      await Reservacion.findByIdAndDelete(reserva._id);
    }
  } catch (error) {
    console.error('Error al eliminar reservas vencidas:', error);
  }
};

setInterval(eliminarReservasVencidas, 60 * 1000);

// Función para actualizar el estado de las reservas
const actualizarEstadoReservas = async () => {
  try {
    // Obtiene la fecha y hora actual
    const ahora = new Date();

    // Ejecuta la actualización solo si la hora actual es en el minuto 00
    if (ahora.getMinutes() === 0) {
      // Busca las reservas con estado 'Reservado' y fecha y hora de inicio menores o iguales a la fecha y hora actual
      const reservasPendientes = await Reservacion.find({
        estado: 'Reservado',
        fecha: { $lte: ahora },
        hora_inicio: { $lte: ahora }
      });

      // Actualiza el estado de las reservas encontradas a 'Finalizado'
      for (const reserva of reservasPendientes) {
        await Reservacion.findByIdAndUpdate(reserva._id, { estado: 'Finalizado' });
        console.log(`La reserva con ID ${reserva._id} ha sido actualizada a 'Finalizado'.`);
      }
    }
  } catch (error) {
    console.error('Error al actualizar el estado de las reservas:', error);
  }
};

// Configura un temporizador para verificar y ejecutar la función cada minuto
setInterval(actualizarEstadoReservas, 60 * 1000);


//Cuentas ADMIN
const registro_cuenta_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      var data = req.body;

      let reg = await CuentaAdmin.create(data);
      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_cuentas_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {
      let id = req.params['id'];

      let cuentas = [];
      try {
        cuentas = await CuentaAdmin.find().sort({ createdAt: -1 });
        res.status(200).send({ data: cuentas });
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

const obtener_cuenta_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      var id = req.params['id'];

      let cuenta;

      try {
        cuenta = await CuentaAdmin.findById({ _id: id });
        res.status(200).send({ data: cuenta });
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

const eliminar_cuenta_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      var id = req.params['id'];
      let reg = await CuentaAdmin.findByIdAndRemove({ _id: id });
      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const actualizar_cuenta_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      var id = req.params['id'];
      var data = req.body;

      var reg = await CuentaAdmin.findByIdAndUpdate({ _id: id }, {
        banco: data.banco,
        titular: data.titular,
        cuenta: data.cuenta,
        cci: data.cci,
        color: data.color
      });

      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_cuentas_de_admin = async function (req, res) {
  if (req.user) {

    let cuentas = [];
    try {
      cuentas = await CuentaAdmin.find();
      res.status(200).send({ data: cuentas });
    } catch (error) {
      res.status(200).send({ data: undefined });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

//EMPRESA
const obtener_empresas_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      let empresas = [];
      try {
        empresas = await Caracteristicas.find().sort({ createdAt: -1 }).populate('empresa');
        res.status(200).send({ data: empresas });
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

const actualizar_empresa_verificado_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {

      var id = req.params['id'];

      var reg = await Empresa.findByIdAndUpdate({ _id: id }, { verificado: true });

      res.status(200).send({ data: reg });

    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const obtener_caracteristicas_admin = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'ADMIN') {
      let id = req.params['id'];

      let caracteristicas = await Caracteristicas.find({ empresa: id });
      

      if (caracteristicas.length >= 1) {
        res.status(200).send({ data: caracteristicas });
      } else {
        res.status(200).send({ data: undefined });
      }
    } else {
      res.status(500).send({ message: 'NoAccess' });
    }
  } else {
    res.status(500).send({ message: 'NoAccess' });
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
  obtener_reservaciones_admin,
  actualizar_reserva_reservado_admin,
  registro_cuenta_admin,
  obtener_cuentas_admin,
  obtener_cuenta_admin,
  eliminar_cuenta_admin,
  actualizar_cuenta_admin,
  obtener_cuentas_de_admin,
  obtener_empresas_admin,
  actualizar_empresa_verificado_admin,
  obtener_caracteristicas_admin,
  
  enviar_mensaje_contacto
}