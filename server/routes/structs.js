var express = require('express');
var router = express.Router();

let Struct = require('../models/struct.model');

const sumArray = (list) => {
  return list.reduce((acc, item) => {
    acc += item.elements.length;
    return acc;
  }, 0)
}

router.get('/all', async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {

      await Struct.aggregate([
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
            visibility: 1,
            count_questions: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
          }
        }
      ]).then((struct) => {
        res.status(200).json({ message: "Estructuras encontradas.", structs: struct });
      });
    } else if (req.query.roleA === 'POD') {//Revisar
      let all_structs = await Struct.aggregate([
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
            createdAt: 1,
            visibility: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        }
      ]);

      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []

      all_structs.forEach((item) => {
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
      await Struct.aggregate([
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
            title: "$data.title",
            visibility: 1,
            createdAt: 1,
            count_questions: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
          }
        }
      ]).then((struct) => {
        res.status(200).json({ message: "Estructuras encontradas.", structs: struct });
      });

    } else {
      let all_structs = await Struct.aggregate([
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
            createdAt: 1,
            visibility: 1,
            createdBy: "$user_info.name",
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

      all_structs.forEach((item) => {
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
      await Struct.aggregate([
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
            title: "$data.title",
            visibility: 1,
            createdAt: 1,
            count_questions: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
          }
        }
      ]).then((struct) => {
        res.status(200).json({ message: "Estructuras encontradas.", structs: struct });
      });
    }
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las estructuras base." });
  }
})

router.get('/all/wData', async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {

      await Struct.aggregate([
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
            data: 1,
            visibility: 1,
            count_questions: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
          }
        }
      ]).then((struct) => {
        res.status(200).json({ message: "Estructuras encontradas.", structs: struct });
      });
    } else if (req.query.roleA === 'POD') {//Revisar

      // let all_structs = await Struct.aggregate([
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "createdBy",
      //       foreignField: "_id",
      //       as: "user_info"
      //     }
      //   },
      //   { $unwind: "$user_info" },
      //   {
      //     $lookup: {
      //       from: "roles",
      //       localField: "user_info.role",
      //       foreignField: "_id",
      //       as: "role_info"
      //     }
      //   },
      //   { $unwind: "$role_info" },
      //   { $sort: { createdAt: -1 } },
      //   {
      //     $project: {
      //       title: "$data.title",
      //       data: 1,
      //       visibility: 1,
      //       createdAt: 1,
      //       count_questions: 1,
      //       createdBy: "$user_info.name",
      //       createdById: "$user_info._id",
      //       createdByAlias: "$role_info.alias"
      //     }
      //   }
      // ]);

      // let ids_users = []
      // all_structs.forEach((item) => {
      //   ids_users.push(item.createdById)
      // })

      // let all_users = await User.find({
      //   $and: [
      //     { _id: { $in: ids_users } },
      //     { school: req.query.schoolI }
      //   ],
      // }, '_id').lean()

      // let final_users = all_users.map((item) => item._id.toString())

      // let final = all_structs.filter((item) => item.createdById.toString() === req.query.key ? true : (item.createdByAlias === 'INV' ? true : (final_users.includes(item.createdById.toString()) && item.visibility === true)))

      // res.status(200).json({ message: "Estructuras encontradas.", structs: final });

    } else {

      let all_structs = await Struct.aggregate([
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
            createdAt: 1,
            visibility: 1,
            createdBy: "$user_info.name",
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

      all_structs.forEach((item) => {
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
      await Struct.aggregate([
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
            title: "$data.title",
            data: 1,
            visibility: 1,
            createdAt: 1,
            count_questions: 1,
            createdBy: "$user_info.name",
          }
        }
      ]).then((struct) => {
        res.status(200).json({ message: "Estructuras encontradas.", structs: struct });
      });



      // await Struct.aggregate([
      //   { $match: { createdBy: req.query.key } },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "createdBy",
      //       foreignField: "_id",
      //       as: "user_info"
      //     }
      //   },
      //   { $unwind: "$user_info" },
      //   { $unwind: "$data.pages" },
      //   { $sort: { createdAt: -1 } },
      //   {
      //     $project: {
      //       title: "$data.title",
      //       data: 1,
      //       visibility: 1,
      //       createdAt: 1,
      //       count_questions: 1,
      //       createdBy: "$user_info.name",
      //     }
      //   }
      // ]).then((struct) => {
      //   res.status(200).json({ message: "Estructuras encontradas.", structs: struct });
      // });
    }
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las estructuras base." });
  }
})

router.get("/get", async (req, res) => {
  try {
    Struct.findOne({ _id: req.query.id }).populate("createdBy").then((struct) => {
      res.status(200).json({ message: "Estructura base encontrada.", struct: struct });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando la estructura base." });
  }
});

router.post('/add', async (req, res) => {
  try {
    const newStruct = new Struct({
      data: req.body.data,
      visibility: 0,
      count_questions: sumArray(req.body.data.pages),
      createdBy: req.body.createdBy,
    });

    newStruct
      .save()
      .then(struct =>
        res.status(201).json({ message: 'Estructura agregada exitosamente.', struct: struct }),
      )
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la estructura." });
  }
});

router.post('/edit', async (req, res) => {
  try {
    Struct.findOne({ _id: req.body._id }).then(struct => {
      if (!struct)
        return res.status(400).send({ message: "La estructura no se encuentra registrado en el sistema." });

      struct.data = req.body.data
      struct.count_questions = sumArray(req.body.data.pages)
      struct.save().then(struct_saved =>
        res.status(200).json({ message: 'Estructura editada exitosamente.', struct: struct_saved }),
      )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando la estructura." });
  }
});

router.post('/change', async (req, res) => {
  try {
    Struct.findOne({ _id: req.body._id }).then(struct => {
      if (!struct)
        return res.status(400).send({ message: "La estructura no se encuentra registrado en el sistema." });

      struct.visibility = req.body.visibility
      var stringVisib = (req.body.visibility === true) ? "visible para los usuarios" : "visible solo para mí"
      struct.save().then(struct_saved =>
        res.status(200).json({ message: 'La estructura es ' + stringVisib + ' ahora.', struct: struct_saved }),
      )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error editando la estructura." });
  }
});

router.post('/delete', async (req, res) => {
  try {
    Struct.findOne({ _id: req.body._id }).then(struct => {
      if (!struct)
        return res.status(400).send({ message: "La estructura base no se encuentra registrada en el sistema." });

      struct.deleteOne().then(() =>
        res.status(200).json({ message: 'Estructura base eliminada exitosamente.', struct: true }),
      )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error eliminando la estructura base." });
  }
});

module.exports = router;