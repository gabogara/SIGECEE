import { useState, useEffect } from "react";
import "survey-analytics/survey.analytics.min.css";
import {
  Box, Grid, Button, Typography, Card,
  CardContent,
  TextField,
} from '@mui/material'
import Header from "../../../Header";
import Api from '../../../../../services/Api';
import ResultNumberTable from "./ResultNumberTable";
import ResultTable from "./ResultTable";
import { Chart as ChartJS, registerables } from 'chart.js'
import Container from "@mui/material/Container";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link } from "react-router-dom";
import Footer from "../../../../layout/Footer3";
import {
  Chart,
} from 'react-chartjs-2';
ChartJS.register(...registerables)

const View = () => {
  const [chartType, setChartType] = useState({});
  const [charts, setCharts] = useState(null);
  const [optionsChart, setOptionChart] = useState({})
  const [displayNoneClass, setDisplayNoneClass] = useState({})
  const [operData, setOperData] = useState({})
  const [entryBlog, setEntryBlog] = useState({})
  var params = new URL(document.location).searchParams;
  var id_instrument = params.get("id");
  /*var email_user = params.get("token");*/
  var type_instrument = params.get("type");

  useEffect(() => {
    (async () => {
      await Api.get("/blog/entry?type=" + type_instrument + "&id=" + id_instrument).then(async (res) => {
        const final_entry = {
          id_ins: res.data.entry._id,
          title: res.data.entry.title,
          descripcion: res.data.entry.description,
          text: res.data.entry.text,
          category: res.data.entry.ins_type.toLowerCase(),
          bagde: res.data.entry.ins_type,
          url: "/entry?id=" + (res.data.entry.ins_type === 'Censo' ? res.data.entry.census : res.data.entry.survey) + "&type=" + res.data.entry.ins_type,
          date: res.data.entry.createdAt,
          coverSrc: res.data.entry.image //"https://source.unsplash.com/random",
        }
        setEntryBlog(final_entry)

      }).catch((error) => {
        console.error('Error:', error.message)
      });
      if (type_instrument === 'Censo') {
        await Api.get('/study/getStudy?_id=' + id_instrument + '&type=censo')
          .then(async (response) => {
            await Api.get('/census/getResultsChart?_id=' + id_instrument)
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
                //setStudy(res.data.results.study)
              })
              .catch((error) => {
                console.error('Error:', error.message);
              });
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      } else {
        await Api.get('/study/getStudy?_id=' + id_instrument + '&type=encuesta')
          .then(async (response) => {
            await Api.get('/survey/getResultsChart?_id=' + id_instrument)
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
                //setStudy(res.data.results.study)
              })
              .catch((error) => {
                console.error('Error:', error.message);
              });
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      }
      //setProgress(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/*setProgress*/]);

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

  return (
    <>
      <Header showItems={false} />
      <Container sx={{ p: 3 }}>
        <Card sx={{ width: '100%' }}>
          <CardContent>
            <Box sx={{ width: '100%' }}>
              <Grid container>
                <Grid item md={3}>
                  <Link to="/" style={{ display: 'flex' }} >
                    <KeyboardBackspaceIcon />
                    <Typography variant="subtitle1" sx={{ ml: 1 }}>Volver</Typography>
                  </Link>
                </Grid>
              </Grid>
              <Grid container justifyContent='center'>
                <Grid item xs={12} >
                  <Typography variant="h4" sx={{ textAlign: 'center', mt: 3 }}>
                    {entryBlog.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} dangerouslySetInnerHTML={{ __html: entryBlog.text }}>
                </Grid>
                {charts && Object.keys(charts).map((element, index) => (
                  <Grid item xs={12}>
                    <Grid container justifyContent='center' sx={{ py: 6, }}> {/*border: 1, borderColor: 'rgba(0, 0, 0, 0.12)', boxShadow: 3 */}
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                            <Grid item xs={12} sm={6} md={10} lg={6}>
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
                    </Grid>
                  </Grid>
                ))}
                {charts && Object.keys(charts).length === 0 &&
                  <Grid item xs={12}>
                    <Grid container justifyContent='center' sx={{ p: 2, border: 1, borderColor: 'rgba(0, 0, 0, 0.12)', boxShadow: 3 }}>
                      <Grid item xs={12} >
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>
                          No hay estudios para mostrar.
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              </Grid>
            </Box >
          </CardContent>
        </Card>

      </Container>
      <Footer />
    </>

  )
}

export default View
