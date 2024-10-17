var express = require('express');
var router = express.Router();

let Role = require('../models/role.model');

router.get('/all', async (req, res) => {
  try {
    Role
      .find()
      .sort({ order: 1 })
      .then(rol => {
        res.status(200).json({ message: 'Roles encontrados.', roles: rol });
      })
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando los roles." });
  }
})

module.exports = router;