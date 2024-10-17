var express = require('express');
var router = express.Router();
const axios = require("axios");

let Population = require('../models/population.model');

router.get('/all', async (req, res) => {
  try {

    await axios.get("http://portafolio.ciens.ucv.ve/getusers")
      .then(async data => {
        if (data.data.length > 0) {
          await Population.findOne({ name: 'Usuarios del Portafolio Digital UCV', origin: 'P' }).then(async (population) => {
            if (!population) {//Agregar

              let array = []
              data.data.forEach(item => {
                let array_i = []
                array_i.push(item.email, item.dependencies, item.schoolUser, item.instituteUser)
                array.push(array_i)
              })

              let headers = ['Correo electrónico', 'Dependencia', 'Escuela', 'Instituto']

              const newPopulation = new Population({
                name: 'Usuarios del Portafolio Digital UCV',
                description: 'Usuarios provenientes del Portafolio Digital de la Facultad de Ciencias de la Universidad Central de Venezuela',
                header: headers,
                data: array,
                origin: 'P',
                isActive: 0,
                createdBy: null
              });
              newPopulation.save()
              console.log(array)
              //console.log(data.data)
            } else {//Editar
              let array = []
              data.data.forEach(item => {
                let array_i = []
                array_i.push(item.email, item.dependencies, item.schoolUser, item.instituteUser)
                array.push(array_i)
              })

              population.data = array
              population.save()
            }
          })
        }
        await axios.get("http://portafolio.ciens.ucv.ve/getsuscribers")
          .then(async data => {
            if (data.data.length > 0) {
              await Population.findOne({ name: 'Suscriptores del Portafolio Digital UCV', origin: 'P' }).then(async (population) => {
                if (!population) {//Agregar

                  let array = []
                  data.data.forEach(item => {
                    let array_i = []
                    array_i.push(item.emailSub)
                    array.push(array_i)
                  })

                  let headers = ['Correo electrónico suscriptor']

                  const newPopulation = new Population({
                    name: 'Suscriptores del Portafolio Digital UCV',
                    description: 'Suscriptores provenientes del Portafolio Digital de la Facultad de Ciencias de la Universidad Central de Venezuela',
                    header: headers,
                    data: array,
                    origin: 'P',
                    isActive: 0,
                    createdBy: null
                  });
                  newPopulation.save()
                  console.log(array)
                  //console.log(data.data)
                } else {//Editar
                  let array = []
                  data.data.forEach(item => {
                    let array_i = []
                    array_i.push(item.emailSub)
                    array.push(array_i)
                  })

                  population.data = array
                  population.save()
                }
              })
            }
            await axios.get("http://portafolio.ciens.ucv.ve/getrequests")
              .then(async data => {
                if (data.data.length > 0) {
                  await Population.findOne({ name: 'Solicitantes del Portafolio Digital UCV', origin: 'P' }).then(async (population) => {
                    if (!population) {//Agregar

                      let array = []
                      data.data.forEach(item => {
                        let array_i = []
                        array_i.push(item.emailReq)
                        array.push(array_i)
                      })

                      let headers = ['Correo electrónico solicitante']

                      const newPopulation = new Population({
                        name: 'Solicitantes del Portafolio Digital UCV',
                        description: 'Solicitantes provenientes del Portafolio Digital de la Facultad de Ciencias de la Universidad Central de Venezuela',
                        header: headers,
                        data: array,
                        origin: 'P',
                        isActive: 0,
                        createdBy: null
                      });
                      newPopulation.save()
                      console.log(array)
                      //console.log(data.data)
                    } else {//Editar
                      let array = []
                      data.data.forEach(item => {
                        let array_i = []
                        array_i.push(item.emailReq)
                        array.push(array_i)
                      })

                      population.data = array
                      population.save()
                    }
                  })
                }
              })
          })
      })

    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {

      await Population.aggregate([
        {
          $addFields: {
            "count": { $size: "$data" }
          }
        },
        {
          $lookup: {
            from: "census",
            localField: "_id",
            foreignField: "population",
            as: "census_count"
          }
        },
        {
          $lookup: {
            from: "surveys",
            localField: "_id",
            foreignField: "population",
            as: "surveys_count"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info",
          }
        },
        {
          $unwind: {
            path: "$user_info",
            preserveNullAndEmptyArrays: true
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: 1,
            origin: 1,
            isActive: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
            count: 1,
            //updatedBy: 1,
            census_count: { $size: "$census_count" },
            surveys_count: { $size: "$surveys_count" }
          }
        }
      ]).then(population => {
        res.status(200).json({ message: 'Poblaciones encontradas.', populations: population })
      });

    } else if (req.query.roleA === 'POD') {
      let all_populations = await Population.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "user_info"
          }
        },
        {
          $unwind: {
            path: "$user_info",
            preserveNullAndEmptyArrays: true
          }
        },
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
            isActive: 1,
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        }
      ]);
      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []

      all_populations.forEach((item) => {
        if (item.createdByAlias === 'ADM' && item.isActive === true) {
          ids_admins.push(item._id)
        } else if (item.createdByAlias === 'DIR' && item.isActive === true) {
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

      await Population.aggregate([
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
          $addFields: {
            "count": { $size: "$data" }
          }
        },
        {
          $lookup: {
            from: "census",
            localField: "_id",
            foreignField: "population",
            as: "census_count"
          }
        },
        {
          $lookup: {
            from: "surveys",
            localField: "_id",
            foreignField: "population",
            as: "surveys_count"
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
        {
          $unwind: {
            path: "$user_info",
            preserveNullAndEmptyArrays: true
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: 1,
            origin: 1,
            isActive: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
            count: 1,
            //updatedBy: 1,
            census_count: { $size: "$census_count" },
            surveys_count: { $size: "$surveys_count" }
          }
        }
      ]).then((population) => {
        res.status(200).json({ message: 'Poblaciones encontradas.', populations: population })
      });
    } else {
      await Population.aggregate([
        { $match: { $expr: { $eq: ['$createdBy', { $toObjectId: req.query.key }] } } },
        {
          $addFields: {
            "count": { $size: "$data" }
          }
        },
        {
          $lookup: {
            from: "census",
            localField: "_id",
            foreignField: "population",
            as: "census_count"
          }
        },
        {
          $lookup: {
            from: "surveys",
            localField: "_id",
            foreignField: "population",
            as: "surveys_count"
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
            name: 1,
            origin: 1,
            isActive: 1,
            createdAt: 1,
            createdBy: "$user_info.name",
            createdById: "$user_info._id",
            count: 1,
            //updatedBy: 1,
            census_count: { $size: "$census_count" },
            surveys_count: { $size: "$surveys_count" }
          }
        }
      ]).then((population) => {
        res.status(200).json({ message: 'Poblaciones encontradas.', populations: population })
      });
    }

  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando las poblaciones." });
  }
})

router.get('/all/data', async (req, res) => {
  try {
    if (req.query.roleA === 'ADM' || req.query.roleA === 'DIR') {
      await Population.aggregate([
        {
          $addFields: {
            "count": { $size: "$data" }
          }
        },
        {
          $lookup: {
            from: "census",
            localField: "_id",
            foreignField: "population",
            as: "census_count"
          }
        },
        {
          $lookup: {
            from: "surveys",
            localField: "_id",
            foreignField: "population",
            as: "surveys_count"
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
        {
          $unwind: {
            path: "$user_info",
            preserveNullAndEmptyArrays: true
          }
        },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            name: 1,
            description: 1,
            header: 1,
            data: 1,
            origin: 1,
            isActive: 1,
            createdAt: 1,
            createdBy: "$user_info",
            createdById: "$user_info._id",
            count: 1,
            updatedBy: 1,
            census_count: { $size: "$census_count" },
            surveys_count: { $size: "$surveys_count" }
          }
        }
      ]).then(population => {
        res.status(200).json({ message: 'Poblaciones encontradas.', populations: population })
      });
    } else if (req.query.roleA === 'POD') {
      let all_populations = await Population.aggregate([
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
            isActive: 1,
            createdById: "$user_info._id",
            createdByAlias: "$role_info.alias",
            schoolId: "$school_info._id",
          }
        }
      ]);
      let ids_admins = []
      let ids_dirs = []
      let ids_pods = []

      all_populations.forEach((item) => {
        if (item.createdByAlias === 'ADM' && item.isActive === true) {
          ids_admins.push(item._id)
        } else if (item.createdByAlias === 'DIR' && item.isActive === true) {
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

      await Population.aggregate([
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
          $addFields: {
            "count": { $size: "$data" }
          }
        },
        {
          $lookup: {
            from: "census",
            localField: "_id",
            foreignField: "population",
            as: "census_count"
          }
        },
        {
          $lookup: {
            from: "surveys",
            localField: "_id",
            foreignField: "population",
            as: "surveys_count"
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
            name: 1,
            description: 1,
            header: 1,
            data: 1,
            origin: 1,
            isActive: 1,
            createdAt: 1,
            createdBy: "$user_info",
            createdById: "$user_info._id",
            count: 1,
            updatedBy: 1,
            census_count: { $size: "$census_count" },
            surveys_count: { $size: "$surveys_count" }
          }
        }
      ]).then((population) => {
        res.status(200).json({ message: 'Poblaciones encontradas.', populations: population })
      });
    } else {
      await Population.aggregate([
        { $match: { $expr: { $eq: ['$createdBy', { $toObjectId: req.query.key }] } } },
        {
          $addFields: {
            "count": { $size: "$data" }
          }
        },
        {
          $lookup: {
            from: "census",
            localField: "_id",
            foreignField: "population",
            as: "census_count"
          }
        },
        {
          $lookup: {
            from: "surveys",
            localField: "_id",
            foreignField: "population",
            as: "surveys_count"
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
            name: 1,
            description: 1,
            header: 1,
            data: 1,
            origin: 1,
            isActive: 1,
            createdAt: 1,
            createdBy: "$user_info",
            createdById: "$user_info._id",
            count: 1,
            updatedBy: 1,
            census_count: { $size: "$census_count" },
            surveys_count: { $size: "$surveys_count" }
          }
        }
      ]).then((population) => {
        res.status(200).json({ message: 'Poblaciones encontradas.', populations: population })
      });
    }

  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error consultando las poblaciones." });
  }
})

router.get("/get", async (req, res) => {
  try {
    await Population.aggregate([
      { $match: { $expr: { $eq: ['$_id', { $toObjectId: req.query.id }] } } },
      {
        $addFields: {
          "count": { $size: "$data" }
        }
      },
      {
        $lookup: {
          from: "census",
          localField: "_id",
          foreignField: "population",
          as: "census_count"
        }
      },
      {
        $lookup: {
          from: "surveys",
          localField: "_id",
          foreignField: "population",
          as: "surveys_count"
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
      {
        $unwind: {
          path: "$user_info",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          header: 1,
          data: 1,
          origin: 1,
          isActive: 1,
          createdAt: 1,
          createdBy: "$user_info",
          createdById: "$user_info._id",
          count: 1,
          updatedBy: 1,
          census_count: { $size: "$census_count" },
          surveys_count: { $size: "$surveys_count" }
        }
      }
    ]).then((population) => {
      console.log(population)
      res.status(200).json({ message: "Población encontrada.", population: population[0] });
    });


    // Population.findOne({ _id: req.query.id }).populate("createdBy").then((population) => {
    //   res.status(200).json({ message: "Población encontrada.", population: population });
    // });
  } catch (e) {
    console.log(e)
    res.status(500).send({ message: "Ha ocurrido un error consultando la población." });
  }
});

router.post('/add', async (req, res) => {
  try {
    let data_file = req.body.data
    let arr = JSON.parse(JSON.stringify(data_file));
    let final_array = []
    let propertyNames = Object.keys(arr[0]);
    arr.forEach(item => {
      let second_array = []
      propertyNames.forEach(key => {
        second_array.push(item[key])
      });
      final_array.push(second_array)
    });

    const newPopulation = new Population({
      name: req.body.name,
      description: req.body.description,
      header: propertyNames,
      data: final_array,
      origin: req.body.origin,
      isActive: 0,
      createdBy: req.body.createdBy,
    });

    newPopulation.save().then(population =>
      res.status(201).json({ message: 'Población agregada exitosamente.', population: population }),
    )
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la población." });
  }
});

function buscarPosicionesConCorreos(arreglos) {
  const posicionesConCorreos = [];

  for (let i = 0; i < arreglos.length; i++) {
    let subArray = arreglos[i];

    for (let j = 0; j < subArray.length; j++) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subArray[j])) {
        if (!posicionesConCorreos.includes(j)) {
          posicionesConCorreos.push(j);
        }
      }
    }
  }

  return posicionesConCorreos;
}


router.post('/edit', async (req, res) => {
  try {
    Population.findOne({ _id: req.body._id }).then(async (population) => {
      if (!population)
        return res.status(400).send({ message: "La población no se encuentra registrada en el sistema.", });

      let final_array = []
      if (req.body.data === undefined) {
        population.name = req.body.name
        population.description = req.body.description
        population.updatedBy = req.body.updatedBy
      } else {
        let data_file = req.body.data
        let arr = JSON.parse(JSON.stringify(data_file));

        let propertyNames = Object.keys(arr[0]);
        arr.forEach(item => {
          let second_array = []
          propertyNames.forEach(key => {
            second_array.push(item[key])
          });
          final_array.push(second_array)
        });

        population.name = req.body.name
        population.description = req.body.description
        population.updatedBy = req.body.updatedBy
        population.header = propertyNames
        population.data = final_array
      }

      // let positions = buscarPosicionesConCorreos(final_array)
      // console.log(positions)

      // const existCensus = await Census.find({ population: req.body._id, status: 1, type: 1 })
      // if (existCensus) {
      //   for (let i = 0; i < existCensus.length; i++) {
      //     let maillist = ''

      //     if (positions.length > 0) {
      //       console.log(existCensus[i].emailField)
      //       if (positions.includes([existCensus[i].emailField])) {
      //         final_array.forEach((data, index) => {
      //           if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[existCensus[i].emailField])) {
      //             maillist = maillist + data[req.body.emailField] + ", ";
      //           }
      //         });
      //       } else {
      //         final_array.forEach((data, index) => {
      //           if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data[positions[0]])) {
      //             maillist = maillist + data[req.body.emailField] + ", ";
      //           }
      //         });
      //       }
      //     }

      //     console.log(maillist)
      //   }
      // }

      await population.save().then(population =>
        res.status(200).json({ message: 'Población editada exitosamente.', population: population }),
      )
    })
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la población." });
  }
});

router.post('/export', async (req, res) => {
  try {
    Population.findOne({ _id: req.body._id }).then(async (population) => {
      if (!population)
        return res.status(400).send({ message: "La población no se encuentra registrada en el sistema.", });

      let final_array = []
      population.data.forEach((item) => {
        var obj = {}
        item.forEach((key, index) => {
          let element_key = population.header[index];
          obj[element_key] = key
        });
        final_array.push(obj)
      });
      res.status(200).json({ message: 'Datos de población exportados exitosamente.', population: final_array })

    })
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error agregando la población." });
  }
});

router.post('/delete', async (req, res) => {
  try {
    Population.findOne({ _id: req.body._id }).then(population => {
      if (!population)
        return res.status(400).send({ message: "La población no se encuentra registrada en el sistema." });

      population.deleteOne()
        .then(() =>
          res.status(200).json({ message: 'Población eliminada exitosamente.', population: true }),
        )
    });
  } catch (e) {
    res.status(500).send({ message: "Ha ocurrido un error eliminando la población." });
  }
});

router.post("/change", async (req, res) => {
  try {
    Population.findOne({ _id: req.body._id }).then((population) => {
      if (!population)
        return res.status(400).send({
          message: "La población no se encuentra registrada en el sistema.",
        });

      population.isActive = req.body.isActive;
      var stringVisib = req.body.isActive === true ? "visible para los usuarios" : "visible solo para mí";
      population.save().then((population_saved) =>
        res.status(200).json({
          message: "La población es " + stringVisib + " ahora.",
          population_saved: population_saved,
        })
      );
    });
  } catch (e) {
    res.status(500).send({
      message: "Ha ocurrido un error cambiando la visibilidad de la población.",
    });
  }
});

module.exports = router;