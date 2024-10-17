var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs')
var generatePassword = require('password-generator');
let User = require('../models/user.model');
let Role = require('../models/role.model');
let School = require('../models/school.model');
const validateRegisterInput = require("../validations/register");
const validateEditInput = require("../validations/edit");
const generateToken = require("../utils/generateToken.js");
const mailTemplate = require('./mailTemplate');

router.get('/all', async (req, res) => {
  try {
    await User.aggregate([
      { $match: { status: { $ne: 2 } } },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user_info"
        }
      },
      {
        $unwind: {
          path: "$user_info",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role_info"
        }
      },
      {
        $unwind: {
          path: "$role_info",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "schools",
          localField: "school",
          foreignField: "_id",
          as: "school_info"
        }
      },
      {
        $unwind: {
          path: "$school_info",
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          name: 1,
          email: 1,
          role: "$role_info.name",
          school: "$school_info.name",
          status: 1,
          createdAt: 1,
          createdBy: "$user_info.name",
        }
      }
    ]).then(users => {
      res.status(200).json({ message: 'Usuarios encontrados.', users: users })
    })
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando los usuarios." });
  }
})

router.get('/get', async (req, res) => {
  try {
    await User.findOne({ _id: req.query._id })
      .populate('role')
      .populate('school')
      .populate('createdBy')
      .then(user => {
        res.status(200).json({ message: 'Usuario encontrado.', users: user })
      });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en consultar el usuario." });
  }
})

router.get('/details', async (req, res) => {
  try {
    await User.findOne({ _id: req.query._id }).populate('role').populate('school').populate('createdBy').then(async (user) => {
      await Role.find().sort({ order: 1 }).then(async (rol) => {
        await School.find().then(school => {
          var back = {
            users: user,
            roles: rol,
            schools: school,
          }
          res.status(200).json({ message: 'Usuario encontrado.', res: back })
        });
        //res.status(200).json({ message: 'Roles encontrados.', roles: rol });
      })
      //res.status(200).json({ message: 'Usuario encontrado.', users: user })
    });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error en consultar el usuario." });
  }
})


router.get('/onlyDetails', async (req, res) => {
  try {
    await Role.find().sort({ order: 1 }).then(async (rol) => {
      await School.find().then(school => {
        var back = {
          roles: rol,
          schools: school,
        }
        res.status(200).json({ message: 'Informacion encontrada.', res: back })
      });
      //res.status(200).json({ message: 'Roles encontrados.', roles: rol });
    })
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error en consultar el usuario." });
  }
})

router.post('/register', async (req, res) => { // Esta funcion envia bien los errores
  try {
    const { errors, isValid } = validateRegisterInput(req.body);
    if (!isValid) { return res.status(400).send({ message: errors }) }
    await User.findOne(
      {
        $and: [
          { email: req.body.email.toLowerCase() },
          { status: { $ne: 2 } }
        ]
      }
    ).then(user => {
      if (user)
        return res.status(400).send({ message: 'El correo ya se encuentra registrado en el sistema' });

      let pass = generatePassword(12, false)
      const newUser = new User({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        password: pass,
        role: req.body.role,
        school: req.body.school,
        //isAdmin: req.body.isAdmin,
        status: 1,
        createdBy: req.body.createdBy,
      });

      // Hash password before storing in database
      const rounds = 10;
      bcrypt.genSalt(rounds, (err, salt) => {
        bcrypt.hash(newUser.password, salt, async (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Ha ocurrido un error en crear hash de la contraseña del usuario, intente nuevamente." });
          }
          newUser.password = hash;
          let final_response = await mailTemplate.emailTemplate('Creación de usuario exitosa - SIGECEE', req.body.email.toLowerCase(), "Su nuevo usuario para ingresar al sistema es el siguiente: ", '<b>Usuario:</b> ' + req.body.email.toLowerCase(), '<b>Contraseña: </b>' + pass, '', '', req.get('origin'))

          if (final_response) {
            newUser.save().then(async user => {
              res.status(201).json({ message: 'Usuario agregado exitosamente.', user: user });
            });
          } else {
            res.status(500).send({ message: "Ha ocurrido un error mandando el correo, intente nuevamente." });
          }
        });
      });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en agregar usuario." });
  }
});

router.post('/login', async (req, res) => {
  try {
    await User.findOne(
      {
        $and: [
          { email: req.body.email.toLowerCase() },
          { status: { $ne: 2 } }
        ]
      }
    ).then(user => {
      if (!user)
        return res.status(400).send({ message: "El usuario no se encuentra registrado en el sistema." });

      if (user.status === 0)
        return res.status(400).send({ message: "El usuario se encuentra inactivo en el sistema." });

      bcrypt.compare(req.body.password, user.password, function (err, data) {
        if (err)
          return res.status(500).send({ message: "Ha ocurrido un error en crear hash de la contraseña del usuario." });

        if (!data)
          return res.status(400).send({ message: 'La contraseña no coincide' });

        const token = generateToken(user._id, user.name, user.email.toLowerCase());
        if (!token)
          return res.status(500).send({ message: 'Error al generar token de usuario.' });

        Role.findOne({ _id: user.role }).then(role => {
          if (user.school !== undefined) {
            School.findOne({ _id: user.school }).then(school => {
              return res.status(200).json({
                message: 'Login exitoso.',
                user: {
                  _id: user._id,
                  name: user.name,
                  email: user.email.toLowerCase(),
                  role: {
                    _id: role._id,
                    alias: role.alias,
                    name: role.name
                  },
                  school: {
                    _id: school._id,
                    alias: school.alias,
                    name: school.name
                  },
                  image: user.image,
                  status: user.status,
                  //isAdmin: user.isAdmin,
                  token: token
                }
              });
            });
          } else {
            return res.status(200).json({
              message: 'Login exitoso.',
              user: {
                _id: user._id,
                name: user.name,
                email: user.email.toLowerCase(),
                role: {
                  _id: role._id,
                  alias: role.alias,
                  name: role.name
                },
                image: user.image,
                status: user.status,
                //isAdmin: user.isAdmin,
                token: token
              }
            });
          }
        });
      });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en el login de usuario." });
  }
});

router.post('/edit', async (req, res) => {
  try {
    const { errors, isValid } = validateEditInput(req.body);
    if (!isValid) { return res.status(400).send({ message: errors }) }
    await User.findOne({ _id: req.body._id }).then(user => {
      if (!user)
        return res.status(400).send({ message: "Ha ocurrido un error en la consulta del usuario." });

      user.name = req.body.name
      user.email = req.body.email.toLowerCase()
      user.role = req.body.role
      user.school = req.body.school
      //user.isAdmin =  req.body.isAdmin

      user
        .save()
        .then(user_saved =>
          res.status(200).json({ message: 'Usuario editado exitosamente.', user: user_saved }),
        )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en la edición del usuario." });
  }
});

router.post('/change', async (req, res) => {
  try {
    await User.findOne({ _id: req.body._id }).then(user => {
      if (!user)
        return res.status(400).send({ message: "Ha ocurrido un error en la consulta del usuario." });

      user.status = req.body.status
      user
        .save()
        .then(user_saved =>
          res.status(200).json({ message: 'Estado de usuario editado exitosamente.', user: user_saved }),
        );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en la edición del estado del usuario." });
  }
});

router.post('/delete', async (req, res) => {
  try {
    await User.findOne({ _id: req.body._id }).then(user => {
      if (!user)
        return res.status(400).send({ message: "Ha ocurrido un error en la consulta del usuario." });

      user.status = 2
      user
        .save()
        .then(user_saved =>
          res.status(200).json({ message: 'Usuario eliminado exitosamente.', user: user_saved }),
        );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en la eliminación del usuario." });
  }
});

router.post('/getPass', async (req, res) => {
  try {
    const user = await User.findOne({
      '_id': req.body._id
    });
    await user
      .comparePassword(req.body.password)
      .then(isPasswordValid => {
        if (!isPasswordValid)
          return res.status(400).send({ message: 'La contraseña actual ingresada no coincide con su usuario' });
        res.status(200).json({ message: 'Contraseña verificada.', user: user })
      });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en la comparación de contraseñas." });
  }
});

router.post('/changePass', async (req, res) => {
  try {
    const rounds = 10;
    bcrypt.genSalt(rounds, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err)
          return res.status(500).json({ message: "Ha ocurrido un error en crear hash de la contraseña del usuario." });

        const newTask = {
          password: hash
        };
        User
          .findByIdAndUpdate(req.body._id, newTask)
          .then(user =>
            res.status(200).json({ message: 'Contraseña cambiada exitosamente.', user: user }),
          );
      });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en el cambio de contraseña." });
  }
});

router.post('/recover', async (req, res) => { // Esta funcion envia bien los errores
  try {
    await User.findOne({ $and: [{ email: req.body.email.toLowerCase() }, { status: { $ne: 2 } }] }).then(user => {
      if (!user)
        return res.status(400).send({ message: "Usuario no encontrado." });

      let pass = generatePassword(12, false)
      // Hash password before storing in database
      const rounds = 10;
      bcrypt.genSalt(rounds, (err, salt) => {
        bcrypt.hash(pass, salt, async (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Ha ocurrido un error en crear hash de la contraseña del usuario." });
          }
          user.password = hash;

          let final_response = await mailTemplate.emailTemplate('Recuperación de usuario - SIGECEE', req.body.email.toLowerCase(), "Su nueva contraseña para ingresar al sistema es la siguiente: ", '', pass, '', '', req.get('origin'))
          if (final_response) {
            user.save().then(async user => {
              res.status(200).json({ message: 'Contraseña recuperada exitosamente' });
            });
          } else {
            console.log(final_response)
            res.status(500).send({ message: "Ha ocurrido un error mandando el correo, intente nuevamente." });
          }
        });
      });
    })
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en el cambio de contraseña." });
  }
});

router.post('/recover2', async (req, res) => { // Esta funcion envia bien los errores
  try {
    await User.findOne({ $and: [{ _id: req.body._id }, { status: { $ne: 2 } }] }).then(user => {
      if (!user)
        return res.status(400).send({ message: "Usuario no encontrado." });

      let pass = generatePassword(12, false)
      // Hash password before storing in database
      const rounds = 10;
      bcrypt.genSalt(rounds, (err, salt) => {
        bcrypt.hash(pass, salt, async (err, hash) => {
          if (err) {
            return res.status(500).json({ message: "Ha ocurrido un error en crear hash de la contraseña del usuario." });
          }
          user.password = hash;
          let final_response = await mailTemplate.emailTemplate('Recuperación de usuario - SIGECEE', user.email.toLowerCase(), "Su nueva contraseña para ingresar al sistema es la siguiente: ", '', pass, '', '', req.get('origin'))
          if (final_response) {
            user.save().then(async user => {
              res.status(200).json({ message: 'Contraseña recuperada exitosamente' });
            });
          } else {
            res.status(500).send({ message: "Ha ocurrido un error mandando el correo, intente nuevamente." });
          }
        });
      });
    })
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error en el cambio de contraseña." });
  }
});

router.post('/massive', async (req, res) => {
  try {
    let data_file = req.body.data
    let flag = true
    let message = ''
    if (data_file.length === 0) {
      // flag = false
      // message = "El archivo esta vacío.";
      res.status(400).send({ message: "El archivo esta vacío." });
    } else {

      let arr = JSON.parse(JSON.stringify(data_file));
      //console.log(arr)
      let final_array = []
      let propertyNames = Object.keys(arr[0]);
      let all_roles = await Role.find();
      let all_schools = await School.find();
      let message = "";
      let index_user = 0;
      let index_names = 0;

      for (let item of arr) {
        if (message !== "") {
          break;
        }
        let second_array = []
        index_names = 0
        for (let resp of Object.values(item)) {

          if (index_names === 0) { //Validar nombre
            second_array.push(resp)
          } else if (index_names === 1) {//Validar si es correo valido
            if (/.+@.+..+/.test(resp)) {
              let user_exist = await User.findOne({
                $and: [
                  { email: resp.toLowerCase() },
                  { status: { $ne: 2 } }
                ]
              })
              if (user_exist) {//El correo existe en el sistema
                message = "El correo electrónico de la línea " + (index_user + 1) + " del Excel ya existe en el sistema. Por favor, modifícalo."
                break;
              } else {
                second_array.push(resp.toLowerCase())
              }
            } else {
              message = "El correo electrónico de la línea " + (index_user + 1) + " del Excel es inválido. Por favor, corrígelo."
              break;
            }
          } else if (index_names === 2) {//Validar roles
            //Administrador,Directivo,Profesor/Director de escuela o instituto,Investigador/Estudiante
            if (resp.toString().toUpperCase().includes('ADMINISTRADOR')) {
              //let role = await Role.findOne({ alias: 'ADM' });
              let filter = all_roles.filter(item_f => item_f.alias === 'ADM')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('DECANO') || resp.toString().toUpperCase().includes('COORDINAOR') || resp.toString().toUpperCase().includes('DIRECTOR')) {
              //second_array.push('DIR')
              let filter = all_roles.filter(item_f => item_f.alias === 'DIR')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('PROFESOR') || resp.toString().toUpperCase().includes('INVESTIGADOR')) {
              //second_array.push('POD')
              let filter = all_roles.filter(item_f => item_f.alias === 'POD')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('ESTUDIANTE')) {
              //second_array.push('INV')
              let filter = all_roles.filter(item_f => item_f.alias === 'INV')
              second_array.push(filter[0]._id)
            } else {
              message = "El rol de usuario de la línea " + (index_user + 1) + " del Excel es inválido. Por favor, corrígelo."
              break;
            }
          } else if (index_names === 3) {//Validar escuelas
            //Biología (BIO), Computación (COM), Física (FIS), Geoquímica (GEO), Matemática (MAT), Química (QUI)
            if (resp.toString().toUpperCase().includes('BIOLOGIA') || resp.toString().toUpperCase().includes('BIOLOGÍA')) {
              let filter = all_schools.filter(item_f => item_f.alias === 'BIO')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('COMPUTACION') || resp.toString().toUpperCase().includes('COMPUTACIÓN')) {
              let filter = all_schools.filter(item_f => item_f.alias === 'COM')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('FISICA') || resp.toString().toUpperCase().includes('FÍSICA')) {
              let filter = all_schools.filter(item_f => item_f.alias === 'FIS')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('GEOQUIMICA') || resp.toString().toUpperCase().includes('GEOQUÍMICA')) {
              let filter = all_schools.filter(item_f => item_f.alias === 'GEO')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('MATEMATICA') || resp.toString().toUpperCase().includes('MATEMÁTICA')) {
              let filter = all_schools.filter(item_f => item_f.alias === 'MAT')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('QUIMICA') || resp.toString().toUpperCase().includes('QUÍMICA')) {
              let filter = all_schools.filter(item_f => item_f.alias === 'QUI')
              second_array.push(filter[0]._id)
            } else if (resp.toString().toUpperCase().includes('SIN ESCUELA')) {
              //second_array.push('INV')
              let filter = all_schools.filter(item_f => item_f.alias === 'NA')
              second_array.push(filter[0]._id)
            } else {
              message = "La escuela del usuario en la línea " + (index_user + 1) + " del Excel es inválido. Por favor, corrígela."
              break;
            }
          }
          index_names++;
        }
        if (second_array.length < 4 && message === "") {

          message = "Hay campo(s) vacíos en el archivo en la línea " + (index_user + 1) + " del Excel, debe completar todos los datos."
        } else {
          final_array.push(second_array)
        }

        index_user++;
        console.log(second_array)
        console.log('--resp--')
      }

      if (message !== "") {
        res.status(400).send({ message: message });
      } else {
        console.log(final_array)
        let pass = generatePassword(12, false)

        const rounds = 10;
        bcrypt.genSalt(rounds, (err, salt) => {
          bcrypt.hash(pass, salt, async (err, hash) => {
            if (err) {
              return res.status(500).json({ message: "Ha ocurrido un error en crear hash de la contraseña del usuario, intente nuevamente." });
            }

            let maillist = ''
            let array_object_users = []
            final_array.forEach((data) => {
              maillist = maillist + data[1] + ", ";
              console.log(data[0])
              let newUser = new User({
                name: data[0],
                email: data[1],
                password: hash,
                role: data[2],
                school: data[3],
                status: 1,
                createdBy: req.body.createdBy,
              });
              console.log(newUser)
              array_object_users.push(newUser)

            });
            maillist = maillist.slice(0, -2);
            console.log(array_object_users)

            let final_response = await mailTemplate.emailTemplate('Creación de usuario exitosa - SIGECEE', maillist, "Su nuevo usuario para ingresar al sistema SIGECEE fue creado exitosamente. Ingrese su correo electrónico como su usuario y la siguiente contraseña: ", '', pass, '', '', req.get('origin'))

            if (final_response) {
              User.insertMany(array_object_users).then(async user => {
                res.status(201).json({ message: 'Usuarios importados exitosamente.', user: user });
              });
            } else {
              res.status(500).send({ message: "Ha ocurrido un error mandando el correo, intente nuevamente." });
            }
          });
        });
      }

    }

  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error agregando la población." });
  }
});

module.exports = router;