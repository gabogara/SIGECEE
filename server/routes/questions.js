var express = require('express');
var router = express.Router();

let Question = require('../models/question.model');
const User = require('../models/user.model');

router.get('/all', async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') { //

      await Question.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $unwind: "$data.pages" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: { $arrayElemAt: ["$data.pages.elements.name", 0] },
            title: { $arrayElemAt: ["$data.pages.elements.title", 0] },
            isRequired: { $arrayElemAt: ["$data.pages.elements.isRequired", 0] },
            visibility: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
          }
        }
      ]).then((question) => {
        res.status(200).json({ message: "Preguntas encontradas.", questions: question });
      });
    } else if (req.query.roleA === 'POD') {

      let all_question = await Question.aggregate([
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
        { $unwind: "$data.pages" },
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

      all_question.forEach((item) => {
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
      await Question.aggregate([
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
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $unwind: "$data.pages" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: { $arrayElemAt: ["$data.pages.elements.name", 0] },
            title: { $arrayElemAt: ["$data.pages.elements.title", 0] },
            isRequired: { $arrayElemAt: ["$data.pages.elements.isRequired", 0] },
            visibility: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
          }
        }
      ]).then((question) => {
        res.status(200).json({ message: "Preguntas encontradas.", questions: question });
      });

    } else {
      let all_question = await Question.aggregate([
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
        { $unwind: "$data.pages" },
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

      all_question.forEach((item) => {
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
      await Question.aggregate([
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
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $unwind: "$data.pages" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: { $arrayElemAt: ["$data.pages.elements.name", 0] },
            title: { $arrayElemAt: ["$data.pages.elements.title", 0] },
            isRequired: { $arrayElemAt: ["$data.pages.elements.isRequired", 0] },
            visibility: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
          }
        }
      ]).then((question) => {
        res.status(200).json({ message: "Preguntas encontradas.", questions: question });
      });
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las preguntas." });
  }
})

router.get('/all/wData', async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {

      await Question.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $unwind: "$data.pages" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: { $arrayElemAt: ["$data.pages.elements.name", 0] },
            title: { $arrayElemAt: ["$data.pages.elements.title", 0] },
            type: { $arrayElemAt: ["$data.pages.elements.type", 0] },
            inputType: { $arrayElemAt: ["$data.pages.elements.inputType", 0] },
            isRequired: { $arrayElemAt: ["$data.pages.elements.isRequired", 0] },
            data: 1,
            visibility: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
          }
        }
      ]).then((question) => {
        res.status(200).json({ message: "Preguntas encontradas.", questions: question });
      });
    } else if (req.query.roleA === 'POD') { //Revisar
      let all_question = await Question.aggregate([
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
        { $unwind: "$data.pages" },
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

      all_question.forEach((item) => {
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
      await Question.aggregate([
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
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $unwind: "$data.pages" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: { $arrayElemAt: ["$data.pages.elements.name", 0] },
            title: { $arrayElemAt: ["$data.pages.elements.title", 0] },
            type: { $arrayElemAt: ["$data.pages.elements.type", 0] },
            inputType: { $arrayElemAt: ["$data.pages.elements.inputType", 0] },
            isRequired: { $arrayElemAt: ["$data.pages.elements.isRequired", 0] },
            data: 1,
            visibility: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
          }
        }
      ]).then((question) => {
        res.status(200).json({ message: "Preguntas encontradas.", questions: question });
      });
    } else {
      let all_question = await Question.aggregate([
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
        { $unwind: "$data.pages" },
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

      all_question.forEach((item) => {
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
      await Question.aggregate([
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
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        { $unwind: "$user_info" },
        { $unwind: "$data.pages" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: { $arrayElemAt: ["$data.pages.elements.name", 0] },
            title: { $arrayElemAt: ["$data.pages.elements.title", 0] },
            type: { $arrayElemAt: ["$data.pages.elements.type", 0] },
            inputType: { $arrayElemAt: ["$data.pages.elements.inputType", 0] },
            isRequired: { $arrayElemAt: ["$data.pages.elements.isRequired", 0] },
            data: 1,
            visibility: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
          }
        }
      ]).then((question) => {
        res.status(200).json({ message: "Preguntas encontradas.", questions: question });
      });
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las preguntas." });
  }
})

router.get("/get", async (req, res) => {
  try {
    Question.findOne({ _id: req.query.id }).populate("createdBy").then((question) => {
      res.status(200).json({ message: "Pregunta encontrada.", question: question });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando la pregunta." });
  }
});


router.post('/add', async (req, res) => {
  try {
    const newQuestion = new Question({
      data: req.body.data,
      visibility: 0,
      createdBy: req.body.createdBy,
    });

    newQuestion.save().then(question =>
      res.status(201).json({ message: 'Pregunta agregada exitosamente.', question: question }),
    )
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la pregunta." });
  }
});

router.post('/edit', async (req, res) => {
  try {
    Question.findOne({ _id: req.body._id }).then(question => {
      if (!question)
        return res.status(400).send({ message: "La pregunta no se encuentra registrada en el sistema." });

      question.data = req.body.data
      question.save().then(question_saved =>
        res.status(200).json({ message: 'Pregunta editada exitosamente.', question: question_saved }),
      )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando la pregunta." });
  }
});

router.post('/change', async (req, res) => {
  try {
    Question.findOne({ _id: req.body._id }).then(question => {
      if (!question)
        return res.status(400).send({ message: "La pregunta no se encuentra registrada en el sistema." });

      question.visibility = req.body.visibility
      var stringVisib = (req.body.visibility === true) ? "visible para los usuarios" : "visible solo para mí"
      question.save().then(question_saved =>
        res.status(200).json({ message: 'La pregunta es ' + stringVisib + ' ahora.', question: question_saved }),
      )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error cambiando la visibilidad de la pregunta." });
  }
});

router.post('/delete', async (req, res) => {
  try {
    Question.findOne({ _id: req.body._id }).then(question => {
      if (!question)
        return res.status(400).send({ message: "La pregunta no se encuentra registrada en el sistema." });

      question.deleteOne()
        .then(() =>
          res.status(200).json({ message: 'Pregunta eliminada exitosamente.', question: true }),
        )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error eliminando la pregunta." });
  }
});

module.exports = router;