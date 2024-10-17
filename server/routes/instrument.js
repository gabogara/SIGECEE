var express = require("express");
var router = express.Router();
let Census = require("../models/census.model");

router.get("/all", async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {
      await Census.aggregate([
        {
          $addFields: {
            "ins_type": "Censo"
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
            ins_type: 1,
            data: 1,
          },
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $addFields: {
                  "ins_type": "Encuesta"
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
                  ins_type: 1,
                  data: 1,
                }
              }]
          }
        },
        { "$sort": { "createdAt": -1 } },
      ]).then((instrument) => {
        res.status(200).json({ message: "Censos y encuestas encontrados.", instrument: instrument });
      });
    } else if (req.query.roleA === 'POD') {
      let all_instruments = await Census.aggregate([
        {
          $addFields: {
            "ins_type": "Censo"
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
            ins_type: 1,
            visibility: 1,
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $addFields: {
                  "ins_type": "Encuesta"
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
                  ins_type: 1,
                  visibility: 1,
                  createdById: "$user_info._id",
                  createdByAlias: "$role_info.alias",
                  schoolId: "$school_info._id",
                }
              }]
          }
        },
        { "$sort": { "createdAt": -1 } },
      ]);

      let ids_admins_censos = []
      let ids_dirs_censos = []
      let ids_pods_censos = []

      let ids_admins_enc = []
      let ids_dirs_enc = []
      let ids_pods_enc = []

      all_instruments.forEach((item) => {
        if (item.ins_type === 'Censo') {
          if (item.createdByAlias === 'ADM' && item.visibility === true) {
            ids_admins_censos.push(item._id)
          } else if (item.createdByAlias === 'DIR' && item.visibility === true) {
            ids_dirs_censos.push(item._id)
          } else if (item.createdByAlias === 'POD') {
            if (item.createdById.toString() === req.query.key.toString()) {
              ids_pods_censos.push(item._id)
            } else {
              if (item.schoolId.toString() === req.query.schoolI.toString() && item.visibility === true) {
                ids_pods_censos.push(item._id)
              }
            }

          }
        } else {
          if (item.createdByAlias === 'ADM' && item.visibility === true) {
            ids_admins_enc.push(item._id)
          } else if (item.createdByAlias === 'DIR' && item.visibility === true) {
            ids_dirs_enc.push(item._id)
          } else if (item.createdByAlias === 'POD') {
            if (item.createdById.toString() === req.query.key.toString()) {
              ids_pods_enc.push(item._id)
            } else {
              if (item.schoolId.toString() === req.query.schoolI.toString() && item.visibility === true) {
                ids_pods_enc.push(item._id)
              }
            }

          }
        }

      })


      await Census.aggregate([
        {
          $match: {
            $or: [
              { _id: { $in: ids_admins_censos } },
              { _id: { $in: ids_dirs_censos } },
              { _id: { $in: ids_pods_censos } },
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
            ins_type: 1,
            data: 1,
          },
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $match: {
                  $or: [
                    { _id: { $in: ids_admins_enc } },
                    { _id: { $in: ids_dirs_enc } },
                    { _id: { $in: ids_pods_enc } },
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
                  ins_type: 1,
                  data: 1,
                }
              }]
          }
        },
        { "$sort": { "createdAt": -1 } },
      ]).then((instrument) => {
        res.status(200).json({ message: "Censos y encuestas encontrados.", instrument: instrument });
      });
    } else {
      let all_instruments = await Census.aggregate([
        {
          $addFields: {
            "ins_type": "Censo"
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
            ins_type: 1,
            visibility: 1,
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $addFields: {
                  "ins_type": "Encuesta"
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
                  ins_type: 1,
                  visibility: 1,
                  createdById: "$user_info._id",
                  createdByAlias: "$role_info.alias",
                  schoolId: "$school_info._id",
                }
              }]
          }
        },
        { "$sort": { "createdAt": -1 } },
      ]);

      let ids_admins_censos = []
      let ids_dirs_censos = []
      let ids_pods_censos = []
      let ids_invs_censos = []

      let ids_admins_enc = []
      let ids_dirs_enc = []
      let ids_pods_enc = []
      let ids_invs_enc = []

      all_instruments.forEach((item) => {
        if (item.ins_type === 'Censo') {
          if (item.createdByAlias === 'ADM' && item.visibility === true) {
            ids_admins_censos.push(item._id)
          } else if (item.createdByAlias === 'DIR' && item.visibility === true) {
            ids_dirs_censos.push(item._id)
          } else if (item.createdByAlias === 'POD' && item.visibility === true) {
            if (item.schoolId.toString() === req.query.schoolI.toString()) {
              ids_pods_censos.push(item._id)
            }
          } else {//Estudiantes
            if (item.createdById.toString() === req.query.key.toString()) {
              ids_invs_censos.push(item._id)
            }
          }
        } else {
          if (item.createdByAlias === 'ADM' && item.visibility === true) {
            ids_admins_enc.push(item._id)
          } else if (item.createdByAlias === 'DIR' && item.visibility === true) {
            ids_dirs_enc.push(item._id)
          } else if (item.createdByAlias === 'POD' && item.visibility === true) {
            if (item.schoolId.toString() === req.query.schoolI.toString()) {
              ids_pods_enc.push(item._id)
            }
          } else {//Estudiantes
            if (item.createdById.toString() === req.query.key.toString()) {
              ids_invs_enc.push(item._id)
            }
          }
        }

      })


      await Census.aggregate([
        {
          $match: {
            $or: [
              { _id: { $in: ids_admins_censos } },
              { _id: { $in: ids_dirs_censos } },
              { _id: { $in: ids_pods_censos } },
              { _id: { $in: ids_invs_censos } },
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
            ins_type: 1,
            data: 1,
          },
        },
        {
          $unionWith: {
            coll: "surveys", pipeline: [
              {
                $match: {
                  $or: [
                    { _id: { $in: ids_admins_enc } },
                    { _id: { $in: ids_dirs_enc } },
                    { _id: { $in: ids_pods_enc } },
                    { _id: { $in: ids_invs_enc } },
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
                  ins_type: 1,
                  data: 1,
                }
              }]
          }
        },
        { "$sort": { "createdAt": -1 } },
      ]).then((instrument) => {
        res.status(200).json({ message: "Censos y encuestas encontrados.", instrument: instrument });
      });
    }

  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando los censos y encuestas." });
  }
});

module.exports = router;