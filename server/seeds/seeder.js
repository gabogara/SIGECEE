let Role = require('../models/role.model');
let School = require('../models/school.model');
let User = require('../models/user.model');

async function Seeder() {
  const data = await Role.find().exec();
  if (data.length !== 0) {
    return;
  }
  const RoleSeed = [
    {
      alias: "ADM",
      name: "Administrador",
      description: "Usuarios administradores de cuentas de usuarios y toda la aplicación. Posee todos los permisos de todos los módulos.",
      order: "1",
    },
    {
      alias: "DIR",
      name: "Decano/Coordinador/Director",
      description: "Posee todos los permisos de todos los módulos menos crear cuentas de usuario. Puede ver todo lo generado por los demás usuarios del sistema.",
      order: "2",
    },
    {
      alias: "POD",
      name: "Profesor/Investigador",
      description: "Posee todos los permisos de todos los módulos menos crear cuentas de usuario. Puede ver todo lo generado por los usuarios de su misma escuela.",
      order: "3",
    },
    {
      alias: "INV",
      name: "Estudiante",
      description: "Posee todos los permisos de todos los módulos menos crear cuentas de usuario. Puede ver lo generado por él mismo.",
      order: "4",
    },
  ];
  await Role.insertMany(RoleSeed)

  const data2 = await School.find().exec();
  if (data2.length !== 0) {
    return;
  }

  const SchoolSeed = [
    {
      alias: "BIO",
      name: "Biología",
    },
    {
      alias: "COM",
      name: "Computación",
    },
    {
      alias: "FIS",
      name: "Física",
    },
    {
      alias: "MAT",
      name: "Matemática ",
    },
    {
      alias: "QUI",
      name: "Química",
    },
    {
      alias: "NA",
      name: "Sin escuela",
    },
  ];
  await School.insertMany(SchoolSeed)

  const data3 = await User.find().exec();
  if (data3.length !== 0) {
    return;
  }

  const roleAdmin = await Role.findOne({ alias: 'ADM' }).select('_id');
  const school = await School.findOne({ alias: 'COM' }).select('_id');

  const UserSeed = [
    {
      name: "Johanna Rojas",
      email: "johargrau@gmail.com",
      password: "$2a$10$RUGkf7.81VPparedIv.YPOJGWjyo6EY1aFTUSO9jZ54ZIDF2hywBa",
      role: roleAdmin,
      school: school,
      status: 1,
    },
    {
      name: "Gabriel Restrepo",
      email: "gabo1gara@gmail.com",
      password: "$2a$10$RUGkf7.81VPparedIv.YPOJGWjyo6EY1aFTUSO9jZ54ZIDF2hywBa",
      role: roleAdmin,
      school: school,
      status: 1,
    },
  ];
  await User.insertMany(UserSeed)

}

module.exports = {
  Seeder: Seeder
};