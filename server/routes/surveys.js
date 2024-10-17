var express = require("express");
var router = express.Router();
const Mailer = require("./mailer");
let Survey = require("../models/survey.model");
let SurveyResult = require("../models/surveyResult.model");
let Population = require("../models/population.model");
let Study = require("../models/study.model");
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const mailTemplate = require('./mailTemplate');
var moment = require('moment');
var { nanoid } = require("nanoid");
let Url = require("../models/url.model");

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };
};

const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

const sumArray = (list) => {
  return list.reduce((acc, item) => {
    if (item.elements) {
      acc += item.elements.length;
      return acc;
    }
  }, 0)
}

router.get("/all", async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {
      await Survey.aggregate([
        {
          $lookup: {
            from: "surveyresults",
            localField: "_id",
            foreignField: "survey",
            as: "result_count"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            title: "$data.title",
            count_questions: 1,
            visibility: 1,
            status: 1,
            type: 1,
            population: 1,
            link: 1,
            emailField: 1,
            initDate: 1,
            endDate: 1,
            publishBy: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            result_count: { $size: "$result_count" },
            createdById: "$user_info._id",
            anonymous: 1,
          }
        }
      ]).then((survey) => {
        res.status(200).json({ message: "Encuestas encontradas.", survey: survey });
      });
    } else if (req.query.roleA === 'POD') {
      let all_surveys = await Survey.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        {
          $lookup: {
            from: "roles",
            localField: "user_info.role",
            foreignField: "_id",
            as: "role_info"
          }
        },
        { $unwind: "$role_info" },
        {
          $lookup: {
            from: "schools",
            localField: "user_info.school",
            foreignField: "_id",
            as: "school_info"
          }
        },
        { $unwind: "$school_info" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            visibility: 1,
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        }
      ]);
      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []

      all_surveys.forEach((item) => {
        if (item.createdByAlias === 'ADM' && item.visibility === true) {
          ids_admins.push(item._id)
        } else if (item.createdByAlias === 'DIR' && item.visibility === true) {
          ids_dirs.push(item._id)
        } else if (item.createdByAlias === 'POD') {
          if (item.createdById.toString() === req.query.key.toString()) {
            ids_pods.push(item._id)
          } else {
            if (item.schoolId.toString() === req.query.schoolI.toString() && item.visibility === true) {
              ids_pods.push(item._id)
            }
          }

        }
      })
      await Survey.aggregate([
        {
          $match: {
            $or: [
              { _id: { $in: ids_admins } },
              { _id: { $in: ids_dirs } },
              { _id: { $in: ids_pods } },
            ]
          }
        },
        {
          $lookup: {
            from: "surveyresults",
            localField: "_id",
            foreignField: "survey",
            as: "result_count"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            title: "$data.title",
            count_questions: 1,
            visibility: 1,
            status: 1,
            type: 1,
            population: 1,
            link: 1,
            emailField: 1,
            initDate: 1,
            endDate: 1,
            publishBy: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            result_count: { $size: "$result_count" },
            createdById: "$user_info._id",
            anonymous: 1,
          }
        }
      ]).then((survey) => {
        res.status(200).json({ message: "Encuestas encontradas.", survey: survey });
      });
    } else {
      let all_surveys = await Survey.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        {
          $lookup: {
            from: "roles",
            localField: "user_info.role",
            foreignField: "_id",
            as: "role_info"
          }
        },
        { $unwind: "$role_info" },
        {
          $lookup: {
            from: "schools",
            localField: "user_info.school",
            foreignField: "_id",
            as: "school_info"
          }
        },
        { $unwind: "$school_info" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            visibility: 1,
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        }
      ]);
      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []
      let ids_invs = []

      all_surveys.forEach((item) => {
        if (item.createdByAlias === 'ADM' && item.visibility === true) {
          ids_admins.push(item._id)
        } else if (item.createdByAlias === 'DIR' && item.visibility === true) {
          ids_dirs.push(item._id)
        } else if (item.createdByAlias === 'POD' && item.visibility === true) {
          if (item.schoolId.toString() === req.query.schoolI.toString()) {
            ids_pods.push(item._id)
          }
        } else {//Estudiantes
          if (item.createdById.toString() === req.query.key.toString()) {
            ids_invs.push(item._id)
          }
        }
      })
      await Survey.aggregate([
        {
          $match: {
            $or: [
              { _id: { $in: ids_admins } },
              { _id: { $in: ids_dirs } },
              { _id: { $in: ids_pods } },
              { _id: { $in: ids_invs } },
            ]
          }
        },
        {
          $lookup: {
            from: "surveyresults",
            localField: "_id",
            foreignField: "survey",
            as: "result_count"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            title: "$data.title",
            count_questions: 1,
            visibility: 1,
            status: 1,
            type: 1,
            population: 1,
            link: 1,
            emailField: 1,
            initDate: 1,
            endDate: 1,
            publishBy: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            result_count: { $size: "$result_count" },
            createdById: "$user_info._id",
            anonymous: 1,
          }
        }
      ]).then((survey) => {
        res.status(200).json({ message: "Encuestas encontradas.", survey: survey });
      });
    }

  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las encuestas." });
  }
});

router.get("/get", async (req, res) => {
  try {
    Survey.findOne({ _id: req.query.id }).populate("createdBy").then((survey) => {
      res.status(200).json({ message: "Encuesta encontrada.", survey: survey });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando la encuesta." });
  }
});

router.post("/add", async (req, res) => {
  try {
    if (sumArray(req.body.data.pages) && sumArray(req.body.data.pages) > 0) {
      const newSurvey = new Survey({
        data: req.body.data,
        count_questions: sumArray(req.body.data.pages),
        visibility: 0,
        createdBy: req.body.createdBy,
      });

      newSurvey.save().then((survey) =>
        res.status(201).json({ message: "Encuesta agregada exitosamente.", survey: survey })
      );
    } else {
      return res.status(400).send({
        message: "No pueden haber páginas de la encuesta vacías, por favor, agregue preguntas o bórrelas.",
      });
    }

  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la encuesta." });
  }
});

router.post("/edit", async (req, res) => {
  try {
    Survey.findOne({ _id: req.body._id }).then((survey) => {
      if (!survey)
        return res.status(400).send({
          message: "La encuesta no se encuentra registrada en el sistema.",
        });
      if (sumArray(req.body.data.pages) && sumArray(req.body.data.pages) > 0) {
        survey.data = req.body.data;
        survey.count_questions = sumArray(req.body.data.pages);
        survey.save().then((survey_saved) =>
          res.status(200).json({
            message: "Encuesta editada exitosamente.",
            survey: survey_saved,
          })
        );
      } else {
        return res.status(400).send({
          message: "No pueden haber páginas de la encuesta vacías, por favor, agregue preguntas o bórrelas.",
        });
      }

    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando la encuesta." });
  }
});

router.post("/change", async (req, res) => {
  try {
    Survey.findOne({ _id: req.body._id }).then((survey) => {
      if (!survey)
        return res.status(400).send({
          message: "La encuesta no se encuentra registrada en el sistema.",
        });

      survey.visibility = req.body.visibility;
      var stringVisib = req.body.visibility === true ? "visible para los usuarios" : "visible solo para mí";
      survey.save().then((survey_saved) =>
        res.status(200).json({
          message: "La encuesta es " + stringVisib + " ahora.",
          survey: survey_saved,
        })
      );
    });
  } catch (e) {
    res.status(500).send({
      message: "Ha ocurrido un error cambiando la visibilidad de la encuesta.",
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    Survey.findOne({ _id: req.body._id }).then((survey) => {
      if (!survey)
        return res.status(400).send({
          message: "La encuesta no se encuentra registrada en el sistema.",
        });

      survey.deleteOne().then(() =>
        res.status(200).json({ message: "Encuesta eliminada exitosamente.", survey: true })
      );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error eliminando la encuesta." });
  }
});

router.post("/publish", async (req, res) => {
  try {
    Survey.findOne({ _id: req.body._id }).then(async (survey) => {
      if (!survey)
        return res.status(400).send({ message: "La encuesta no se encuentra registrada en el sistema.", });

      survey.type = req.body.type;
      survey.initDate = moment().format();
      survey.endDate = req.body.endDate;
      survey.publishBy = req.body.publishBy;
      survey.status = 1;
      survey.anonymous = req.body.anonymous

      var encrypt_survey = encrypt(req.body._id.toString())
      var link = req.get('origin') + '/surveyForm?id=' + encrypt_survey.content + '&k1=' + encrypt_survey.iv

      const base = process.env.BASE;
      const urlId = nanoid();
      const shortUrl = `${base}/${urlId}`;

      let url = new Url({
        origUrl: link,
        shortUrl,
        urlId,
        date: new Date(),
      });

      await url.save();
      survey.link = shortUrl;

      if (req.body.type === 0) {
        survey.save().then(async (survey_saved) => {
          res.status(200).json({
            message: "Encuesta publicada correctamente.", survey: survey_saved,
          });
        });
      } else {

        /*if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(req.body.emailField))
          return res.status(400).send({ message: "El campo de correo seleccionado, no tiene un formato válido de correo, ingrese otro.", });*/

        survey.emailField = req.body.emailField;
        survey.population = req.body.population;

        let maillist = ''
        await Population.findOne({ _id: req.body.population }).then((population) => {
          population.data.forEach((data, index) => {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[req.body.emailField])) {
              maillist = maillist + data[req.body.emailField] + ", ";
            }
          });
        });
        if (maillist.length > 0) {
          maillist = maillist.slice(0, -2);

          let final_response = await mailTemplate.emailTemplate("Encuesta: " + survey.data.title + ' - SIGECEE', maillist, "Te invitamos a participar en la siguiente encuesta:", survey.data.title, '', 'Ingresa a la encuesta desde el siguiente enlace y ¡participa!', 'Realiza tu encuesta antes del ' + moment(survey.endDate).format('DD/MM/YYYY'), shortUrl)
          survey.maillist = maillist.split(', ');
          if (final_response) {
            survey.save().then(async (survey_saved) => {
              res.status(200).json({
                message: "Encuesta publicada correctamente.", survey: survey_saved,
              });
            });
          } else {
            res.status(500).send({ message: "Ha ocurrido un error mandando los correos de la encuesta, intente nuevamente." });
          }
        } else {
          return res.status(400).send({ message: "No existen correos para este campo, intente nuevamente con otro campo o con otra población", });
        }
      }
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando la encuesta." });
  }
});

router.post("/prevalidate", async (req, res) => {
  try {
    let obj1 = {
      iv: req.body.iv,
      content: req.body._id,
    }
    var dencrypt_survey = decrypt(obj1)
    const exist = await Survey.findOne({ _id: dencrypt_survey, status: 1, type: 0 })
    if (exist) {
      const existe_survey = await SurveyResult.findOne({ ip: req.body.ip, survey: dencrypt_survey })
      if (existe_survey) {
        res.status(403).json({ message: "Ya has participado en esta encuesta.", participation: true });
      } else {
        res.status(200).json({ message: "Encuesta encontrada.", survey: exist.data });
      }
    } else {
      res.status(403).json({ message: "Encuesta finalizada." });
    }
  } catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las encuestas." });
  }
});

router.post("/validate", async (req, res) => {
  try {
    let obj1 = {
      iv: req.body.iv,
      content: req.body._id,
    }
    var dencrypt_survey = decrypt(obj1)
    let valid = false
    let survey_data = ''
    let type = 0
    await Survey.findOne({ _id: dencrypt_survey, status: 1 }).then(async (survey) => {
      type = survey.type
      await Population.findOne({ _id: survey.population }).then((population) => {
        population.data.forEach((item) => {
          if (item[survey.emailField].toLowerCase() === req.body.email.toLowerCase()) {
            valid = true
            survey_data = survey.data
          }
        });
      });
    });
    if (valid) {

      if (type === 1) {
        const existe_survey = await SurveyResult.findOne({ email: req.body.email.toLowerCase(), survey: dencrypt_survey })
        if (existe_survey) {
          res.status(403).json({ message: "Ya has participado en esta encuesta.", participation: true });
        } else {
          res.status(200).json({ message: "Encuesta encontrada.", survey: survey_data });
        }
      } else {
        res.status(200).json({ message: "Encuesta encontrada.", survey: survey_data });
      }
    } else {
      res.status(403).json({ message: "El correo no pertenece a la encuesta." });
    }
  } catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las encuestas." });
  }
});

router.post("/results", async (req, res) => {
  try {
    let obj1 = {
      iv: req.body.iv,
      content: req.body._id,
    }
    var dencrypt_survey = decrypt(obj1)
    await Survey.findOne({ _id: dencrypt_survey }).then(async (survey) => {
      if (!survey)
        return res.status(400).send({ message: "La encuesta no se encuentra registrado en el sistema.", });

      var newSurveyResult = {}
      if (req.body.email) {
        newSurveyResult = new SurveyResult({
          survey: survey._id,
          result: req.body.data,
          ip: req.body.ip,
          email: req.body.email.toLowerCase()
        });
      } else {
        newSurveyResult = new SurveyResult({
          survey: survey._id,
          result: req.body.data,
          ip: req.body.ip
        });
      }

      newSurveyResult.save().then((survey_result) =>
        res.status(201).json({ message: "Respuesta de encuesta agregada exitosamente.", survey: survey_result })
      );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la encuesta." });
  }
});

router.post("/getResults", async (req, res) => {
  try {
    await SurveyResult.find({ survey: req.body._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      res.status(200).json({ message: "Respuestas consultadas exitosamente.", results: result })
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las respuestas de la encuesta." });
  }
});

router.get("/getResultsJson", async (req, res) => {
  try {
    await SurveyResult.find({ survey: req.query._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      let study = await Study.findOne({
        $and: [
          { survey: req.query._id },
          { ins_type: "Encuesta" }
        ]
      });

      let array = result.map(item => item.result)
      let obj_final = {
        results: array,
        study: study ?? null,
      }
      res.status(200).json({ message: "Respuestas consultadas exitosamente.", results: obj_final })
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las respuestas." });
  }
});

const readResponses = (item2, item, index, allQuestionStruct, allResults) => {
  if (allQuestionStruct[item].choices) { //Tipos: Radio, Checkbox, Dropdown, Raking
    if (allQuestionStruct[item].choices.includes(item2[item])) { // Val es un string contenido en choices
      return item2[item]
    } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) { //Tiene la opcion de "Ninguno" activo
      if (allQuestionStruct[item].noneText) {
        return allQuestionStruct[item].noneText
      } else {
        return 'Ninguno'
      }
    } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) { //Tiene la opcion de "Otro" activado y se busca la respuesta en [name]-Comment"
      return allResults[index][item + "-Comment"]
    } else if (Array.isArray(item2[item])) { //Las respuestas es un arreglo
      let string = []
      item2[item].forEach((item_array) => {
        if (allQuestionStruct[item].choices.includes(item_array)) { // Val es un string contenido en choices
          string.push(item_array)
        } else if (item_array === 'none' && allQuestionStruct[item].showNoneItem) {
          if (allQuestionStruct[item].noneText) {
            string.push(allQuestionStruct[item].noneText)
          } else {
            string.push('Ninguno')
          }
        } else if (item_array === 'other' && allQuestionStruct[item].showOtherItem) {
          string.push(allResults[index][item + "-Comment"])
        } else {
          let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item_array);
          string.push(filter[0].text)
        }
      });
      return string
    } else { // Val es un objeto con estructura {value: __, text: __} contenido en choices
      let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[item]);
      if (allQuestionStruct[item].type === 'imagepicker') {
        return filter[0].imageLink
      } else {
        return filter[0].text
      }
    }
  } else if (allQuestionStruct[item].rateValues) { //Rating(Calificacion)
    if (allQuestionStruct[item].rateValues.includes(item2[item])) { // Val es un string contenido en rateValues
      return item2[item]
    } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) {
      if (allQuestionStruct[item].noneText) {
        return allQuestionStruct[item].noneText
      } else {
        return 'Ninguno'
      }
    } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) {
      return allResults[index][item + "-Comment"]
    } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
      let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[item]);
      return filter[0].text
    }
  } else if (allQuestionStruct[item].labelTrue || allQuestionStruct[item].labelFalse) { //Booleano
    if (allQuestionStruct[item].labelTrue && allQuestionStruct[item].labelFalse) {
      if (item2[item] == true) {
        return allQuestionStruct[item].labelTrue
      } else {
        return allQuestionStruct[item].labelFalse
      }
    } else if (allQuestionStruct[item].labelTrue) {
      if (item2[item] == true) {
        return allQuestionStruct[item].labelTrue
      } else {
        return 'No'
      }
    } else if (allQuestionStruct[item].labelFalse) {
      if (item2[item] == false) {
        return allQuestionStruct[item].labelFalse
      } else {
        return 'Sí'
      }
    } else {
      if (item2[item] === false) {
        return 'No'
      } else if (item2[item] === true) {
        return 'Sí'
      } else {
        return item2[item]
      }
    }
  } else if (allQuestionStruct[item].items) {//Multiple text
    if (typeof item2[item] === 'object') {
      return Object.values(item2[item])
    } else {
      return item2[item]
    }
  } else if (allQuestionStruct[item].columns && allQuestionStruct[item].rows) {//Matrix
    let string = []
    Object.entries(item2[item]).forEach(entry => {
      if (allQuestionStruct[item].rows.includes(entry[0])) { //Si la incluye, pusheo tal cual
        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna, pusheo tal cual
          let obj_matrix = {}
          obj_matrix[entry[0].toString()] = entry[1].toString()
          string.push(obj_matrix)
        } else {
          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
          let obj_matrix = {}
          obj_matrix[entry[0].toString()] = filter_c[0].text.toString()
          string.push(obj_matrix)
        }
      } else {//debo hacer un filter y buscar el text
        let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);
        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
          let obj_matrix = {}
          obj_matrix[filter_r[0].text.toString()] = entry[1].toString()
          string.push(obj_matrix)
        } else {
          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
          let obj_matrix = {}
          obj_matrix[filter_r[0].text.toString()] = filter_c[0].text.toString()
          string.push(obj_matrix)
        }
      }
    })
    return string;
  } else if (allQuestionStruct[item].elements) {
    let allQuestionStructPanel = {}
    allQuestionStruct[item].elements.forEach(item => {
      allQuestionStructPanel[item.name] = item
    });

    Object.keys(allQuestionStructPanel).forEach((item3) => {
      return readResponses(item2, item3, index, allQuestionStructPanel, allResults)
    })
  } else {
    return item2[item]
  }
}

const readHeaders = (element) => {
  if (element.type !== 'panel') {
    return [element.name, element.title ? element.title : element.name];
  } else {
    let headers = [];
    element.elements.forEach((element2) => {
      headers.push(...readHeaders(element2));
    });
    return headers;
  }
};

const readStruct = (element) => {
  if (element.type !== 'panel') {
    return [element.name, element];
  } else {
    let structs = [];
    element.elements.forEach((element2) => {
      structs.push(...readStruct(element2));
    });
    return structs;
  }
};

const readResults = (key, allQuestionStruct) => {
  if (allQuestionStruct[key].type === 'checkbox' || allQuestionStruct[key].type === 'tagbox' || allQuestionStruct[key].type === 'multipletext') {
    const array_concat = object_responses_final[key].flat(1);

    return [key, allQuestionStruct[key], array_concat.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {})]
  } else if (allQuestionStruct[key].type === 'matrix') {
    let array_concat = []
    object_responses_final[key].forEach(item => {
      item.forEach(item2 => {
        array_concat.push(item2)
      })
    })
    let array_flat = array_concat.flat(1);
    array_flat.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {})
    let array_strings = []
    array_flat.forEach(item => {
      let entries = Object.entries(item)[0]
      let string = entries[0] + ': ' + entries[1]
      array_strings.push(string)
    })
    return [key, allQuestionStruct[key], array_strings.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {})]
  } else if (allQuestionStruct[key].type === 'panel') {
    let allQuestionStructPanel = {}
    allQuestionStruct[key].elements.forEach(item => {
      let final = readStruct(item)
      final.forEach((item, index) => {
        if (index % 2 === 0) {
          allQuestionStructPanel[final[index]] = final[index + 1]
        }
      })
    });
    Object.keys(allQuestionStructPanel).forEach(item => {
      return readResults(item, allQuestionStructPanel, object_responses_final)
    });
  } else {
    return [key, allQuestionStruct[key], object_responses_final[key].reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {})]
  }
};

router.get("/getResultsChart", async (req, res) => {
  try {

    await SurveyResult.find({ survey: req.query._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      let study = await Study.findOne({
        $and: [
          { survey: req.query._id },
          { ins_type: "Encuesta" }
        ]
      });

      let survey = await Survey.findOne({ _id: req.query._id });

      let all_id_question = {} //name (Id) de todas las preguntas en el censo
      survey.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readHeaders(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              all_id_question[final[index]] = final[index + 1]
            }
          })
        })
      });

      let allResults = []
      result.forEach(item => {
        if (item.result) {
          allResults.push(item.result)
        }
      })

      let allQuestionStruct = {}
      survey.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readStruct(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              allQuestionStruct[final[index]] = final[index + 1]
            }
          })
        })
      });

      let object_responses_final = {}
      Object.keys(all_id_question).map(item => object_responses_final[item] = [])

      Object.keys(allQuestionStruct).forEach((item) => {
        allResults.forEach((item2, index) => {
          if (typeof item2[item] !== 'undefined' || (!item2[item] && allQuestionStruct[item].type === 'panel')) {//Existe esa respuesta
            if (allQuestionStruct[item].choices) { //Tipos: Radio, Checkbox, Dropdown, Raking
              if (allQuestionStruct[item].choices.includes(item2[item])) { // Val es un string contenido en choices
                object_responses_final[item].push(item2[item])
              } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) { //Tiene la opcion de "Ninguno" activo
                if (allQuestionStruct[item].noneText) {
                  object_responses_final[item].push(allQuestionStruct[item].noneText)
                } else {
                  object_responses_final[item].push('Ninguno')
                }
              } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) { //Tiene la opcion de "Otro" activado y se busca la respuesta en [name]-Comment"
                object_responses_final[item].push(allResults[index][item + "-Comment"])
              } else if (Array.isArray(item2[item])) { //Las respuestas es un arreglo
                let string = []
                item2[item].forEach((item_array) => {
                  if (allQuestionStruct[item].choices.includes(item_array)) { // Val es un string contenido en choices
                    string.push(item_array)
                  } else if (item_array === 'none' && allQuestionStruct[item].showNoneItem) {
                    if (allQuestionStruct[item].noneText) {
                      string.push(allQuestionStruct[item].noneText)
                    } else {
                      string.push('Ninguno')
                    }
                  } else if (item_array === 'other' && allQuestionStruct[item].showOtherItem) {
                    string.push(allResults[index][item + "-Comment"])
                  } else {
                    let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item_array);
                    string.push(filter[0].text)
                  }
                });
                object_responses_final[item].push(string);
              } else { // Val es un objeto con estructura {value: __, text: __} contenido en choices
                let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[item]);
                if (allQuestionStruct[item].type === 'imagepicker') {

                  object_responses_final[item].push(filter[0].imageLink)
                } else {
                  object_responses_final[item].push(filter[0].text)

                }
              }
            } else if (allQuestionStruct[item].rateValues) { //Rating(Calificacion)

              if (allQuestionStruct[item].rateValues.includes(item2[item])) { // Val es un string contenido en rateValues

                object_responses_final[item].push(item2[item])
              } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) {
                if (allQuestionStruct[item].noneText) {
                  object_responses_final[item].push(allQuestionStruct[item].noneText)
                } else {
                  object_responses_final[item].push('Ninguno')
                }
              } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) {
                object_responses_final[item].push(allResults[index][item + "-Comment"])
              } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
                let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[item]);
                object_responses_final[item].push(filter[0].text)
              }
            } else if ((allQuestionStruct[item].type === 'boolean')) { //Booleano
              if (allQuestionStruct[item].labelTrue && allQuestionStruct[item].labelFalse) {
                if (item2[item] == true) {
                  object_responses_final[item].push(allQuestionStruct[item].labelTrue)
                } else {
                  object_responses_final[item].push(allQuestionStruct[item].labelFalse)
                }
              } else if (allQuestionStruct[item].labelTrue) {
                if (item2[item] == true) {
                  object_responses_final[item].push(allQuestionStruct[item].labelTrue)
                } else {
                  object_responses_final[item].push('No')
                }
              } else if (allQuestionStruct[item].labelFalse) {
                if (item2[item] == false) {
                  object_responses_final[item].push(allQuestionStruct[item].labelFalse)
                } else {
                  object_responses_final[item].push('Sí')
                }
              } else {
                if (item2[item] === false) {
                  object_responses_final[item].push('No')
                } else if (item2[item] === true) {
                  object_responses_final[item].push('Sí')
                } else {
                  object_responses_final[item].push(item2[item])
                }
              }
            } else if (allQuestionStruct[item].items) {//Multiple text
              if (typeof item2[item] === 'object') {
                object_responses_final[item].push(Object.values(item2[item]))
              } else {
                object_responses_final[item].push(item2[item])
              }
            } else if (allQuestionStruct[item].columns && allQuestionStruct[item].rows) {//Matrix
              let string = []
              Object.entries(item2[item]).forEach(entry => {
                if (allQuestionStruct[item].rows.includes(entry[0])) { //Si la incluye, pusheo tal cual
                  if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna, pusheo tal cual
                    let obj_matrix = {}
                    obj_matrix[entry[0].toString()] = entry[1].toString()
                    string.push(obj_matrix)
                  } else {
                    let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                    let obj_matrix = {}
                    obj_matrix[entry[0].toString()] = filter_c[0].text.toString()
                    string.push(obj_matrix)
                  }
                } else {//debo hacer un filter y buscar el text
                  let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);
                  if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
                    let obj_matrix = {}
                    obj_matrix[filter_r[0].text.toString()] = entry[1].toString()
                    string.push(obj_matrix)
                  } else {
                    let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                    let obj_matrix = {}
                    obj_matrix[filter_r[0].text.toString()] = filter_c[0].text.toString()
                    string.push(obj_matrix)
                  }
                }
              })
              object_responses_final[item].push(string);
            } else if (allQuestionStruct[item].elements) {
              let allQuestionStructPanel = {}
              allQuestionStruct[item].elements.forEach(item => {
                let final = readStruct(item)
                final.forEach((item, index) => {
                  if (index % 2 === 0) {
                    allQuestionStructPanel[final[index]] = final[index + 1]
                  }
                })
              });
              Object.keys(allQuestionStructPanel).forEach((item3) => {
                object_responses_final[item3].push(readResponses(item2, item3, index, allQuestionStructPanel, allResults))
              })
            } else {
              object_responses_final[item].push(item2[item])
            }
          } else {//No existe esta respuesta, por lo que se debe insertar en null
            object_responses_final[item].push("Sin respuesta")
          }
        })
      });

      let obj_res = {}
      Object.keys(allQuestionStruct).forEach((key, index) => {
        if (allQuestionStruct[key].type === 'checkbox' || allQuestionStruct[key].type === 'tagbox' || allQuestionStruct[key].type === 'multipletext') {
          const array_concat = object_responses_final[key].flat(1);
          obj_res[key] = {
            question_info: allQuestionStruct[key],
            question_results: array_concat.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          }
        } else if (allQuestionStruct[key].type === 'matrix') {
          let array_concat = []
          object_responses_final[key].forEach(item => {
            item.forEach(item2 => {
              array_concat.push(item2)
            })
          })
          let array_flat = array_concat.flat(1);
          obj_res[key] = {
            question_info: allQuestionStruct[key],
            question_results: array_flat.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          }

          let array_strings = []
          array_flat.forEach(item => {
            let entries = Object.entries(item)[0]
            let string = entries[0] + ': ' + entries[1]
            array_strings.push(string)
          })
          obj_res[key] = {
            question_info: allQuestionStruct[key],
            question_results: array_strings.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          }

        } else {
          obj_res[key] = {
            question_info: allQuestionStruct[key],
            question_results: object_responses_final[key].reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          }
        }

      });

      let obj_final = {
        results: obj_res,
        study: study ?? null,
      }
      res.status(200).json({ message: "Respuestas consultadas exitosamente.", results: obj_final })
    });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las respuestas." });
  }
});


router.post("/close", async (req, res) => {
  try {
    Survey.findOne({ _id: req.body._id }).then((survey) => {
      if (!survey)
        return res.status(400).send({
          message: "La encuesta no se encuentra registrada en el sistema.",
        });
      const today = moment()
      survey.status = 2;
      survey.endDate = today.toDate();
      survey.save().then((survey_saved) =>
        res.status(200).json({
          message: "Encuesta finalizada exitosamente.",
          survey: survey_saved,
        })
      );

    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error cerrando la encuesta." });
  }
});

router.post("/date", async (req, res) => {
  try {
    Survey.findOne({ _id: req.body._id }).then((survey) => {
      if (!survey)
        return res.status(400).send({
          message: "La encuesta no se encuentra registrada en el sistema.",
        });
      survey.endDate = req.body.endDate;
      survey.save().then((survey_saved) =>
        res.status(200).json({
          message: "Fecha fin de encuesta editada exitosamente.",
          survey: survey_saved,
        })
      );

    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error cambiando fecha fin de la encuesta." });
  }
});

function esArrayDeNumeros(array) {
  // Comprobamos si el argumento es un array
  if (!Array.isArray(array)) {
    return false;
  }

  // Verificamos si todos los elementos del array son números
  for (let i = 0; i < array.length; i++) {
    if (typeof array[i] !== 'number') {
      return false;
    }
  }

  return true;
}

const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

const mode = arr => {
  const mode = {};
  let max = 0, count = 0;

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];

    if (mode[item]) {
      mode[item]++;
    } else {
      mode[item] = 1;
    }

    if (count < mode[item]) {
      max = item;
      count = mode[item];
    }
  }

  return max;
};

const range = arr => {
  arr.sort((a, b) => a - b);

  return "[" + arr[0] + ", " + arr[arr.length - 1] + "]";
};

router.get("/getExcelReport", async (req, res) => {
  try {

    await SurveyResult.find({ survey: req.query._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      let survey = await Survey.findOne({ _id: req.query._id });

      let all_id_question = {} //name (Id) de todas las preguntas en el censo
      survey.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readHeaders(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              all_id_question[final[index]] = final[index + 1]
            }
          })
        })
      });

      let allResults = []
      result.forEach(item => {
        if (item.result) {
          allResults.push(item.result)
        }
      })

      let allQuestionStruct = {}
      survey.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readStruct(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              allQuestionStruct[final[index]] = final[index + 1]
            }
          })
        })
      });

      let object_responses_final = {}
      Object.keys(all_id_question).map(item => object_responses_final[item] = [])

      Object.keys(allQuestionStruct).forEach((item) => {
        allResults.forEach((item2, index) => {
          if (typeof item2[item] !== 'undefined' || (!item2[item] && allQuestionStruct[item].type === 'panel')) {//Existe esa respuesta
            if (allQuestionStruct[item].choices) { //Tipos: Radio, Checkbox, Dropdown, Raking
              if (allQuestionStruct[item].choices.includes(item2[item])) { // Val es un string contenido en choices
                object_responses_final[item].push(item2[item])
              } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) { //Tiene la opcion de "Ninguno" activo
                if (allQuestionStruct[item].noneText) {
                  object_responses_final[item].push(allQuestionStruct[item].noneText)
                } else {
                  object_responses_final[item].push('Ninguno')
                }
              } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) { //Tiene la opcion de "Otro" activado y se busca la respuesta en [name]-Comment"
                object_responses_final[item].push(allResults[index][item + "-Comment"])
              } else if (Array.isArray(item2[item])) { //Las respuestas es un arreglo
                let string = ''
                item2[item].forEach((item_array) => {
                  if (allQuestionStruct[item].choices.includes(item_array)) { // Val es un string contenido en choices
                    string = string + item_array + ','
                  } else if (item_array === 'none' && allQuestionStruct[item].showNoneItem) {
                    if (allQuestionStruct[item].noneText) {
                      string = string + allQuestionStruct[item].noneText + ','
                    } else {
                      string = string + 'Ninguno' + ','
                    }
                  } else if (item_array === 'other' && allQuestionStruct[item].showOtherItem) {
                    string = string + allResults[index][item + "-Comment"] + ','
                  } else {
                    let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item_array);
                    string = string + filter[0].text + ','
                  }
                });
                object_responses_final[item].push(string.slice(0, -1));
              } else { // Val es un objeto con estructura {value: __, text: __} contenido en choices
                let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[item]);
                if (allQuestionStruct[item].type === 'imagepicker') {

                  object_responses_final[item].push(filter[0].imageLink)
                } else {
                  object_responses_final[item].push(filter[0].text)

                }
              }
            } else if (allQuestionStruct[item].rateValues) { //Rating(Calificacion)
              if (allQuestionStruct[item].rateValues.includes(item2[item])) { // Val es un string contenido en rateValues
                object_responses_final[item].push(item2[item])
              } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) {
                if (allQuestionStruct[item].noneText) {
                  object_responses_final[item].push(allQuestionStruct[item].noneText)
                } else {
                  object_responses_final[item].push('Ninguno')
                }
              } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) {
                object_responses_final[item].push(allResults[index][item + "-Comment"])
              } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
                let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[item]);
                object_responses_final[item].push(filter[0].text)
              }
            } else if ((allQuestionStruct[item].type === 'boolean')) { //Booleano
              if (allQuestionStruct[item].labelTrue && allQuestionStruct[item].labelFalse) {
                if (item2[item] == true) {
                  object_responses_final[item].push(allQuestionStruct[item].labelTrue)
                } else {
                  object_responses_final[item].push(allQuestionStruct[item].labelFalse)
                }
              } else if (allQuestionStruct[item].labelTrue) {
                if (item2[item] == true) {
                  object_responses_final[item].push(allQuestionStruct[item].labelTrue)
                } else {
                  object_responses_final[item].push('No')
                }
              } else if (allQuestionStruct[item].labelFalse) {
                if (item2[item] == false) {
                  object_responses_final[item].push(allQuestionStruct[item].labelFalse)
                } else {
                  object_responses_final[item].push('Sí')
                }
              } else {
                if (item2[item] === false) {
                  object_responses_final[item].push('No')
                } else if (item2[item] === true) {
                  object_responses_final[item].push('Sí')
                } else {
                  object_responses_final[item].push(item2[item])
                }
              }
            } else if (allQuestionStruct[item].items) {//Multiple text
              if (typeof item2[item] === 'object') {
                let string = ""
                Object.entries(item2[item]).forEach(entry => {
                  let filter_c = allQuestionStruct[item].items.filter(item_filter => item_filter.name === entry[0]);
                  string = string + (filter_c[0].title ? filter_c[0].title : filter_c[0].name) + ":" + entry[1] + "|"

                })
                object_responses_final[item].push(string.slice(0, -1))
              } else {
                object_responses_final[item].push(item2[item])
              }
            } else if (allQuestionStruct[item].columns && allQuestionStruct[item].rows) {//Matrix
              let string = ''
              Object.entries(item2[item]).forEach(entry => {
                if (allQuestionStruct[item].rows.includes(entry[0])) { //Si la incluye, pusheo tal cual
                  if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna, pusheo tal cual
                    string = string + entry[0].toString() + ':' + entry[1].toString() + '|'
                  } else {
                    let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                    string = string + entry[0].toString() + ':' + filter_c[0].text.toString() + '|'
                  }
                } else {//debo hacer un filter y buscar el text
                  let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);

                  if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
                    string = string + filter_r[0].text.toString() + ':' + entry[1].toString() + '|'
                  } else {
                    let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                    string = string + filter_r[0].text.toString() + ':' + filter_c[0].text.toString() + '|'
                  }
                }
              })
              object_responses_final[item].push(string.slice(0, -1));
            } else if (allQuestionStruct[item].elements) {
              let allQuestionStructPanel = {}
              allQuestionStruct[item].elements.forEach(item => {
                let final = readStruct(item)
                final.forEach((item, index) => {
                  if (index % 2 === 0) {
                    allQuestionStructPanel[final[index]] = final[index + 1]
                  }
                })
              });
              Object.keys(allQuestionStructPanel).forEach((item3) => {
                object_responses_final[item3].push(readResponses(item2, item3, index, allQuestionStructPanel, allResults))
              })
            } else {
              object_responses_final[item].push(item2[item])
            }
          } else {//No existe esta respuesta, por lo que se debe insertar en null
            object_responses_final[item].push("Sin respuesta")
          }
        })
      });

      let obj_res = []
      Object.keys(allQuestionStruct).forEach((key, index) => {
        if (allQuestionStruct[key].type === 'checkbox' || allQuestionStruct[key].type === 'tagbox' || allQuestionStruct[key].type === 'multipletext') {
          const array_concat = object_responses_final[key].flat(1);
          obj_res.push({
            question_title: allQuestionStruct[key].title ?? allQuestionStruct[key].name,
            question_results: array_concat,
          })

        } else if (allQuestionStruct[key].type === 'matrix') {
          obj_res.push({
            question_title: allQuestionStruct[key].title ?? allQuestionStruct[key].name,
            question_results: object_responses_final[key]
          })

        } else {
          obj_res.push({
            question_title: allQuestionStruct[key].title ?? allQuestionStruct[key].name,
            question_results: object_responses_final[key],
          })
        }
      });

      let finalArray = []

      for (let i = 0; i < obj_res[0].question_results.length; i++) {
        let objInt = {}
        for (let j = 0; j < obj_res.length; j++) {
          objInt[obj_res[j].question_title] = obj_res[j].question_results[i]
        }
        finalArray.push(objInt)
      }

      object_responses_final = {}
      Object.keys(all_id_question).map(item => object_responses_final[item] = [])

      Object.keys(allQuestionStruct).forEach((item) => {
        allResults.forEach((item2, index) => {
          if (typeof item2[item] !== 'undefined' || (!item2[item] && allQuestionStruct[item].type === 'panel')) {//Existe esa respuesta
            if (allQuestionStruct[item].choices) { //Tipos: Radio, Checkbox, Dropdown, Raking
              if (allQuestionStruct[item].choices.includes(item2[item])) { // Val es un string contenido en choices
                object_responses_final[item].push(item2[item])
              } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) { //Tiene la opcion de "Ninguno" activo
                if (allQuestionStruct[item].noneText) {
                  object_responses_final[item].push(allQuestionStruct[item].noneText)
                } else {
                  object_responses_final[item].push('Ninguno')
                }
              } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) { //Tiene la opcion de "Otro" activado y se busca la respuesta en [name]-Comment"
                object_responses_final[item].push(allResults[index][item + "-Comment"])
              } else if (Array.isArray(item2[item])) { //Las respuestas es un arreglo
                let string = []
                item2[item].forEach((item_array) => {
                  if (allQuestionStruct[item].choices.includes(item_array)) { // Val es un string contenido en choices
                    string.push(item_array)
                  } else if (item_array === 'none' && allQuestionStruct[item].showNoneItem) {
                    if (allQuestionStruct[item].noneText) {
                      string.push(allQuestionStruct[item].noneText)
                    } else {
                      string.push('Ninguno')
                    }
                  } else if (item_array === 'other' && allQuestionStruct[item].showOtherItem) {
                    string.push(allResults[index][item + "-Comment"])
                  } else {
                    let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item_array);
                    string.push(filter[0].text)
                  }
                });
                object_responses_final[item].push(string);
              } else { // Val es un objeto con estructura {value: __, text: __} contenido en choices
                let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[item]);
                if (allQuestionStruct[item].type === 'imagepicker') {

                  object_responses_final[item].push(filter[0].imageLink)
                } else {
                  object_responses_final[item].push(filter[0].text)

                }
              }
            } else if (allQuestionStruct[item].rateValues) { //Rating(Calificacion)
              if (allQuestionStruct[item].rateValues.includes(item2[item])) { // Val es un string contenido en rateValues
                object_responses_final[item].push(item2[item])
              } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) {
                if (allQuestionStruct[item].noneText) {
                  object_responses_final[item].push(allQuestionStruct[item].noneText)
                } else {
                  object_responses_final[item].push('Ninguno')
                }
              } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) {
                object_responses_final[item].push(allResults[index][item + "-Comment"])
              } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
                let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[item]);
                object_responses_final[item].push(filter[0].text)
              }
            } else if ((allQuestionStruct[item].type === 'boolean')) { //Booleano
              if (allQuestionStruct[item].labelTrue && allQuestionStruct[item].labelFalse) {
                if (item2[item] == true) {
                  object_responses_final[item].push(allQuestionStruct[item].labelTrue)
                } else {
                  object_responses_final[item].push(allQuestionStruct[item].labelFalse)
                }
              } else if (allQuestionStruct[item].labelTrue) {
                if (item2[item] == true) {
                  object_responses_final[item].push(allQuestionStruct[item].labelTrue)
                } else {
                  object_responses_final[item].push(item2[item])
                }
              } else if (allQuestionStruct[item].labelFalse) {
                if (item2[item] == false) {
                  object_responses_final[item].push(allQuestionStruct[item].labelFalse)
                } else {
                  object_responses_final[item].push(item2[item])
                }
              } else {
                if (item2[item] === false) {
                  object_responses_final[item].push('No')
                } else if (item2[item] === true) {
                  object_responses_final[item].push('Sí')
                } else {
                  object_responses_final[item].push(item2[item])
                }
              }
            } else if (allQuestionStruct[item].items) {//Multiple text
              if (typeof item2[item] === 'object') {
                object_responses_final[item].push(Object.values(item2[item]))
              } else {
                object_responses_final[item].push(item2[item])
              }
            } else if (allQuestionStruct[item].columns && allQuestionStruct[item].rows) {//Matrix
              let string = []
              Object.entries(item2[item]).forEach(entry => {
                if (allQuestionStruct[item].rows.includes(entry[0])) { //Si la incluye, pusheo tal cual
                  if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna, pusheo tal cual
                    let obj_matrix = {}
                    obj_matrix[entry[0].toString()] = entry[1].toString()
                    string.push(obj_matrix)
                  } else {
                    let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                    let obj_matrix = {}
                    obj_matrix[entry[0].toString()] = filter_c[0].text.toString()
                    string.push(obj_matrix)
                  }
                } else {//debo hacer un filter y buscar el text
                  let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);

                  if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
                    let obj_matrix = {}
                    obj_matrix[filter_r[0].text.toString()] = entry[1].toString()
                    string.push(obj_matrix)
                  } else {
                    let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                    let obj_matrix = {}
                    obj_matrix[filter_r[0].text.toString()] = filter_c[0].text.toString()
                    string.push(obj_matrix)
                  }
                }
              })
              object_responses_final[item].push(string);
            } else if (allQuestionStruct[item].elements) {
              let allQuestionStructPanel = {}
              allQuestionStruct[item].elements.forEach(item => {
                let final = readStruct(item)
                final.forEach((item, index) => {
                  if (index % 2 === 0) {
                    allQuestionStructPanel[final[index]] = final[index + 1]
                  }
                })
              });
              Object.keys(allQuestionStructPanel).forEach((item3) => {
                object_responses_final[item3].push(readResponses(item2, item3, index, allQuestionStructPanel, allResults))
              })
            } else {
              object_responses_final[item].push(item2[item])
            }
          } else {//No existe esta respuesta, por lo que se debe insertar en null
            object_responses_final[item].push("Sin respuesta")
          }
        })
      });

      let obj_res_conteo = []
      Object.keys(allQuestionStruct).forEach((key, index) => {
        if (allQuestionStruct[key].type === 'checkbox' || allQuestionStruct[key].type === 'tagbox' || allQuestionStruct[key].type === 'multipletext') {
          const array_concat = object_responses_final[key].flat(1);
          obj_res_conteo.push({
            question_title: allQuestionStruct[key].title ?? allQuestionStruct[key].name,
            question_results: array_concat.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          })
        } else if (allQuestionStruct[key].type === 'matrix') {
          let array_concat = []
          object_responses_final[key].forEach(item => {
            item.forEach(item2 => {
              array_concat.push(item2)
            })
          })
          let array_flat = array_concat.flat(1);
          array_flat.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {})

          let array_strings = []
          array_flat.forEach(item => {
            let entries = Object.entries(item)[0]
            let string = entries[0] + ': ' + entries[1]
            array_strings.push(string)
          })
          obj_res_conteo.push({
            question_title: allQuestionStruct[key].title ?? allQuestionStruct[key].name,
            question_results: array_strings.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          })

        } else {
          obj_res_conteo.push({
            question_title: allQuestionStruct[key].title ?? allQuestionStruct[key].name,
            question_results: object_responses_final[key].reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
          })
        }

      });

      let finalArrayConteo = []

      for (let x = 0; x < obj_res_conteo.length; x++) {
        let objInt = {}
        for (let y = 0; y < Object.keys(obj_res_conteo[x].question_results).length; y++) {
          objInt = {
            "Pregunta": obj_res_conteo[x].question_title,
            "Respuesta": Object.keys(obj_res_conteo[x].question_results)[y],
            "Frecuencia": Object.values(obj_res_conteo[x].question_results)[y],
          }
          finalArrayConteo.push(objInt)
        }
        finalArrayConteo.push({})
      }

      let finalDatos = []
      for (let j = 0; j < obj_res.length; j++) {
        if (esArrayDeNumeros(obj_res[j].question_results)) {
          let objInt = {
            "Pregunta": obj_res[j].question_title,
            "Mínimo": Math.min(...obj_res[j].question_results),
            "Máximo": Math.max(...obj_res[j].question_results),
            "Promedio/Media": obj_res[j].question_results.reduce((a, b) => a + b) / obj_res[j].question_results.length,
            "Sumatoria": obj_res[j].question_results.reduce((a, b) => a + b),
            "Mediana": median(obj_res[j].question_results),
            "Moda": mode(obj_res[j].question_results),
            "Rango": range(obj_res[j].question_results),
          }
          finalDatos.push(objInt)
        }
      }

      let obj_final = {
        results: finalArray,
        cont: finalArrayConteo,
        statistic: finalDatos.length > 0 ? finalDatos : undefined
      }
      res.status(200).json({ message: "Respuestas consultadas exitosamente.", results: obj_final })
    });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las respuestas." });
  }
});


module.exports = router;
