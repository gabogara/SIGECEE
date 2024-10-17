import { useState, useEffect } from "react";
import "survey-analytics/survey.analytics.min.css";
import PropTypes from 'prop-types'
import {
  Box, Grid, Button, Typography, FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  Card,
  CardContent,
  TextField,
  Fab,
  Zoom,
  Tooltip as TooltipMUI, SpeedDial, SpeedDialAction
} from '@mui/material'
import Api from '../../../services/Api';
import ResultNumberTable from "./ResultNumberTable";
import ResultTable from "./ResultTable";
import { useSelector } from "react-redux";
import SaveIcon from '@mui/icons-material/Save';
import { FileDownload } from "@mui/icons-material";
import { utils, writeFile } from "xlsx";
import moment from 'moment';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2canvas from "html2canvas";
// import { useSelector } from "react-redux";

import { Chart as ChartJS, registerables } from 'chart.js'

// import {
//   Chart as ChartJS,
//   LinearScale,
//   CategoryScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Legend,
//   Tooltip,
//   ArcElement,
//   RadialLinearScale,
//   Filler
// } from 'chart.js';
import {
  Chart,
} from 'react-chartjs-2';
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import { tooltipClasses } from '@mui/material/Tooltip'
const { jsPDF } = require("jspdf");

ChartJS.register(...registerables)

// ChartJS.register(
//   LinearScale,
//   CategoryScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Legend,
//   Tooltip,
//   ArcElement,
//   RadialLinearScale,
//   Filler
// );

const actions = [
  { icon: <NoteAddIcon />, name: 'Descargar Excel', },
  { icon: <PictureAsPdfIcon />, name: 'Descargar PDF' },
];

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8
    },
  },
};

const SubMenuChart = styled(ListSubheader)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 700,
  color: '#000'
}));

const MenuItemChart = styled(MenuItem)(({ theme }) => ({
  fontSize: '14px',
  lineHeight: 1
}));

const menuChartValues = ["Vertical Bar", "Horizontal bar", "Area", "Line", "Doughnut", "Pie", "Polar", "Scatter"]
const menuChartValuesAlias = ["Gráfica de barras verticales", "Gráfica de barras horizontales", "Gráfica de área", "Gráfica de línea", "Gráfica de dona/anillo", "Gráfica de pastel/pie", "Gráfica polar", "Gráfica de dispersión"]
const menuChartValues2 = ["Mínimo", "Máximo", "Promedio/Media", "Sumatoria", "Menor que (<)", "Menor o igual que (≤)", "Igual que (=)", "Mayor que (>)", "Mayor o igual que (≥)", "Mediana", "Moda", "Rango"];
const menuChartValues3 = ["Tabla"];
const menuChartValues2Tooltip = ["El mínimo retorna el menor valor dentro del grupo de números.", "El máximo retorna el mayor valor dentro del grupo de números.", "El promedio/media retorna el resultado de sumar todos los números del conjunto de datos y luego dividir la sumatoria entre la cantidad de números del conjunto.", "La suma de todos los números del conjunto de datos.", "Menor que (<) retorna todos los números menores que el número ingresado", "Menor o igual que (≤) retorna todos los números menores o iguales que el número ingresado.", "Igual que (=) retorna todos los números iguales que el número ingresado.", "Mayor que (>) retorna todos los números mayores que el número ingresado.", "Mayor o igual que (≥) retorna todos los números mayores o iguales que el número ingresado.", "La mediana retorna el número medio en el conjunto (después que los números han sido ordenados del menor al mayor) o, si hay un par de datos en el medio, la mediana es el promedio de los dos números medios.", "La moda retorna el número dentro del conjunto de datos que más se repite, el que tiene mayor frecuencia.", "El rango retorna la diferencia entre el valor máximo y el valor mínimo del conjunto de datos."]
const menuChartValues2Alias = ["min", "max", "aver", "sum", "less", "less_eq", "eq", "greater", "greater_eq", "median", "mode", "range"]
const menuChartValues3Alias = ["table"]

const BootstrapTooltip = styled(({ className, ...props }) => (
  <TooltipMUI {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const ViewStudy = ({
  data,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  progress,
  setdataTable,
  setValue,
}) => {
  /*const [result, setResult] = useState({});
  const todos = useSelector((state) => state.todos);
  const [study, setStudy] = useState(null);*/
  const [chartType, setChartType] = useState({});
  const [charts, setCharts] = useState(null);
  const [optionsChart, setOptionChart] = useState({})
  const [displayNoneClass, setDisplayNoneClass] = useState({})
  const [operData, setOperData] = useState({})
  const todos = useSelector((state) => state.todos);
  const [selectValue, setSelectValue] = useState({})

  const handleChangeChart = (event, index) => {
    let item = charts[index]
    let item2 = false;
    switch (event.target.value) {
      case 0:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            indexAxis: 'x',
            scales: {
              y: {
                ticks: {
                  precision: 0
                }
              },
              x: {
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
            }
          },
        })
        setChartType({
          ...chartType,
          [index]: 'bar'
        })
        break;
      case 1:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            indexAxis: 'y',
            scales: {
              y: {
                ticks: {
                  precision: 0
                }
              },
              x: {
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
            }
          },
        })
        setChartType({
          ...chartType,
          [index]: 'bar'
        })
        break;
      case 2:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            indexAxis: 'x',
            scales: {
              y: {
                ticks: {
                  precision: 0
                }
              },
              x: {
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
            }
          },
        })

        item.chart.datasets[0].fill = true
        setChartType({
          ...chartType,
          [index]: 'line'
        })
        setCharts({ ...charts, [index]: item })
        break;
      case 3:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            indexAxis: 'x',
            scales: {
              y: {
                ticks: {
                  precision: 0
                }
              },
              x: {
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
            }
          },
        })
        item.chart.datasets[0].fill = false
        setChartType({
          ...chartType,
          [index]: 'line'
        })
        setCharts({ ...charts, [index]: item })
        break;
      case 4:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            scales: {},
            plugins: {
              legend: {
                display: true
              },
            }
          },
        })
        setChartType({
          ...chartType,
          [index]: 'doughnut'
        })
        break;
      case 5:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            scales: {},
            plugins: {
              legend: {
                display: true
              },
            }
          },
        })
        setChartType({
          ...chartType,
          [index]: 'pie'
        })
        break;
      case 6:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            scales: {
              r: {
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: true
              },
            }
          },
        })
        setChartType({
          ...chartType,
          [index]: 'polarArea'
        })
        break;
      case 7:
        setOptionChart({
          ...optionsChart,
          [index]: {
            ...optionsChart[index],
            scales: {
              y: {
                ticks: {
                  precision: 0
                }
              },
              x: {
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                display: false
              },
            }
          },
        })
        setChartType({
          ...chartType,
          [index]: 'scatter'
        })
        break;
      default:
        item2 = true;
        if (event.target.value === 'table') {
          operFunc('table', item.chart.labels, item.chart.datasets[0].data, index);
        } else {
          setOperData({
            ...operData,
            [index]: {
              oper: event.target.value,
              input: 0,
              showTable: false,
              result: []
            }
          })
        }

        setChartType({
          ...chartType,
          [index]: 'custom'
        })
        break;
    }
    setSelectValue({
      ...selectValue,
      [index]: event.target.value
    })
    setDisplayNoneClass({ ...displayNoneClass, [index]: item2 })
  }

  useEffect(() => {
    (async () => {
      setProgress(true);
      if (data.ins_type === 'Censo') {
        await Api.get('/study/getStudy?_id=' + data._id + '&type=censo')
          .then(async (response) => {
            if (!response.data.study) {
              await Api.get('/census/getResultsChart?_id=' + data._id)
                .then((res) => {
                  //setResult(res.data.results.results);
                  let charts_type = {}
                  let chart_options = {}
                  let charts_data = {}
                  let display_data = []
                  let oper_data = {}
                  let contador = 0;
                  Object.keys(res.data.results.results).forEach((question) => {
                    if (Object.values(res.data.results.results[question])[0].type !== 'image' && Object.values(res.data.results.results[question])[0].type !== 'imagepicker' && Object.values(res.data.results.results[question])[0].type !== 'file') {
                      if (Object.values(res.data.results.results[question])[0].type === 'matrix') {
                        charts_type[contador] = 'bar';
                        chart_options[contador] = {
                          indexAxis: 'y',
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              ticks: {
                                precision: 0
                              }
                            },
                            x: {
                              ticks: {
                                precision: 0
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            },
                          }
                        };
                      } else {
                        charts_type[contador] = 'pie';
                        chart_options[contador] = {
                          indexAxis: 'x',
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                          },
                          plugins: {
                            legend: {
                              display: true
                            },
                          }
                        };
                      }
                      charts_data[contador] = {
                        title: Object.values(res.data.results.results[question])[0].title ?? Object.values(res.data.results.results[question])[0].name,
                        chart: {
                          labels: Object.keys(res.data.results.results[question].question_results),
                          datasets: [
                            {
                              label: 'Cantidad',
                              fill: false,
                              data: Object.values(res.data.results.results[question].question_results),
                              backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                              ],
                              borderColor: [
                                'rgba(255, 255, 255, 1)',
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }
                      };
                      display_data[contador] = false
                      oper_data[contador] = {
                        oper: '',
                        input: 0,
                        showTable: false,
                        result: [],
                      }
                      contador++;
                    }

                  })

                  setCharts(charts_data)
                  setChartType(charts_type);
                  setOptionChart(chart_options);
                  setDisplayNoneClass(display_data);
                  setOperData(oper_data);
                  //setStudy(res.data.results.study)
                })
                .catch((error) => {
                  console.error('Error:', error.message);
                });
            } else {
              await Api.get('/census/getResultsChart?_id=' + data._id)
                .then((res) => {
                  //setResult(res.data.results.results);
                  let charts_type = {}
                  let chart_options = {}
                  let charts_data = {}
                  let display_data = []
                  let oper_data = {}
                  let select_values = {}
                  let contador = 0;
                  Object.keys(res.data.results.results).forEach((question) => {
                    if (Object.values(res.data.results.results[question])[0].type !== 'image' && Object.values(res.data.results.results[question])[0].type !== 'imagepicker' && Object.values(res.data.results.results[question])[0].type !== 'file') {
                      if (response.data.study.data[contador].type) {
                        display_data[contador] = false
                        charts_type[contador] = response.data.study.data[contador].type;
                        chart_options[contador] = {
                          indexAxis: response.data.study.data[contador].options.indexAxis,
                          responsive: response.data.study.data[contador].options.responsive,
                          maintainAspectRatio: response.data.study.data[contador].options.maintainAspectRatio,
                          scales: response.data.study.data[contador].options.scales,
                          plugins: response.data.study.data[contador].options.plugins,
                        };
                        charts_data[contador] = {
                          title: Object.values(res.data.results.results[question])[0].title ?? Object.values(res.data.results.results[question])[0].name,
                          chart: {
                            labels: Object.keys(res.data.results.results[question].question_results),
                            datasets: [
                              {
                                label: 'Cantidad',
                                fill: response.data.study.data[contador].fill,
                                data: Object.values(res.data.results.results[question].question_results),
                                backgroundColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)',
                                ],
                                borderColor: [
                                  'rgba(255, 255, 255, 1)',
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        };
                        switch (response.data.study.data[contador].type) {
                          case 'bar':
                            (response.data.study.data[contador].options.indexAxis === 'x') ? select_values[contador] = 0 : select_values[contador] = 1
                            break;
                          case 'line':
                            (response.data.study.data[contador].fill === true) ? select_values[contador] = 2 : select_values[contador] = 3
                            break;
                          case 'doughnut':
                            select_values[contador] = 4
                            break;
                          case 'pie':
                            select_values[contador] = 5
                            break;
                          case 'polarArea':
                            select_values[contador] = 6
                            break;
                          case 'scatter':
                            select_values[contador] = 7
                            break;

                          default:
                            break;
                        }

                      } else {

                        charts_type[contador] = "custom";
                        select_values[contador] = response.data.study.data[contador].operType
                        charts_data[contador] = {
                          title: Object.values(res.data.results.results[question])[0].title ?? Object.values(res.data.results.results[question])[0].name,
                          chart: {
                            labels: Object.keys(res.data.results.results[question].question_results),
                            datasets: [
                              {
                                label: 'Cantidad',
                                fill: false,
                                data: Object.values(res.data.results.results[question].question_results),
                                backgroundColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)',
                                ],
                                borderColor: [
                                  'rgba(255, 255, 255, 1)',
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        };
                        display_data[contador] = true
                        //"min", "max", "aver", "sum", "less", "less_eq", "eq", "greater", "greater_eq", "median", "mode", "range"
                        if (!["sum", "aver", "max", "min", "table", "median", "mode", "range"].includes(response.data.study.data[contador].operType)) {

                          oper_data[contador] = {
                            oper: response.data.study.data[contador].operType,
                            input: response.data.study.data[contador].input,
                            showTable: true,
                            result: operFunc2(response.data.study.data[contador].operType, toNumberArray(Object.keys(res.data.results.results[question].question_results)), toNumberArray(Object.values(res.data.results.results[question].question_results)), contador, response.data.study.data[contador].input),
                          }
                        } else if (["table"].includes(response.data.study.data[contador].operType)) {
                          oper_data[contador] = {
                            oper: response.data.study.data[contador].operType,
                            showTable: true,
                            result: operFunc2(response.data.study.data[contador].operType, Object.keys(res.data.results.results[question].question_results), Object.values(res.data.results.results[question].question_results), contador, ''),
                          }
                        } else {
                          oper_data[contador] = {
                            oper: response.data.study.data[contador].operType,
                          }
                        }
                      }
                      contador++;
                    }

                  })

                  setCharts(charts_data);

                  setChartType(charts_type);
                  setOptionChart(chart_options);
                  setDisplayNoneClass(display_data);
                  setOperData(oper_data);
                  setSelectValue(select_values);
                  //setStudy(res.data.results.study)
                })
                .catch((error) => {
                  console.error('Error:', error.message);
                });
            }
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      } else {
        await Api.get('/study/getStudy?_id=' + data._id + '&type=encuesta')
          .then(async (response) => {
            if (!response.data.study) {
              await Api.get('/survey/getResultsChart?_id=' + data._id)
                .then((res) => {
                  //setResult(res.data.results.results);
                  let charts_type = {}
                  let chart_options = {}
                  let charts_data = {}
                  let display_data = []
                  let oper_data = {}
                  let contador = 0;
                  Object.keys(res.data.results.results).forEach((question) => {
                    if (Object.values(res.data.results.results[question])[0].type !== 'image' && Object.values(res.data.results.results[question])[0].type !== 'imagepicker' && Object.values(res.data.results.results[question])[0].type !== 'file') {
                      if (Object.values(res.data.results.results[question])[0].type === 'matrix') {
                        charts_type[contador] = 'bar';
                        chart_options[contador] = {
                          indexAxis: 'y',
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              ticks: {
                                precision: 0
                              }
                            },
                            x: {
                              ticks: {
                                precision: 0
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            },
                          }
                        };
                      } else {
                        charts_type[contador] = 'pie';
                        chart_options[contador] = {
                          indexAxis: 'x',
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                          },
                          plugins: {
                            legend: {
                              display: true
                            },
                          }
                        };
                      }

                      charts_data[contador] = {
                        title: Object.values(res.data.results.results[question])[0].title ?? Object.values(res.data.results.results[question])[0].name,
                        chart: {
                          labels: Object.keys(res.data.results.results[question].question_results),
                          datasets: [
                            {
                              label: 'Cantidad',
                              fill: false,
                              data: Object.values(res.data.results.results[question].question_results),
                              backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                              ],
                              borderColor: [
                                'rgba(255, 255, 255, 1)',
                              ],
                              borderWidth: 1,
                            },
                          ],
                        }
                      };
                      display_data[contador] = false
                      oper_data[contador] = {
                        oper: '',
                        input: 0,
                        showTable: false,
                        result: [],
                      }

                      contador++;

                    }


                  })

                  setCharts(charts_data)
                  setChartType(charts_type);
                  setOptionChart(chart_options);
                  setDisplayNoneClass(display_data);
                  setOperData(oper_data);
                  //setStudy(res.data.results.study)
                })
                .catch((error) => {
                  console.error('Error:', error.message);
                });
            } else {
              await Api.get('/survey/getResultsChart?_id=' + data._id)
                .then((res) => {
                  //setResult(res.data.results.results);
                  let charts_type = {}
                  let chart_options = {}
                  let charts_data = {}
                  let display_data = []
                  let oper_data = {}
                  let select_values = {}
                  let contador = 0;
                  Object.keys(res.data.results.results).forEach((question) => {
                    if (Object.values(res.data.results.results[question])[0].type !== 'image' && Object.values(res.data.results.results[question])[0].type !== 'imagepicker' && Object.values(res.data.results.results[question])[0].type !== 'file') {
                      if (response.data.study.data[contador].type) {
                        display_data[contador] = false
                        charts_type[contador] = response.data.study.data[contador].type;
                        chart_options[contador] = {
                          indexAxis: response.data.study.data[contador].options.indexAxis,
                          responsive: response.data.study.data[contador].options.responsive,
                          maintainAspectRatio: response.data.study.data[contador].options.maintainAspectRatio,
                          scales: response.data.study.data[contador].options.scales,
                          plugins: response.data.study.data[contador].options.plugins,
                        };
                        charts_data[contador] = {
                          title: Object.values(res.data.results.results[question])[0].title ?? Object.values(res.data.results.results[question])[0].name,
                          chart: {
                            labels: Object.keys(res.data.results.results[question].question_results),
                            datasets: [
                              {
                                label: 'Cantidad',
                                fill: response.data.study.data[contador].fill,
                                data: Object.values(res.data.results.results[question].question_results),
                                backgroundColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)',
                                ],
                                borderColor: [
                                  'rgba(255, 255, 255, 1)',
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        };
                        switch (response.data.study.data[contador].type) {
                          case 'bar':
                            (response.data.study.data[contador].options.indexAxis === 'x') ? select_values[contador] = 0 : select_values[contador] = 1
                            break;
                          case 'line':
                            (response.data.study.data[contador].fill === true) ? select_values[contador] = 2 : select_values[contador] = 3
                            break;
                          case 'doughnut':
                            select_values[contador] = 4
                            break;
                          case 'pie':
                            select_values[contador] = 5
                            break;
                          case 'polarArea':
                            select_values[contador] = 6
                            break;
                          case 'scatter':
                            select_values[contador] = 7
                            break;

                          default:
                            break;
                        }

                      } else {

                        charts_type[contador] = "custom";
                        select_values[contador] = response.data.study.data[contador].operType
                        charts_data[contador] = {
                          title: Object.values(res.data.results.results[question])[0].title ?? Object.values(res.data.results.results[question])[0].name,
                          chart: {
                            labels: Object.keys(res.data.results.results[question].question_results),
                            datasets: [
                              {
                                label: 'Cantidad',
                                fill: false,
                                data: Object.values(res.data.results.results[question].question_results),
                                backgroundColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)',
                                ],
                                borderColor: [
                                  'rgba(255, 255, 255, 1)',
                                ],
                                borderWidth: 1,
                              },
                            ],
                          }
                        };
                        display_data[contador] = true
                        //"min", "max", "aver", "sum", "less", "less_eq", "eq", "greater", "greater_eq", "median", "mode", "range"
                        if (!["sum", "aver", "max", "min", "table", "median", "mode", "range"].includes(response.data.study.data[contador].operType)) {

                          oper_data[contador] = {
                            oper: response.data.study.data[contador].operType,
                            input: response.data.study.data[contador].input,
                            showTable: true,
                            result: operFunc2(response.data.study.data[contador].operType, toNumberArray(Object.keys(res.data.results.results[question].question_results)), toNumberArray(Object.values(res.data.results.results[question].question_results)), contador, response.data.study.data[contador].input),
                          }
                        } else if (["table"].includes(response.data.study.data[contador].operType)) {
                          oper_data[contador] = {
                            oper: response.data.study.data[contador].operType,
                            showTable: true,
                            result: operFunc2(response.data.study.data[contador].operType, Object.keys(res.data.results.results[question].question_results), Object.values(res.data.results.results[question].question_results), contador, ''),
                          }
                        } else {
                          oper_data[contador] = {
                            oper: response.data.study.data[contador].operType,
                          }
                        }
                      }
                      contador++;
                    }

                  })

                  setCharts(charts_data);

                  setChartType(charts_type);
                  setOptionChart(chart_options);
                  setDisplayNoneClass(display_data);
                  setOperData(oper_data);
                  setSelectValue(select_values);
                  //setStudy(res.data.results.study)
                })
                .catch((error) => {
                  console.error('Error:', error.message);
                });
            }
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });

        // await Api.get('/survey/getResultsJson?_id=' + data._id)
        //   .then((res) => {
        //     //setResult(res.data.results.results);
        //     //setStudy(res.data.results.study)
        //   })
        //   .catch((error) => {
        //     console.error('Error:', error.message);
        //   });
      }
      setProgress(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, setProgress]);

  const toNumberArray = (arr) => {
    let numberArray = [];
    arr.forEach(ele => {
      numberArray.push(+ele)
    })
    return numberArray;
  }

  const operFunc = (string, arr, arr2, i) => {
    //["min", "max", "aver", "sum", "less", "less_eq", "eq", "greater", "greater_eq", "mean", "median", "mode", "range"]
    switch (string) {
      case 'aver':
        let average = 0;
        arr.forEach((item, index) => {
          average += item * arr2[index];
        })

        let len = arr2.reduce((a, b) => a + b);
        return average / len;
      case 'sum':
        let sum = 0;
        arr.forEach((item, index) => {
          sum += item * arr2[index];
        })
        return sum;
      case 'less':
        let lessers = [];

        arr.forEach((item, index2) => {
          if (item < operData[i].input) {
            lessers.push({ num: item, count: arr2[index2] });
          }
        })

        setOperData({
          ...operData,
          [i]: {
            ...operData[i],
            showTable: true,
            result: lessers,
          }
        });
        break;
      case 'less_eq':
        let lessersEq = [];

        arr.forEach((item, index2) => {
          if (item <= operData[i].input) {
            lessersEq.push({ num: item, count: arr2[index2] });
          }
        })

        setOperData({
          ...operData,
          [i]: {
            ...operData[i],
            showTable: true,
            result: lessersEq
          }
        });
        break;
      case 'eq':
        let equal = [];

        arr.forEach((item, index2) => {
          if (item === parseInt(operData[i].input)) {
            equal.push({ num: item, count: arr2[index2] });
          }
        })

        setOperData({
          ...operData,
          [i]: {
            ...operData[i],
            showTable: true,
            result: equal
          }
        });
        break;
      case 'greater':
        let greater = [];

        arr.forEach((item, index2) => {
          if (item > operData[i].input) {
            greater.push({ num: item, count: arr2[index2] });
          }
        })

        setOperData({
          ...operData,
          [i]: {
            ...operData[i],
            showTable: true,
            result: greater
          }
        });
        break;
      case 'greater_eq':
        let greaterEq = [];

        arr.forEach((item, index2) => {
          if (item >= operData[i].input) {
            greaterEq.push({ num: item, count: arr2[index2] });
          }
        })

        setOperData({
          ...operData,
          [i]: {
            ...operData[i],
            showTable: true,
            result: greaterEq
          }
        });
        break;
      case 'table':
        let table = [];

        arr.forEach((item, index2) => {
          table.push({ num: item, count: arr2[index2] });
        })

        setOperData({
          ...operData,
          [i]: {
            ...operData[i],
            oper: 'table',
            showTable: true,
            result: table
          }
        });
        break;
      case 'median':
        // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
        var median = 0, numsLen = arr2.reduce((a, b) => a + b);

        var array_final_number = []
        arr.forEach((item, index) => {
          for (let x = 0; x < arr2[index]; x++) {
            array_final_number.push(item)
          }
        })
        array_final_number.sort();

        if (
          numsLen % 2 === 0 // is even
        ) {
          // average of two middle numbers
          median = (array_final_number[numsLen / 2 - 1] + array_final_number[numsLen / 2]) / 2;
        } else { // is odd
          // middle number only
          median = array_final_number[(numsLen - 1) / 2];
        }

        return median;
      case 'mode':
        var modes = [], count = [], y, number, maxIndex = 0;

        var numbers = []
        arr.forEach((item, index) => {
          for (let x = 0; x < arr2[index]; x++) {
            numbers.push(item)
          }
        })


        for (y = 0; y < numbers.length; y += 1) {
          number = numbers[y];
          count[number] = (count[number] || 0) + 1;
          if (count[number] > maxIndex) {
            maxIndex = count[number];
          }
        }

        for (y in count)
          if (count.hasOwnProperty(y)) {
            if (count[y] === maxIndex) {
              modes.push(Number(y));
            }
          }

        return modes.join(', ');
      case 'range':
        arr.sort();
        let final_s = arr[0] + ' al ' + arr[arr.length - 1]
        return final_s;

      default:
        break;
    }
  }

  const operFunc2 = (string, arr, arr2, i, input) => {
    //["min", "max", "aver", "sum", "less", "less_eq", "eq", "greater", "greater_eq"]
    switch (string) {
      case 'less':
        let lessers = [];

        arr.forEach((item, index2) => {
          if (item < input) {
            lessers.push({ num: item, count: arr2[index2] });
          }
        })

        return lessers; //{ showTable: true, result: lessers }
      case 'less_eq':
        let lessersEq = [];

        arr.forEach((item, index2) => {
          if (item <= input) {
            lessersEq.push({ num: item, count: arr2[index2] });
          }
        })
        return lessersEq;
      case 'eq':
        let equal = [];

        arr.forEach((item, index2) => {
          if (item === parseInt(input)) {
            equal.push({ num: item, count: arr2[index2] });
          }
        })
        return equal;
      case 'greater':
        let greater = [];

        arr.forEach((item, index2) => {
          if (item > input) {
            greater.push({ num: item, count: arr2[index2] });
          }
        })

        return greater;
      case 'greater_eq':
        let greaterEq = [];

        arr.forEach((item, index2) => {
          if (item >= input) {
            greaterEq.push({ num: item, count: arr2[index2] });
          }
        })
        return greaterEq;
      case 'table':
        let table = [];

        arr.forEach((item, index2) => {
          table.push({ num: item, count: arr2[index2] });
        })
        return table;
      default:
        break;
    }
  }

  const setValueFunc = (event, index) => {
    switch (event.target.name) {
      case 'valueLess':
        setOperData({
          ...operData,
          [index]: {
            ...operData[index],
            input: event.target.value
          }
        });
        break;
      default:
        break;
    }
  }

  const saveStudies = async () => {
    setProgress(true);
    let result = [];
    Object.keys(chartType).forEach((index) => {
      if (chartType[index] === "custom") {
        let obj = {
          operType: operData[index].oper
        }
        if (!["sum", "aver", "max", "min", "median", "mode", "range"].includes(operData[index].oper)) {
          obj.input = operData[index].input
        }
        result.push(obj);
      } else {
        let chartObj = {
          type: chartType[index],
          options: optionsChart[index],
          fill: charts[index].chart.datasets[0].fill
        }
        result.push(chartObj)
      }
    })

    if (data.ins_type === 'Censo') {
      await Api.get('/study/getStudy?_id=' + data._id + '&type=censo')
        .then(async (response) => {
          if (!response.data.study) {
            const dataStudy = {
              ins_type: data.ins_type,
              id: data._id,
              data: result,
              createdBy: todos.userInfo._id,
            }
            await Api.post('/study/add', dataStudy)
              .then(async (res) => {

                await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
                  .then((res) => {
                    setdataTable(res.data.studies)
                    setProgress(false);
                    setOpenSnack(true)
                    setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
                    setValue(0)
                  })
                  .catch((error) => {
                    console.error('Error:', error.message)
                  })
              })
              .catch((error) => {
                setSnackMessage({
                  color: 'error',
                  message: error.response.data.message,
                })
                setProgress(false);
                setOpenSnack(true)
              })
          } else {
            const dataStudy = {
              _id: response.data.study._id,
              data: result,
            }
            await Api.post('/study/edit', dataStudy)
              .then(async (res) => {

                await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
                  .then((res) => {
                    setdataTable(res.data.studies)
                    setProgress(false);
                    setOpenSnack(true)
                    setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
                    setValue(0)
                  })
                  .catch((error) => {
                    console.error('Error:', error.message)
                  })
              })
              .catch((error) => {
                setSnackMessage({
                  color: 'error',
                  message: error.response.data.message,
                })
                setProgress(false);
                setOpenSnack(true)
              })
          }
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    } else { //Encuesta
      await Api.get('/study/getStudy?_id=' + data._id + '&type=encuesta')
        .then(async (response) => {
          if (!response.data.study) {
            const dataStudy = {
              ins_type: data.ins_type,
              id: data._id,
              data: result,
              createdBy: todos.userInfo._id,
            }
            await Api.post('/study/add', dataStudy)
              .then(async (res) => {

                await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
                  .then((res) => {
                    setdataTable(res.data.studies)
                    setProgress(false);
                    setOpenSnack(true)
                    setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
                    setValue(0)
                  })
                  .catch((error) => {
                    console.error('Error:', error.message)
                  })
              })
              .catch((error) => {
                setSnackMessage({
                  color: 'error',
                  message: error.response.data.message,
                })
                setProgress(false);
                setOpenSnack(true)
              })
          } else {
            const dataStudy = {
              _id: response.data.study._id,
              data: result,
            }
            await Api.post('/study/edit', dataStudy)
              .then(async (res) => {

                await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
                  .then((res) => {
                    setdataTable(res.data.studies)
                    setProgress(false);
                    setOpenSnack(true)
                    setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
                    setValue(0)
                  })
                  .catch((error) => {
                    console.error('Error:', error.message)
                  })
              })
              .catch((error) => {
                setSnackMessage({
                  color: 'error',
                  message: error.response.data.message,
                })
                setProgress(false);
                setOpenSnack(true)
              })
          }
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    }
  }

  const handleClick = async (index) => {
    setProgress(true)
    if (index === 0) {
      if (data.ins_type === 'Censo') {
        await Api.get('/census/getExcelReport?_id=' + data._id)
          .then((res) => {
            var wb = utils.book_new(),
              ws = utils.json_to_sheet(res.data.results.results), wsc = utils.json_to_sheet(res.data.results.cont)

            utils.book_append_sheet(wb, ws, "Todas las respuestas");
            utils.book_append_sheet(wb, wsc, "Conteo de respuestas");
            if (res.data.results.statistic) {
              var ws2 = utils.json_to_sheet(res.data.results.statistic)
              utils.book_append_sheet(wb, ws2, "Datos estadísticos");
            }
            writeFile(wb, "Estudio_" + data.ins_type + "_" + data.title + "_" + moment().format("DD MM YYYY HH:mm:ss") + ".xlsx")

            setOpenSnack(true);
            setSnackMessage({
              ...snackMessage,
              color: "success",
              message: res.data.message,
            });
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      } else {
        await Api.get('/survey/getExcelReport?_id=' + data._id)
          .then((res) => {
            var wb = utils.book_new(),
              ws = utils.json_to_sheet(res.data.results.results), wsc = utils.json_to_sheet(res.data.results.cont)

            utils.book_append_sheet(wb, ws, "Todas las respuestas");
            utils.book_append_sheet(wb, wsc, "Conteo de respuestas");
            if (res.data.results.statistic) {
              var ws2 = utils.json_to_sheet(res.data.results.statistic)
              utils.book_append_sheet(wb, ws2, "Datos estadísticos");
            }
            writeFile(wb, "Estudio_" + data.ins_type + "_" + data.title + "_" + moment().format("DD MM YYYY HH:mm:ss") + ".xlsx")

            setOpenSnack(true);
            setSnackMessage({
              ...snackMessage,
              color: "success",
              message: res.data.message,
            });
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      }

    } else if (index === 1) {
      window.scrollTo(0, 0)
      setTimeout(() => {
        setTimeout(() => {
          setProgress(true);


        }, 100);
        let input = window.document.getElementsByClassName("div2PDF")[0];

        html2canvas(input, {
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 190;
          const pageHeight = 290;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          const doc = new jsPDF('p', 'mm', 'A4');
          let position = 0;
          doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 25);
          heightLeft -= pageHeight;
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight + 25);
            heightLeft -= pageHeight;
          }
          doc.save("Estudio_" + data.ins_type + "_" + data.title + "_" + moment().format("DD MM YYYY HH:mm:ss") + '.pdf');
          setProgress(false);
        });
      }, 1000);
    }
    setProgress(false)
  }

  function esArrayDeNumeros(array) {
    // Verificamos si todos los elementos del array son números
    for (let i = 0; i < array.length; i++) {
      if (isNaN(parseInt(array[i]))) {
        return false;
      }
    }

    return true;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid item xs={12}>
        <Fab sx={{
          position: 'fixed', bottom: 20, right: 16, backgroundColor: '#0d47a1', color: 'white',
          ":hover": {
            boxShadow: 6,
            backgroundColor: '#1976d2'
          },
        }} variant="extended" onClick={saveStudies}>
          <SaveIcon sx={{ mr: 1 }} />
          Guardar
        </Fab>
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          icon={<FileDownload />}
          color="success"
          FabProps={{ size: "medium", style: { backgroundColor: "green" } }}
        >
          {actions.map((action, index) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleClick(index)}
            />
          ))}
        </SpeedDial>
      </Grid>
      {/* <Fab sx={{
        position: 'fixed', bottom: 80, right: 16,
        ":hover": {
          boxShadow: 6,
        },
      }} color="success" size="medium" onClick={studyExport}>
        <FileDownload />
      </Fab> */}
      <div className="div2PDF">
        <Grid container justifyContent='center' spacing={3}>
          {charts && Object.keys(charts).map((element, index) => (
            <Grid item xs={12}>
              <Grid container justifyContent='center' sx={{ p: 2, border: 1, borderColor: 'rgba(0, 0, 0, 0.12)' }}>
                <Grid item xs={12} >
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    {(index + 1) + ". "}{Object.values(charts[element].title)}
                  </Typography>
                </Grid>
                {!displayNoneClass[index] &&
                  <Grid item xs={12} justifyContent='center' sx={{ display: 'flex', height: '300px', alignItems: 'center' }}>
                    <Chart options={optionsChart[index]} type={chartType[index]} data={charts[element].chart} redraw={true} />
                  </Grid>
                }
                <Grid item xs={12} justifyContent='center' sx={{ display: 'flex', alignItems: 'center' }}>
                  {displayNoneClass[index] && operData[index].oper === 'min' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Valor mínimo
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {Math.min(...toNumberArray(charts[element].chart.labels))}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'max' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Valor máximo
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {Math.max(...toNumberArray(charts[element].chart.labels))}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'aver' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Promedio/Media
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {operFunc('aver', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'sum' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Sumatoria
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {operFunc('sum', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }{displayNoneClass[index] && operData[index].oper === 'less' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Menor que
                            </Typography>
                            <Grid container justifyContent='center' alignItems='end' spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField name="valueLess" label="Ingrese un número para comparar" variant="standard" type="number"
                                  inputProps={{ step: 0.1 }} fullWidth value={operData[index].input}
                                  onChange={(event) => setValueFunc(event, index)} />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Button variant="contained" color="info"
                                  onClick={() => operFunc('less', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}>
                                  Comparar
                                </Button>
                              </Grid>
                              {operData[index].result.length !== 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  Resultados:
                                </Typography>
                                <ResultNumberTable data={operData[index].result} />
                              </Grid>}
                              {operData[index].showTable && operData[index].result.length === 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  No hay coincidencias
                                </Typography>
                              </Grid>}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'less_eq' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Menor o igual que
                            </Typography>
                            <Grid container justifyContent='center' alignItems='end' spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField name="valueLess" label="Ingrese un número para comparar" variant="standard" type="number"
                                  inputProps={{ step: 0.1 }} fullWidth value={operData[index].input}
                                  onChange={(event) => setValueFunc(event, index)} />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Button variant="contained" color="info"
                                  onClick={() => operFunc('less_eq', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}>
                                  Comparar
                                </Button>
                              </Grid>
                              {operData[index].result.length !== 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  Resultados:
                                </Typography>
                                <ResultNumberTable data={operData[index].result} />
                              </Grid>}
                              {operData[index].showTable && operData[index].result.length === 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  No hay coincidencias
                                </Typography>
                              </Grid>}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>}
                  {displayNoneClass[index] && operData[index].oper === 'eq' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Igual que
                            </Typography>
                            <Grid container justifyContent='center' alignItems='end' spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField name="valueLess" label="Ingrese un número para comparar" variant="standard" type="number"
                                  inputProps={{ step: 0.1 }} fullWidth value={operData[index].input}
                                  onChange={(event) => setValueFunc(event, index)} />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Button variant="contained" color="info"
                                  onClick={() => operFunc('eq', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}>
                                  Comparar
                                </Button>
                              </Grid>
                              {operData[index].result.length !== 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  Resultados:
                                </Typography>
                                <ResultNumberTable data={operData[index].result} />
                              </Grid>}
                              {operData[index].showTable && operData[index].result.length === 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  No hay coincidencias
                                </Typography>
                              </Grid>}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>}
                  {displayNoneClass[index] && operData[index].oper === 'greater' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Mayor que
                            </Typography>
                            <Grid container justifyContent='center' alignItems='end' spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField name="valueLess" label="Ingrese un número para comparar" variant="standard" type="number"
                                  inputProps={{ step: 0.1 }} fullWidth value={operData[index].input}
                                  onChange={(event) => setValueFunc(event, index)} />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Button variant="contained" color="info"
                                  onClick={() => operFunc('greater', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}>
                                  Comparar
                                </Button>
                              </Grid>
                              {operData[index].result.length !== 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  Resultados:
                                </Typography>
                                <ResultNumberTable data={operData[index].result} />
                              </Grid>}
                              {operData[index].showTable && operData[index].result.length === 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  No hay coincidencias
                                </Typography>
                              </Grid>}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>}
                  {displayNoneClass[index] && operData[index].oper === 'greater_eq' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Mayor o igual que
                            </Typography>
                            <Grid container justifyContent='center' alignItems='end' spacing={2}>
                              <Grid item xs={12} md={6}>
                                <TextField name="valueLess" label="Ingrese un número para comparar" variant="standard" type="number"
                                  inputProps={{ step: 0.1 }} fullWidth value={operData[index].input}
                                  onChange={(event) => setValueFunc(event, index)} />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Button variant="contained" color="info"
                                  onClick={() => operFunc('greater_eq', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}>
                                  Comparar
                                </Button>
                              </Grid>
                              {operData[index].result.length !== 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  Resultados:
                                </Typography>
                                <ResultNumberTable data={operData[index].result} />
                              </Grid>}
                              {operData[index].showTable && operData[index].result.length === 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  No hay coincidencias
                                </Typography>
                              </Grid>}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'table' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} sm={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Grid container justifyContent='center' alignItems='end' spacing={2}>
                              {operData[index].result.length !== 0 && <Grid item xs={12}>
                                <ResultTable data={operData[index].result} />
                              </Grid>}
                              {operData[index].showTable && operData[index].result.length === 0 && <Grid item xs={12}>
                                <Typography variant="h6" color="text.secondary" align="center" sx={{ mt: 2 }}>
                                  No hay coincidencias
                                </Typography>
                              </Grid>}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'median' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} sm={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Mediana
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {operFunc('median', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'mode' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Moda
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {operFunc('mode', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                  {displayNoneClass[index] && operData[index].oper === 'range' &&
                    <Grid container justifyContent='center'>
                      <Grid item xs={12} md={10} lg={6}>
                        <Card sx={{ width: '100%' }}>
                          <CardContent>
                            <Typography variant="h5" component="div" color="text.secondary" sx={{ mb: 3 }} align="center">
                              Rango
                            </Typography>
                            <Typography variant="h5" component="div" align="center">
                              {operFunc('range', toNumberArray(charts[element].chart.labels), toNumberArray(charts[element].chart.datasets[0].data), index)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  }
                </Grid>
                <Grid item xs={12} md={10} lg={6}>
                  <FormControl fullWidth sx={{ mt: 3 }}>
                    <InputLabel htmlFor="grouped-select">Tipo de visualizador</InputLabel>
                    <Select defaultValue="" id="grouped-select" label="Tipo de visualizador"
                      MenuProps={MenuProps} onChange={(event) => handleChangeChart(event, index)} value={selectValue[index]}>
                      <MenuItemChart value="" selected disabled>
                        Seleccione una opción...
                      </MenuItemChart>
                      <SubMenuChart>Gráficos</SubMenuChart>
                      {menuChartValues.map((item, index) => <MenuItemChart key={"menu1" + index} value={index}>
                        {menuChartValuesAlias[index]}
                      </MenuItemChart>)}
                      <SubMenuChart>Tablas</SubMenuChart>
                      {menuChartValues3.map((item, index) => <MenuItemChart key={"menu3" + index} value={menuChartValues3Alias[index]}>
                        {item}
                      </MenuItemChart>)}
                      <SubMenuChart>Operaciones lógico-aritméticas</SubMenuChart>
                      {menuChartValues2.map((item, index) => <MenuItemChart disabled={!esArrayDeNumeros(charts[element].chart.labels)} key={"menu2" + index} value={menuChartValues2Alias[index]}>
                        {item}
                        <BootstrapTooltip title={menuChartValues2Tooltip[index]} transitioncomponent={Zoom} placement="right">
                          <InfoIcon sx={{ fontSize: "1rem", ml: 1, }} color="primary" />
                        </BootstrapTooltip>
                      </MenuItemChart>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          ))}
          {charts && Object.keys(charts).length === 0 &&
            <Grid item xs={12}>
              <Grid container justifyContent='center' sx={{ p: 2, border: 1, borderColor: 'rgba(0, 0, 0, 0.12)' }}>
                <Grid item xs={12} >
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>
                    No hay estudios para mostrar.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          }
        </Grid>
      </div>
    </Box >
  )
}
ViewStudy.propTypes = {
  data: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  progress: PropTypes.bool,
  setdataTable: PropTypes.func,
  setValue: PropTypes.func,
}

export default ViewStudy
