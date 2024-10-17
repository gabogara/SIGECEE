var moment = require('moment');
const schedule = require('node-schedule');
let Census = require("../models/census.model");
let Survey = require("../models/survey.model");
let CensusResult = require("../models/censusResult.model");
let Population = require("../models/population.model");

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(1, 6)];
rule.hour = 23;
rule.minute = 55;

const job = schedule.scheduleJob(rule, async function () {

  let today_c = moment().startOf("day").format()
  await Census.find({
    $and: [{
      endDate: today_c
    }, { status: 1 }]
  }).then(async (census) => {

    census.forEach(async (census_item) => {
      await CensusResult.find({ census: census_item._id }).then(async (result) => {
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
                      let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[1][item]);
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

          } else {//Es un censo abierto y no se debe incluir el email del censado en los headers y data
            //FALTA PROBAR

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
                      let filter = allQuestionStruct[item].choices.filter(item_filter => item_filter.value === item2[1][item]);
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

            newPopulation.save();
          }
        }
      });
    })
  });

  const today = moment().startOf('day')
  await Census.updateMany({
    $and: [{
      endDate: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    }, { status: 1 }]
  }, { $set: { status: 2 } });
  console.log("Rutina de censos ejecutada")

  await Survey.updateMany({
    $and: [{
      endDate: {
        $gte: today.toDate(),
        $lte: moment(today).endOf('day').toDate()
      }
    }, { status: 1 }]
  }, { $set: { status: 2 } });
  console.log("Rutina de encuestas ejecutada")
});
