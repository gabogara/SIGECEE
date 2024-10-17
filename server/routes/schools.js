var express = require('express');
var router = express.Router();

let School = require('../models/school.model');

router.get('/all', async (req, res) => {
  try{ 
    School
      .find()
      .then(school=>{
        res.status(200).json({ message: 'Escuelas encontradas.', schools: school })
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las escuelas." });
  }
})

module.exports = router;