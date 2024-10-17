var express = require("express");
var router = express.Router();
let Census = require("../models/census.model");
let Study = require("../models/study.model");
let CensusResult = require("../models/censusResult.model");
let Survey = require("../models/survey.model");
let SurveyResult = require("../models/surveyResult.model");

router.get("/all", async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {

      await Census.aggregate([
        {
          $match: {
            $and: [
              { status: { $gt: 0 } }
            ]
          }
        },
        {
          $addFields: {
            "ins_type": "Censo"
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
            from: "studies",
            localField: "_id",
            foreignField: "census",
            as: "study_count"
          }
        },
        {
          $lookup: {
            from: "blogentries",
            localField: "_id",
            foreignField: "census",
            as: "blog_count"
          }
        },
        //{ $unwind: "$blog_count" },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        //{ $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            title: "$data.title",
            description: "$data.description",
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
            study_count: { $size: "$study_count" },
            blog_count: { $size: "$blog_count" },
            ins_type: 1,
            createdById: "$user_info._id",
          }
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $match: {
                  $and: [
                    { status: { $gt: 0 } }
                  ]
                }
              },
              {
                $addFields: {
                  "ins_type": "Encuesta"
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
                  from: "studies",
                  localField: "_id",
                  foreignField: "survey",
                  as: "study_count"
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
              {
                $lookup: {
                  from: "blogentries",
                  localField: "_id",
                  foreignField: "survey",
                  as: "blog_count"
                }
              },
              //{ $unwind: "$blog_count" },
              {
                $project: {
                  _id: 1,
                  title: "$data.title",
                  description: "$data.description",
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
                  study_count: { $size: "$study_count" },
                  blog_count: { $size: "$blog_count" },
                  ins_type: 1,
                  createdById: "$user_info._id",
                }
              }]
          }
        },
        {
          $match: {
            $and: [
              { result_count: { $gt: 0 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
      ]).then((studies) => {
        res.status(200).json({ message: "Censos y encuestas encontrados.", studies: studies });
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
            schoolAlias: "$school_info.alias",
          }
        }
      ]);

      let ids_pod_censos = []

      all_census.forEach((item) => {
        if (item.createdByAlias === 'POD' && item.createdById.toString() === req.query.key.toString()) {
          ids_pod_censos.push(item._id)
        }
      })

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
            schoolAlias: "$school_info.alias",
          }
        }
      ]);

      let ids_pods_encuestas = []

      all_surveys.forEach((item) => {
        if (item.createdByAlias === 'POD' && item.createdById.toString() === req.query.key.toString()) {
          ids_pods_encuestas.push(item._id)
        }
      })

      await Census.aggregate([
        {
          $match: {
            $and: [
              { _id: { $in: ids_pod_censos } },
              { status: { $gt: 0 } }
            ]
          }
        },
        {
          $addFields: {
            "ins_type": "Censo"
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
            from: "studies",
            localField: "_id",
            foreignField: "census",
            as: "study_count"
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
        //{ $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            title: "$data.title",
            description: "$data.description",
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
            study_count: { $size: "$study_count" },
            ins_type: 1,
            createdById: "$user_info._id",
          }
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $match: {
                  $and: [
                    { _id: { $in: ids_pods_encuestas } },
                    { status: { $gt: 0 } }
                  ]
                }
              },
              {
                $addFields: {
                  "ins_type": "Encuesta"
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
                  from: "studies",
                  localField: "_id",
                  foreignField: "census",
                  as: "study_count"
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
              {
                $project: {
                  title: "$data.title",
                  description: "$data.description",
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
                  study_count: { $size: "$study_count" },
                  ins_type: 1,
                  createdById: "$user_info._id",
                }
              }]
          }
        },
        {
          $match: {
            $and: [
              { result_count: { $gt: 0 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
      ]).then((studies) => {
        res.status(200).json({ message: "Censos y encuestas encontrados.", studies: studies });
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
            schoolAlias: "$school_info.alias",
          }
        }
      ]);

      let ids_invs_censos = []

      all_census.forEach((item) => {
        if (item.createdByAlias === 'INV' && item.createdById.toString() === req.query.key.toString()) {
          ids_invs_censos.push(item._id)
        }
      })

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
            schoolAlias: "$school_info.alias",
          }
        }
      ]);

      let ids_invs_encuestas = []

      all_surveys.forEach((item) => {
        if (item.createdByAlias === 'INV' && item.createdById.toString() === req.query.key.toString()) {
          ids_invs_encuestas.push(item._id)
        }
      })

      await Census.aggregate([
        {
          $match: {
            $and: [
              { _id: { $in: ids_invs_censos } },
              { status: { $gt: 0 } }
            ]
          }
        },
        {
          $addFields: {
            "ins_type": "Censo"
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
            from: "studies",
            localField: "_id",
            foreignField: "census",
            as: "study_count"
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
        //{ $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 1,
            title: "$data.title",
            description: "$data.description",
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
            study_count: { $size: "$study_count" },
            ins_type: 1,
            createdById: "$user_info._id",
          }
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $match: {
                  $and: [
                    { _id: { $in: ids_invs_encuestas } },
                    { status: { $gt: 0 } }
                  ]
                }
              },
              {
                $addFields: {
                  "ins_type": "Encuesta"
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
                  from: "studies",
                  localField: "_id",
                  foreignField: "census",
                  as: "study_count"
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
              {
                $project: {
                  _id: 1,
                  title: "$data.title",
                  description: "$data.description",
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
                  study_count: { $size: "$study_count" },
                  ins_type: 1,
                  createdById: "$user_info._id",
                }
              }]
          }
        },
        {
          $match: {
            $and: [
              { result_count: { $gt: 0 } }
            ]
          }
        },
        { $sort: { createdAt: -1 } },
      ]).then((studies) => {
        res.status(200).json({ message: "Censos y encuestas encontrados.", studies: studies });
      });

    }
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando los censos y encuestas." });
  }
});

router.post('/add', async (req, res) => {
  try {

    const newStudy = new Study({
      ins_type: req.body.ins_type,
      ...(req.body.ins_type === 'Censo' && { census: req.body.id }),
      ...(req.body.ins_type === 'Encuesta' && { survey: req.body.id }),
      data: req.body.data,
      createdBy: req.body.createdBy,
    });

    newStudy.save().then(study =>
      res.status(201).json({ message: 'Estudio agregado exitosamente.', study: study }),
    )
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando el estudio." });
  }
});

router.get('/getStudy', async (req, res) => {
  try {
    let study = {}
    if (req.query.type === 'censo') {
      study = await Study.findOne({ census: req.query._id });
    } else {
      study = await Study.findOne({ survey: req.query._id });
    }

    if (!study) {
      res.status(200).json({ message: "El estudio no se encuentra registrada en el sistema.", study: undefined });
    } else {
      res.status(200).json({ message: 'Estudio encontrado.', study: study });
    }
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando el estudio." });
  }
});

router.post('/edit', async (req, res) => {
  try {
    Study.findOne({ _id: req.body._id }).then(study => {
      if (!study)
        return res.status(400).send({ message: "El estudio no se encuentra registrado en el sistema." });

      study.data = req.body.data
      study.save().then(study_saved =>
        res.status(200).json({ message: 'Estructura editada exitosamente.', study: study_saved }),
      )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando el estufio." });
  }
});

module.exports = router;
