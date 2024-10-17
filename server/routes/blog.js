var express = require('express');
var router = express.Router();

let BlogEntry = require('../models/blogEntry.model');

router.get('/entries', async (req, res) => {
  try {
    await BlogEntry.aggregate([
      { $match: { ins_type: { $eq: 'Censo' } } },
      {
        $lookup: {
          from: "census",
          localField: "census",
          foreignField: "_id",
          as: "instrument_census"
        }
      },
      { $unwind: "$instrument_census" },
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
          ins_type: 1,
          instrument_name: "$instrument_census.data.title",
          title: 1,
          status: 1,
          createdBy: "$user_info.name",
          createdById: "$user_info._id",
          createdAt: 1,
        }
      },
      {
        $unionWith: {
          coll: "blogentries", pipeline: [
            { $match: { ins_type: { $eq: 'Encuesta' } } },
            {
              $lookup: {
                from: "surveys",
                localField: "survey",
                foreignField: "_id",
                as: "instrument_survey"
              }
            },
            { $unwind: "$instrument_survey" },
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "user_info"
              }
            },
            { $unwind: "$user_info" },
            //{ $unwind: "$blog_count" },
            {
              $project: {
                ins_type: 1,
                instrument_name: "$instrument_survey.data.title",
                title: 1,
                status: 1,
                createdBy: "$user_info.name",
                createdById: "$user_info._id",
                createdAt: 1,
              }
            },
          ]
        }
      },
      { $sort: { createdAt: -1 } },
    ]).then((entry) => {
      res.status(200).json({ message: "Publicaciones encontradas.", entry: entry });
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las publicaciones." });
  }
})

router.get('/entriesActive', async (req, res) => {
  try {
    BlogEntry.find({ status: 1 }).sort({ createdAt: -1 }).then(entry => {
      res.status(200).json({ message: 'Publicaciones encontradas.', entry: entry })
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las publicaciones." });
  }
})

router.get('/entry', async (req, res) => {
  try {
    if (req.query.type.toLocaleLowerCase() === 'censo') {
      BlogEntry.findOne({ census: req.query.id }).sort({ createdAt: -1 }).then(entry => {
        res.status(200).json({ message: 'Publicación encontrada.', entry: entry })
      });
    } else {
      BlogEntry.findOne({ survey: req.query.id }).sort({ createdAt: -1 }).then(entry => {
        res.status(200).json({ message: 'Publicación encontrada.', entry: entry })
      });
    }

  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las publicaciones." });
  }
})

router.get('/entryId', async (req, res) => {
  try {
    BlogEntry.findOne({ _id: req.query.id }).sort({ createdAt: -1 }).then(entry => {
      res.status(200).json({ message: 'Publicación encontrada.', entry: entry })
    });

  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las publicaciones." });
  }
})

router.post("/change", async (req, res) => {
  try {
    BlogEntry.findOne({ _id: req.body._id }).then((entry) => {
      if (!entry)
        return res.status(400).send({
          message: "La publicación no se encuentra registrada en el sistema.",
        });

      entry.status = req.body.status;
      var stringVisib = req.body.status === true ? "visible" : "no es visible";
      entry.save().then((entry_saved) =>
        res.status(200).json({
          message: "El censo es " + stringVisib + " ahora.",
          entry: entry_saved,
        })
      );
    });
  } catch (e) {
    res.status(500).send({
      message: "Ha ocurrido un error cambiando la estado de la publicación.",
    });
  }
});

router.post("/delete", async (req, res) => {
  try {
    BlogEntry.findOne({ _id: req.body._id }).then((entry) => {
      if (!entry)
        return res.status(400).send({
          message: "La publicación no se encuentra registrada en el sistema.",
        });

      entry.deleteOne().then(() =>
        res.status(200).json({ message: "La publicación eliminada exitosamente.", entry: true })
      );
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error eliminando la publicación ." });
  }
});

module.exports = router;