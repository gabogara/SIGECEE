var express = require("express");
var router = express.Router();
const Mailer = require("./mailer");
let Census = require("../models/census.model");
let CensusResult = require("../models/censusResult.model");
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
      await Census.aggregate([
        {
          $lookup: {
            from: "censusresults",
            localField: "_id",
            foreignField: "census",
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
            //description: "$data.description",
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
      ]).then((census) => {
        res.status(200).json({ message: "Censos encontrados.", census: census });
      });
    } else if (req.query.roleA === 'POD') {
      let all_census = await Census.aggregate([
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
            schoolId: "$school_info.alias",
          }
        }
      ]);
      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []

      all_census.forEach((item) => {
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
      await Census.aggregate([
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
            from: "censusresults",
            localField: "_id",
            foreignField: "census",
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
            //description: "$data.description",
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
      ]).then((census) => {
        res.status(200).json({ message: "Censos encontrados.", census: census });
      });
    } else {
      let all_census = await Census.aggregate([
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
            schoolId: "$school_info.alias",
          }
        }
      ]);
      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []
      let ids_invs = []

      all_census.forEach((item) => {
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
      await Census.aggregate([
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
            from: "censusresults",
            localField: "_id",
            foreignField: "census",
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
            //description: "$data.description",
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
      ]).then((census) => {
        res.status(200).json({ message: "Censos encontrados.", census: census });
      });
    }

  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando los censos." });
  }
});

router.get("/get", async (req, res) => {
  try {
    Census.findOne({ _id: req.query.id }).populate("createdBy").then((census) => {
      res.status(200).json({ message: "Censo encontrado.", census: census });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando el censo." });
  }
});

router.post("/add", async (req, res) => {
  try {
    if (sumArray(req.body.data.pages) && sumArray(req.body.data.pages) > 0) {
      const newCensus = new Census({
        data: req.body.data,
        count_questions: sumArray(req.body.data.pages),
        visibility: 0,
        createdBy: req.body.createdBy,
      });

      newCensus.save().then((census) =>
        res.status(201).json({ message: "Censo agregado exitosamente.", census: census })
      );
    } else {
      return res.status(400).send({
        message: "No pueden haber páginas del censo vacías, por favor, agregue preguntas o bórrelas.",
      });
    }

  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando el censo." });
  }
});

router.post("/edit", async (req, res) => {
  try {
    Census.findOne({ _id: req.body._id }).then((census) => {
      if (!census)
        return res.status(400).send({
          message: "El censo no se encuentra registrado en el sistema.",
        });

      if (sumArray(req.body.data.pages) && sumArray(req.body.data.pages) > 0) {
        census.data = req.body.data;
        census.count_questions = sumArray(req.body.data.pages);
        census.save().then((census_saved) =>
          res.status(200).json({
            message: "Censo editado exitosamente.",
            census: census_saved,
          })
        );
      } else {
        return res.status(400).send({
          message: "No pueden haber páginas del censo vacías, por favor, agregue preguntas o bórrelas.",
        });
      }

    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando el censo." });
  }
});

router.post("/change", async (req, res) => {
  try {
    Census.findOne({ _id: req.body._id }).then((census) => {
      if (!census)
        return res.status(400).send({
          message: "El censo no se encuentra registrada en el sistema.",
        });

      census.visibility = req.body.visibility;
      var stringVisib = req.body.visibility === true ? "visible para los usuarios" : "visible solo para mí";
      census.save().then((census_saved) =>
        res.status(200).json({
          message: "El censo es " + stringVisib + " ahora.",
          census: census_saved,
        })
      );
    });
  } catch (e) {
    res.status(500).send({
      message: "Ha ocurrido un error cambiando la visibilidad del censo.",
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    Census.findOne({ _id: req.body._id }).then((census) => {
      if (!census)
        return res.status(400).send({
          message: "El censo no se encuentra registrado en el sistema.",
        });

      census.deleteOne().then(() =>
        res.status(200).json({ message: "Censo eliminado exitosamente.", census: true })
      );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error eliminando el censo." });
  }
});

router.post("/publish", async (req, res) => {
  try {
    Census.findOne({ _id: req.body._id }).then(async (census) => {
      if (!census)
        return res.status(400).send({ message: "El censo no se encuentra registrado en el sistema.", });

      census.type = req.body.type;
      census.initDate = moment().startOf("day").format();
      census.endDate = req.body.endDate;
      census.publishBy = req.body.publishBy;
      census.status = 1;
      census.anonymous = req.body.anonymous

      var encrypt_censo = encrypt(req.body._id.toString())
      var link = req.get('origin') + '/censusForm?id=' + encrypt_censo.content + '&k1=' + encrypt_censo.iv

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
      census.link = shortUrl;
      if (req.body.type === 0) {
        census.save().then(async (census_saved) => {
          res.status(200).json({
            message: "Censo publicado correctamente.", census: census_saved,
          });
        });
      } else {

        /*if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(req.body.emailField))
          return res.status(400).send({ message: "El campo de correo seleccionado, no tiene un formato válido de correo, ingrese otro.", });*/

        census.emailField = req.body.emailField;
        census.population = req.body.population;

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

          let final_response = await mailTemplate.emailTemplate("Censo: " + census.data.title + ' - SIGECEE', maillist, "Te invitamos a participar en el siguiente censo:", census.data.title, '', 'Ingresa al censo desde el siguiente enlace y ¡participa!', 'Realiza tu censo antes del ' + moment(census.endDate).format('DD/MM/YYYY'), shortUrl)
          census.maillist = maillist.split(', ');
          if (final_response) {
            census.save().then(async (census_saved) => {
              res.status(200).json({
                message: "Censo publicado correctamente.", census: census_saved,
              });
            });
          } else {
            res.status(500).send({ message: "Ha ocurrido un error mandando los correos del censo, intente nuevamente." });
          }
        } else {
          return res.status(400).send({ message: "No existen correos para este campo, intente nuevamente con otro campo o con otra población", });
        }

      }
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando el censo." });
  }
});

router.post("/prevalidate", async (req, res) => {
  try {
    let obj1 = {
      iv: req.body.iv,
      content: req.body._id,
    }
    var dencrypt_censo = decrypt(obj1)

    console.log(dencrypt_censo)
    const exist = await Census.findOne({ _id: dencrypt_censo, status: 1, type: 0 })
    if (exist) {
      const existe_censo = await CensusResult.findOne({ ip: req.body.ip, census: dencrypt_censo })
      if (existe_censo) {
        res.status(403).json({ message: "Ya has participado en este censo.", participation: true });
      } else {
        res.status(200).json({ message: "Censo encontrado.", census: exist.data });
      }
    } else {
      res.status(403).json({ message: "Censo finalizado" });
    }
  } catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error consultando los censos." });
  }
});

router.post("/validate", async (req, res) => {
  try {
    let obj1 = {
      iv: req.body.iv,
      content: req.body._id,
    }
    var dencrypt_censo = decrypt(obj1)
    let valid = false
    let census_data = ''
    let type = 0
    await Census.findOne({ _id: dencrypt_censo, status: 1 }).then(async (census) => {
      type = census.type
      await Population.findOne({ _id: census.population }).then((population) => {
        population.data.forEach((item) => {
          if (item[census.emailField].toLowerCase() === req.body.email.toLowerCase()) {
            valid = true
            census_data = census.data
          }
        });
      });
    });
    if (valid) {

      if (type === 1) {
        const existe_censo = await CensusResult.findOne({ email: req.body.email.toLowerCase(), census: dencrypt_censo })
        if (existe_censo) {
          res.status(403).json({ message: "Ya has participado en este censo.", participation: true });
        } else {
          res.status(200).json({ message: "Censo encontrado.", census: census_data });
        }
      } else {
        res.status(200).json({ message: "Censo encontrado.", census: census_data });
      }
    } else {
      res.status(403).json({ message: "El correo no pertenece al censo." });
    }
  } catch (error) {
    res.status(500).send({ message: "Ha ocurrido un error consultando los censos." });
  }
});

router.post("/results", async (req, res) => {
  try {
    let obj1 = {
      iv: req.body.iv,
      content: req.body._id,
    }
    var dencrypt_censo = decrypt(obj1)
    await Census.findOne({ _id: dencrypt_censo }).then(async (census) => {
      if (!census)
        return res.status(400).send({ message: "El censo no se encuentra registrado en el sistema.", });

      var newCensusResult = {}
      if (req.body.email) {
        newCensusResult = new CensusResult({
          census: census._id,
          result: req.body.data,
          ip: req.body.ip,
          email: req.body.email.toLowerCase()
        });
      } else {
        newCensusResult = new CensusResult({
          census: census._id,
          result: req.body.data,
          ip: req.body.ip
        });
      }

      newCensusResult.save().then((census_result) =>
        res.status(201).json({ message: "Respuesta de censo agregada exitosamente.", census: census_result })
      );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando el censo." });
  }
});

router.post("/getResults", async (req, res) => {
  try {
    await CensusResult.find({ census: req.body._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      res.status(200).json({ message: "Respuestas consultadas exitosamente.", results: result })
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando el censo." });
  }
});

router.get("/getResultsJson", async (req, res) => {
  try {
    await CensusResult.find({ census: req.query._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      let study = await Study.findOne({
        $and: [
          { census: req.query._id },
          { ins_type: "Censo" }
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
  //console.log(allQuestionStruct[item].choices)
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
    //console.log("pasa en rateValues")
    if (allQuestionStruct[item].rateValues.includes(item2[item])) { // Val es un string contenido en rateValues
      //console.log("pasa1")
      return item2[item]
    } else if (item2[item] === 'none' && allQuestionStruct[item].showNoneItem) {
      if (allQuestionStruct[item].noneText) {
        return allQuestionStruct[item].noneText
      } else {
        return 'Ninguno'
      }
      //console.log("pasa2")
    } else if (item2[item] === 'other' && allQuestionStruct[item].showOtherItem) {
      //console.log("pasa3")
      return allResults[index][item + "-Comment"]
    } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
      //console.log("pasa4")
      let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[item]);
      return filter[0].text
    }
  } else if (allQuestionStruct[item].labelTrue || allQuestionStruct[item].labelFalse) { //Booleano
    //console.log("pasa en labelTrue, labelFalse")
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
    //console.log("pasa en items")
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
          console.log("filter" + filter_c)
          let obj_matrix = {}
          obj_matrix[entry[0].toString()] = filter_c[0].text.toString()
          string.push(obj_matrix)
        }
      } else {//debo hacer un filter y buscar el text
        let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);

        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
          //string = string + filter_r[0].text + ':' + entry[1] + ','
          let obj_matrix = {}
          obj_matrix[filter_r[0].text.toString()] = entry[1].toString()
          string.push(obj_matrix)
        } else {
          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
          //string = string + filter_r[0].text + ':' + filter_c[0].text + ','
          let obj_matrix = {}
          obj_matrix[filter_r[0].text.toString()] = filter_c[0].text.toString()
          string.push(obj_matrix)
        }
      }
    })
    return string;
  } else if (allQuestionStruct[item].elements) {
    //console.log(allQuestionStruct[item].elements)
    let allQuestionStructPanel = {}
    allQuestionStruct[item].elements.forEach(item => {
      allQuestionStructPanel[item.name] = item
    });

    //console.log(allQuestionStructPanel)

    Object.keys(allQuestionStructPanel).forEach((item3) => {
      //console.log(item3)
      return readResponses(item2, item3, index, allQuestionStructPanel, allResults)
    })
  } else {
    //console.log("pasa else")
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

router.get("/getResultsChart", async (req, res) => {
  try {
    await CensusResult.find({ census: req.query._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      let study = await Study.findOne({
        $and: [
          { census: req.query._id },
          { ins_type: "Censo" }
        ]
      });

      let census = await Census.findOne({ _id: req.query._id });

      let all_id_question = {} //name (Id) de todas las preguntas en el censo
      census.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readHeaders(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              all_id_question[final[index]] = final[index + 1]
            }
          })
        })
      });

      //console.log(all_id_question)
      //console.log('---headers---')
      let allResults = []
      result.forEach(item => {
        if (item.result) {
          allResults.push(item.result)
        }
      })

      //console.log(allResults)
      //console.log('---respuestas---')
      let allQuestionStruct = {}
      census.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readStruct(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              allQuestionStruct[final[index]] = final[index + 1]
            }
          })
        })
      });

      //console.log(allQuestionStruct)
      //console.log('---estructura de preguntas---')
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
    Census.findOne({ _id: req.body._id }).then(async (census_item) => {
      if (!census_item)
        return res.status(400).send({
          message: "El censo no se encuentra registrada en el sistema.",
        });

      await CensusResult.find({ census: req.body._id }).then(async (result) => {
        if (result && result.length > 0) {
          if (census_item.type === 1) {//El censo es cerrado  y se debe incluir el email del censado en los headers y data

            let all_id_question = {} //name (Id) de todas las preguntas en el censo
            census_item.data.pages.forEach(item => {
              item.elements.forEach(element => {
                all_id_question[element.name] = element.title ? element.title : element.name
              })
            });

            let object_responses_final = {}
            let allResults = {}
            result.forEach(item => {
              if (item.result) {
                allResults[item.email] = (item.result)
                object_responses_final[item.email] = {}
              }
            })

            let allQuestionStruct = {}
            census_item.data.pages.forEach(item => {
              item.elements.forEach(element => {
                allQuestionStruct[element.name] = element
              })
            });

            Object.keys(allQuestionStruct).forEach((item) => {
              console.log('Pregunta: ' + item)
              Object.entries(allResults).forEach((item2) => {
                if (item2[1][item]) {//Existe esa respuesta
                  //console.log(item2[1][item])
                  if (allQuestionStruct[item].choices) { //Tipos: Radio, Checkbox, Dropdown, Raking
                    //console.log( item2[0][item] +" pasa en choices")
                    if (allQuestionStruct[item].choices.includes(item2[1][item])) { // Val es un string contenido en choices
                      console.log("pasa1")
                      object_responses_final[item2[0]][item] = item2[1][item]
                    } else if (item2[1][item] === 'none' && allQuestionStruct[item].showNoneItem) { //Tiene la opcion de "Ninguno" activo
                      console.log("pasa2")
                      object_responses_final[item2[0]][item] = 'Ninguno'
                    } else if (item2[1][item] === 'other' && allQuestionStruct[item].showOtherItem) { //Tiene la opcion de "Otro" activado y se busca la respuesta en [name]-Comment"
                      console.log("pasa3")
                      object_responses_final[item2[0]][item] = allResults[item2[0]][item + "-Comment"]
                    } else if (Array.isArray(item2[1][item])) { //Las respuestas es un arreglo
                      object_responses_final[item2[0]][item] = ''
                      item2[1][item].forEach((item_array) => {
                        if (allQuestionStruct[item].choices.includes(item_array)) { // Val es un string contenido en choices
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + item_array + ','
                        } else if (item_array === 'none' && allQuestionStruct[item].showNoneItem) {
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + 'Ninguno' + ','
                        } else if (item_array === 'other' && allQuestionStruct[item].showOtherItem) {
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + allResults[item2[0]][item + "-Comment"] + ','
                        } else {
                          let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item_array);
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + filter[0].text + ','
                        }
                      });
                      object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item].slice(0, -1);
                    } else { // Val es un objeto con estructura {value: __, text: __} contenido en choices
                      console.log(allQuestionStruct[item].choices)
                      console.log("----choices-----")
                      console.log(item2[1][item])
                      let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[1][item]);
                      object_responses_final[item2[0]][item] = filter[0].text
                    }
                  } else if (allQuestionStruct[item].rateValues) { //Rating(Calificacion)
                    console.log("pasa en rateValues")
                    if (allQuestionStruct[item].rateValues.includes(item2[1][item])) { // Val es un string contenido en rateValues
                      console.log("pasa1")
                      object_responses_final[item2[0]][item] = item2[1][item]
                    } else if (item2[1][item] === 'none' && allQuestionStruct[item].showNoneItem) {
                      console.log("pasa2")
                      object_responses_final[item2[0]][item] = 'Ninguno'
                    } else if (item2[1][item] === 'other' && allQuestionStruct[item].showOtherItem) {
                      console.log("pasa3")
                      object_responses_final[item2[0]][item] = allResults[item2[0]][item + "-Comment"]
                    } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
                      console.log("pasa4")
                      let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[1][item]);
                      object_responses_final[item2[0]][item] = filter[0].text
                    }
                  } else if (allQuestionStruct[item].labelTrue || allQuestionStruct[item].labelFalse) { //Booleano
                    console.log("pasa en labelTrue, labelFalse")
                    if (allQuestionStruct[item].labelTrue && allQuestionStruct[item].labelFalse) {
                      if (item2[1][item] == true) {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelTrue
                      } else {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelFalse
                      }
                    } else if (allQuestionStruct[item].labelTrue) {
                      if (item2[1][item] == true) {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelTrue
                      } else {
                        object_responses_final[item2[0]][item] = 'No'
                      }
                    } else if (allQuestionStruct[item].labelFalse) {
                      if (item2[1][item] == false) {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelFalse
                      } else {
                        object_responses_final[item2[0]][item] = 'Sí'
                      }
                    } else {
                      if (item2[item] === false) {
                        object_responses_final[item2[0]][item] = 'No'
                      } else if (item2[item] === true) {
                        object_responses_final[item2[0]][item] = 'Sí'
                      } else {
                        object_responses_final[item2[0]][item] = item2[1][item]
                      }

                    }
                  } else if (allQuestionStruct[item].items) {//Multiple text
                    console.log("pasa en items")
                    if (typeof item2[1][item] === 'object') {
                      object_responses_final[item2[0]][item] = Object.values(item2[1][item]).join()
                    } else {
                      object_responses_final[item2[0]][item] = item2[1][item]
                    }
                  } else if (allQuestionStruct[item].columns && allQuestionStruct[item].rows) {
                    object_responses_final[item2[0]][item] = ''
                    Object.entries(item2[1][item]).forEach(entry => {
                      if (allQuestionStruct[item].rows.includes(entry[0])) { //Si la incluye, pusheo tal cual
                        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna, pusheo tal cual
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + entry[0] + ':' + entry[1] + ','
                        } else {
                          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                          console.log("filter" + filter_c)
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + entry[0] + ':' + filter_c[0].text + ','
                        }
                      } else {//debo hacer un filter y buscar el text
                        let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);

                        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + filter_r[0].text + ':' + entry[1] + ','
                        } else {
                          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + filter_r[0].text + ':' + filter_c[0].text + ','
                        }
                      }
                    })
                    object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item].slice(0, -1);

                  } else {
                    console.log("pasa else")
                    object_responses_final[item2[0]][item] = item2[1][item]
                  }
                } else {//No existe esta respuesta, por lo que se debe insertar en null
                  console.log("no pasa")
                  object_responses_final[item2[0]][item] = null
                }
              })
            });
            //array.push(obj)
            //console.log(object_responses_final)

            all_id_question = { ...all_id_question, final_email: 'Correo electrónico del censado' }

            //console.log(all_id_question)

            let final_array = []
            for (var i = 0; i < Object.keys(object_responses_final).length; i++) {
              final_array[i] = new Array(Object.keys(all_id_question).length);
            }

            Object.entries(object_responses_final).forEach((item, index1) => { //Recorro respuestas key:value
              Object.keys(all_id_question).forEach((header, index2) => {//recorro header
                if (header === 'final_email') {
                  final_array[index1][index2] = item[0]
                } else {
                  final_array[index1][index2] = item[1][header]
                }
              })
            });

            //console.log(final_array)

            const newPopulation = new Population({
              name: census_item.data.title,
              description: census_item.data.description,
              header: Object.values(all_id_question),
              data: final_array,
              origin: 'C',
              isActive: 0,
              createdBy: census_item.createdBy,
            });

            newPopulation.save();
            const today = moment()
            census_item.status = 2;
            census_item.endDate = today.toDate();
            census_item.save().then((census_saved) =>
              res.status(200).json({
                message: "Censo finalizado exitosamente.",
                census: census_saved,
              })
            );

          } else {//Es un censo abierto y no se debe incluir el email del censado en los headers y data
            //FALTA PROBAR
            console.log("pasa por censo abierto")
            let all_id_question = {} //name (Id) de todas las preguntas en el censo
            census_item.data.pages.forEach(item => {
              item.elements.forEach(element => {
                all_id_question[element.name] = element.title ? element.title : element.name
              })
            });

            let object_responses_final = {}
            let allResults = {}
            result.forEach((item, index) => {
              if (item.result) {
                allResults[index] = (item.result)
                object_responses_final[index] = {}
              }
            })

            let allQuestionStruct = {}
            census_item.data.pages.forEach(item => {
              item.elements.forEach(element => {
                allQuestionStruct[element.name] = element
              })
            });

            Object.keys(allQuestionStruct).forEach((item) => {
              console.log('Pregunta: ' + item)
              Object.entries(allResults).forEach((item2) => {
                if (item2[1][item]) {//Existe esa respuesta
                  //console.log(item2[1][item])
                  if (allQuestionStruct[item].choices) { //Tipos: Radio, Checkbox, Dropdown, Raking
                    //console.log( item2[0][item] +" pasa en choices")
                    if (allQuestionStruct[item].choices.includes(item2[1][item])) { // Val es un string contenido en choices
                      console.log("pasa1")
                      object_responses_final[item2[0]][item] = item2[1][item]
                    } else if (item2[1][item] === 'none' && allQuestionStruct[item].showNoneItem) { //Tiene la opcion de "Ninguno" activo
                      console.log("pasa2")
                      object_responses_final[item2[0]][item] = 'Ninguno'
                    } else if (item2[1][item] === 'other' && allQuestionStruct[item].showOtherItem) { //Tiene la opcion de "Otro" activado y se busca la respuesta en [name]-Comment"
                      console.log("pasa3")
                      object_responses_final[item2[0]][item] = allResults[item2[0]][item + "-Comment"]
                    } else if (Array.isArray(item2[1][item])) { //Las respuestas es un arreglo
                      object_responses_final[item2[0]][item] = ''
                      item2[1][item].forEach((item_array) => {
                        if (allQuestionStruct[item].choices.includes(item_array)) { // Val es un string contenido en choices
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + item_array + ','
                        } else if (item_array === 'none' && allQuestionStruct[item].showNoneItem) {
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + 'Ninguno' + ','
                        } else if (item_array === 'other' && allQuestionStruct[item].showOtherItem) {
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + allResults[item2[0]][item + "-Comment"] + ','
                        } else {
                          let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item_array);
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + filter[0].text + ','
                        }
                      });
                      object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item].slice(0, -1);
                    } else { // Val es un objeto con estructura {value: __, text: __} contenido en choices
                      console.log(allQuestionStruct[item].choices)
                      console.log("----choices-----")
                      console.log(item2[1][item])
                      let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[1][item]);
                      object_responses_final[item2[0]][item] = filter[0].text
                    }
                  } else if (allQuestionStruct[item].rateValues) { //Rating(Calificacion)
                    console.log("pasa en rateValues")
                    if (allQuestionStruct[item].rateValues.includes(item2[1][item])) { // Val es un string contenido en rateValues
                      console.log("pasa1")
                      object_responses_final[item2[0]][item] = item2[1][item]
                    } else if (item2[1][item] === 'none' && allQuestionStruct[item].showNoneItem) {
                      console.log("pasa2")
                      object_responses_final[item2[0]][item] = 'Ninguno'
                    } else if (item2[1][item] === 'other' && allQuestionStruct[item].showOtherItem) {
                      console.log("pasa3")
                      object_responses_final[item2[0]][item] = allResults[item2[0]][item + "-Comment"]
                    } else { // Val es un objeto con estructura {value: __, text: __} contenido en rateValues
                      console.log("pasa4")
                      let filter = allQuestionStruct[item].rateValues.filter(item_filter => item_filter.value === item2[1][item]);
                      object_responses_final[item2[0]][item] = filter[0].text
                    }
                  } else if (allQuestionStruct[item].labelTrue || allQuestionStruct[item].labelFalse) { //Booleano
                    console.log("pasa en labelTrue, labelFalse")
                    if (allQuestionStruct[item].labelTrue && allQuestionStruct[item].labelFalse) {
                      if (item2[1][item] == true) {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelTrue
                      } else {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelFalse
                      }
                    } else if (allQuestionStruct[item].labelTrue) {
                      if (item2[1][item] == true) {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelTrue
                      } else {
                        object_responses_final[item2[0]][item] = item2[1][item]
                      }
                    } else if (allQuestionStruct[item].labelFalse) {
                      if (item2[1][item] == false) {
                        object_responses_final[item2[0]][item] = allQuestionStruct[item].labelFalse
                      } else {
                        object_responses_final[item2[0]][item] = item2[1][item]
                      }
                    } else {
                      object_responses_final[item2[0]][item] = item2[1][item]
                    }
                  } else if (allQuestionStruct[item].items) {//Multiple text
                    console.log("pasa en items")
                    if (typeof item2[1][item] === 'object') {
                      object_responses_final[item2[0]][item] = Object.values(item2[1][item]).join()
                    } else {
                      object_responses_final[item2[0]][item] = item2[1][item]
                    }
                  } else if (allQuestionStruct[item].columns && allQuestionStruct[item].rows) {
                    object_responses_final[item2[0]][item] = ''
                    Object.entries(item2[1][item]).forEach(entry => {
                      if (allQuestionStruct[item].rows.includes(entry[0])) { //Si la incluye, pusheo tal cual
                        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna, pusheo tal cual
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + entry[0] + ':' + entry[1] + ','
                        } else {
                          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                          console.log("filter" + filter_c)
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + entry[0] + ':' + filter_c[0].text + ','
                        }
                      } else {//debo hacer un filter y buscar el text
                        let filter_r = allQuestionStruct[item].rows.filter(item_filter => item_filter.value === entry[0]);

                        if (allQuestionStruct[item].columns.includes(entry[1])) { //Incluye la columna,pusheo tal cual
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + filter_r[0].text + ':' + entry[1] + ','
                        } else {
                          let filter_c = allQuestionStruct[item].columns.filter(item_filter => item_filter.value === entry[1]);
                          object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item] + filter_r[0].text + ':' + filter_c[0].text + ','
                        }
                      }
                    })
                    object_responses_final[item2[0]][item] = object_responses_final[item2[0]][item].slice(0, -1);

                  } else {
                    console.log("pasa else")
                    object_responses_final[item2[0]][item] = item2[1][item]
                  }
                } else {//No existe esta respuesta, por lo que se debe insertar en null
                  console.log("no pasa")
                  object_responses_final[item2[0]][item] = null
                }
              })
            });

            let final_array = []
            for (var i = 0; i < Object.keys(object_responses_final).length; i++) {
              final_array[i] = new Array(Object.keys(all_id_question).length);
            }

            Object.entries(object_responses_final).forEach((item, index1) => { //Recorro respuestas key:value
              Object.keys(all_id_question).forEach((header, index2) => {//recorro header
                final_array[index1][index2] = item[1][header]
              })
            });
            const newPopulation = new Population({
              name: 'Población: ' + census_item.data.title,
              description: census_item.data.description,
              header: Object.values(all_id_question),
              data: final_array,
              origin: 'C',
              isActive: 0,
              createdBy: census_item.createdBy,
            });

            newPopulation.save()
            const today = moment()
            census_item.status = 2;
            census_item.endDate = today.toDate();
            census_item.save().then((census_saved) =>
              res.status(200).json({
                message: "Censo finalizado exitosamente.",
                census: census_saved,
              })
            );
          }
        } else {
          const today = moment()
          census_item.status = 2;
          census_item.endDate = today.toDate();
          census_item.save().then((census_saved) =>
            res.status(200).json({
              message: "Censo finalizado exitosamente.",
              census: census_saved,
            })
          );
        }
      });













    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error cerrando el censo." });
  }
});


router.post("/date", async (req, res) => {
  try {
    Census.findOne({ _id: req.body._id }).then((census) => {
      if (!census)
        return res.status(400).send({
          message: "El censo no se encuentra registrada en el sistema.",
        });
      census.endDate = req.body.endDate;
      census.save().then((census_saved) =>
        res.status(200).json({
          message: "Fecha fin de censo editada exitosamente.",
          census: census_saved,
        })
      );

    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error cambiando fecha fin del censo." });
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

    await CensusResult.find({ census: req.query._id }).then(async (result) => {
      if (!result)
        return res.status(400).send({ message: "No hay respuestas.", });

      let census = await Census.findOne({ _id: req.query._id });

      let all_id_question = {} //name (Id) de todas las preguntas en el censo
      census.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readHeaders(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              all_id_question[final[index]] = final[index + 1]
            }
          })
        })
      });

      // console.log('---headers---')
      // console.log(all_id_question)
      // console.log('---headers---')
      let allResults = []
      result.forEach(item => {
        if (item.result) {
          allResults.push(item.result)
        }
      })

      console.log('---respuestas---')
      console.log(allResults)
      console.log('---respuestas---')
      let allQuestionStruct = {}
      census.data.pages.forEach(item => {
        item.elements.forEach(element => {
          let final = readStruct(element)
          final.forEach((item, index) => {
            if (index % 2 === 0) {
              allQuestionStruct[final[index]] = final[index + 1]
            }
          })
        })
      });

      //console.log(allQuestionStruct)
      //console.log('---estructura de preguntas---')
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




    // await SurveyResult.find({ survey: req.query._id }).then(async (result) => {
    //   if (!result)
    //     return res.status(400).send({ message: "No hay respuestas.", });

    //   let study = await Study.findOne({
    //     $and: [
    //       { survey: req.query._id },
    //       { ins_type: "Encuesta" }
    //     ]
    //   });

    //   let survey = await Survey.findOne({ _id: req.query._id });

    //   let array = result.map(item => item.result)

    //   let obj_array = {}

    //   //Inicializando el objeto
    //   Object.keys(array[0]).map(item => obj_array[item] = [])

    //   array.map((item, index) => {
    //     Object.entries(item).map((item2, index2) => {
    //       obj_array[item2[0]].push(item2[1])
    //     })
    //   })

    //   let obj_res = {}
    //   Object.keys(obj_array).forEach(function (key, index) {
    //     let info = survey.data.pages.map(item => {
    //       return item.elements.filter(element => {
    //         if (element.name === key) {
    //           return { title: element.name, type: element.type, inputType: (element.inputType ?? null) }
    //         }
    //       })
    //     });
    //     obj_res[key] = {
    //       question_info: info[0][0],
    //       question_results: obj_array[key].reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {}),
    //     }
    //   });

    //   let obj_final = {
    //     results: obj_res,
    //     study: study ?? null,
    //   }
    //   res.status(200).json({ message: "Respuestas consultadas exitosamente.", results: obj_final })
    // });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las respuestas." });
  }
});

module.exports = router;
