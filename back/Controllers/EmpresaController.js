'use strict';

var Empresa = require('../Models/Empresa');
var Caracteristicas = require('../Models/Caracteristicas');
var Cancha = require ('../Models/Cancha');
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
  empresas_arr = await Empresa.find({ email: data.email });

  if (empresas_arr.length == 0) {
    //Registro de empresa

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

const login_empresa = async function (req, res) {
  var data = req.body;
  var empresas_arr = [];

  //Busca un cliente mediante el correo
  empresas_arr = await Empresa.find({ email: data.email });

  if (empresas_arr.length == 0) {
    res
      .status(200)
      .send({ message: "Correo o contraseña incorrectos", data: undefined });
  } else {
    //Si existe el cliente se manda al login
    let user = empresas_arr[0];

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

const obtener_empresa = async function (req, res) {
  if (req.user) {

    var id = req.params['id'];

    try {
      var reg = await Empresa.findById({ _id: id });
      res.status(200).send({ data: reg });

    } catch (error) {
      res.status(200).send({ data: undefined });
    }

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

const listar_empresas_filtro = async function (req, res) {

  let filtro = req.params['filtro'];

  let reg = await Empresa.find({ nombre: new RegExp(filtro, 'i') }).sort({ createdAt: -1 }).limit(10);
  if (reg.length > 0) {
    res.status(200).send({ data: reg });
  } else {
    res.status(200).send({ data: undefined });
  }
}

const listar_empresas_publico = async function (req, res) {

  let reg = await Empresa.find().sort({ createdAt: 1 }).limit(9);
  if (reg.length > 0) {
    res.status(200).send({ data: reg });
  } else {
    res.status(200).send({ data: undefined });
  }
}

const listar_empresas_region = async function (req, res) {

  let region = req.params['region'];

  let reg = await Empresa.find({ region: new RegExp(region, 'i') }).sort({ createdAt: -1 }).limit(20);
  if (reg.length > 0) {
    res.status(200).send({ data: reg });
  } else {
    res.status(200).send({ data: undefined });
  }
}

const listar_empresas_prov = async function (req, res) {

  let region = req.params['region'];
  let provincia = req.params['provincia'];

  let reg = await Empresa.find({
    $and: [
      { provincia: provincia },
      { region: region }
    ]
  }).sort({ createdAt: -1 }).limit(20);

  if (reg.length > 0) {
    res.status(200).send({ data: reg });
  } else {
    res.status(200).send({ data: undefined });
  }
}

const listar_empresas_dist = async function (req, res) {

  let region = req.params['region'];
  let provincia = req.params['provincia'];
  let distrito = req.params['distrito'];

  let reg = await Empresa.find({
    $and: [
      { provincia: provincia },
      { region: region },
      { distrito: distrito }
    ]
  }).sort({ createdAt: -1 }).limit(20);

  if (reg.length > 0) {
    res.status(200).send({ data: reg });
  } else {
    res.status(200).send({ data: undefined });
  }
}

const actualizar_empresa = async function (req, res) {
  if (req.user) {
    var id = req.params['id'];
    var data = req.body;

    var reg = await Empresa.findByIdAndUpdate({ _id: id }, {
      nombre: data.nombre,
      direccion: data.direccion,
      telefono: data.telefono,
      ubicacion: data.ubicacion,
    });

    res.status(200).send({ data: reg });

  } else {
    res.status(500).send({ message: 'NoAccess' });
  }
}

//Características

const crear_caracteristicas_empresa = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'GRASS') {
      var data = req.body;
      try {
        var reg = await Caracteristicas.create(data);
        res.status(200).send({ data: reg });

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

const obtener_caracteristicas_empresa = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'GRASS') {
      let id = req.params['id'];
      let caracteristicas = await Caracteristicas.find({ empresa: id }).populate('empresa');

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

const actualizar_caracteristicas_empresa = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'GRASS') {

      var id = req.params['id'];
      var data = req.body;

      try {
        var reg = await Caracteristicas.updateOne({ empresa: id }, {
          techado: data.techado,
          canchas_futsal: data.canchas_futsal,
          canchas_voley: data.canchas_voley,
          iluminacion: data.iluminacion,
          garaje: data.garaje
        });
        res.status(200).send({ data: reg });

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

const obtener_caracteristicas_empresa_publico = async function (req, res) {
  let caracteristicas = await Caracteristicas.find().populate('empresa');

  if (caracteristicas.length >= 1) {
    res.status(200).send({ data: caracteristicas });
  } else {
    res.status(200).send({ data: undefined });
  }
}

//Canchas
const crear_cancha_empresa = async function (req, res) {
  if (req.user) {
    if (req.user.role == 'GRASS') {
      var data = req.body;
      try {
        var reg = await Cancha.create(data);
        res.status(200).send({ data: reg });

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


module.exports = {
  registro_empresa,
  login_empresa,
  obtener_empresa,
  listar_empresas_filtro,
  listar_empresas_region,
  listar_empresas_prov,
  listar_empresas_dist,
  actualizar_empresa,
  crear_caracteristicas_empresa,
  obtener_caracteristicas_empresa,
  obtener_caracteristicas_empresa_publico,
  listar_empresas_publico,
  actualizar_caracteristicas_empresa,
  crear_cancha_empresa
}