var express = require('express');
var router = express.Router();

let Census = require("../models/census.model");
let Survey = require("../models/survey.model");
let Study = require("../models/study.model");

router.get("/all", async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {
      await Census.find({}, { _id: 1, status: 1 }).then(async (census) => {
        await Survey.find({}, { _id: 1, status: 1 }).then(async (survey) => {
          await Study.find({}, { _id: 1 }).then((study) => {
            let filter1 = census.filter((r) => r.status === 1);
            let filter2 = survey.filter((r) => r.status === 1);
            let data = {
              censusCount: census.length,
              censusActiveCount: filter1.length,
              surveyCount: survey.length,
              surveyActiveCount: filter2.length,
              studyCount: study.length,
            }
            res.status(200).json({ message: 'Datos encontrados.', data: data })
          })
        })
      })
    } else {
      await Census.find({ createdBy: req.query.key }, { _id: 1, status: 1 }).then(async (census) => {
        await Survey.find({ createdBy: req.query.key }, { _id: 1, status: 1 }).then(async (survey) => {
          await Study.find({ createdBy: req.query.key }, { _id: 1 }).then((study) => {
            let filter1 = census.filter((r) => r.status === 1);
            let filter2 = survey.filter((r) => r.status === 1);
            let data = {
              censusCount: census.length,
              censusActiveCount: filter1.length,
              surveyCount: survey.length,
              surveyActiveCount: filter2.length,
              studyCount: study.length,
            }
            res.status(200).json({ message: 'Datos encontrados.', data: data })
          })
        })
      })
    }

  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando los datos." });
  }
});

module.exports = router;