import { useState, useEffect } from "react";
import "survey-analytics/survey.analytics.min.css";
import { Model } from "survey-core";
import * as SurveyAnalytics from 'survey-analytics'
import PropTypes from 'prop-types'
import { Box, Grid, Card, CardContent, Button } from '@mui/material'
import Api from '../../../services/Api';
import { useSelector } from "react-redux";

const vizPanelOptions = {
  allowHideQuestions: false
};

function CustomMinVisualizer(question, data, options) {
  var getData = function (visualizerBase) {
    var result = Number.MAX_VALUE;
    visualizerBase.data.forEach(function (row) {
      var rowValue = row[visualizerBase.dataName];
      if (!!rowValue) {
        if (rowValue < result) {
          result = rowValue;
        }
      }
    });
    return result;
  };
  var renderContent = function (contentContainer, visualizer) {
    var data2render = getData(visualizer);
    var minEl = document.createElement("div");
    var minTextEl = document.createElement("span");
    minTextEl.innerText = "Valor mínimo: ";
    var minValEl = document.createElement("span");
    minValEl.innerText = data2render;
    minEl.appendChild(minTextEl);
    minEl.appendChild(minValEl);
    contentContainer.appendChild(minEl);
  };
  return new SurveyAnalytics.VisualizerBase(question, data, {
    renderContent: renderContent,
    dataProvider: options.dataProvider
  }, "minVisualizer");
}

function CustomMaxVisualizer(question, data, options) {
  var getData = function (visualizerBase) {
    var result = Number.MIN_VALUE;
    visualizerBase.data.forEach(function (row) {
      var rowValue = row[visualizerBase.dataName];
      if (!!rowValue) {
        if (rowValue > result) {
          result = rowValue;
        }
      }
    });
    return result;
  };
  var renderContent = function (contentContainer, visualizer) {
    var data2render = getData(visualizer);
    var maxEl = document.createElement("div");
    var maxTextEl = document.createElement("span");
    maxTextEl.innerText = "Valor máximo: ";
    var maxValEl = document.createElement("span");
    maxValEl.innerText = data2render;
    maxEl.appendChild(maxTextEl);
    maxEl.appendChild(maxValEl);
    contentContainer.appendChild(maxEl);
  };
  return new SurveyAnalytics.VisualizerBase(question, data, {
    renderContent: renderContent,
    dataProvider: options.dataProvider
  }, "maxVisualizer");
}
// Register the second custom visualizer for the given question type
SurveyAnalytics.VisualizationManager.registerVisualizer("number", CustomMinVisualizer);
SurveyAnalytics.VisualizationManager.registerVisualizer("number", CustomMaxVisualizer);
// Set localized title of this visualizer
SurveyAnalytics.localization.locales["es"]["visualizer_minVisualizer"] = "Mínimo";
SurveyAnalytics.localization.locales["es"]["visualizer_maxVisualizer"] = "Máximo";

SurveyAnalytics.VisualizationManager.unregisterVisualizerForAll(SurveyAnalytics.WordCloud);

const ViewStudy = ({
  data,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  progress,
}) => {
  const [survey, setSurvey] = useState(null);
  const [vizPanel, setVizPanel] = useState(null);
  const [result, setResult] = useState([]);
  const todos = useSelector((state) => state.todos);
  const [study, setStudy] = useState(null);

  if (!survey) {
    const survey = new Model(data.data);
    setSurvey(survey);
  }

  if (!vizPanel && !!survey && result.length > 0) {
    const vizPanelConst = new SurveyAnalytics.VisualizationPanel(
      survey.getAllQuestions(),
      result,
      vizPanelOptions
    );

    setVizPanel(vizPanelConst);
    vizPanelConst.render(document.getElementById("surveyVizPanel"));
    vizPanelConst.showHeader = false;
    vizPanelConst.locale = 'es'
    vizPanelConst.onAfterRender.add(function () {
      survey.getAllQuestions().forEach(function (question) {
        if (question.getType() === "matrixdropdown" || question.getType() === "matrixdynamic") {
          var visualizer = vizPanelConst.getVisualizer(question.name);
          var child = visualizer.contentContainer.firstChild;
          visualizer.showHeader = false;
          visualizer.destroyToolbar(child)
        }
      });
    });
    /*vizPanel.onStateChanged.add(function () {
      window.localStorage.setItem("saPanelState", JSON.stringify(vizPanel.state));
    });
    vizPanel.onStateChanged.add(function () {
      console.log(vizPanel
        .state
        .elements[0]
        .displayName);
    });*/
  }

  const saveStudieVisual = async () => {
    let array = []

    survey.getAllQuestions().forEach(function (question) {
      let visualizer = vizPanel.getVisualizer(question.name);
      array.push({ question_name: question.name, question_visualizer: (visualizer.chartType ? visualizer.chartType : (visualizer.visualizer ? visualizer.visualizer.chartType : 'table')) })

    });
    const dataStudy = {
      ins_type: data.ins_type,
      id: data._id,
      data: array,
      createdBy: todos.userInfo._id,
    }

    await Api.post('/study/add', dataStudy)
      .then(async (res) => {
        setOpenSnack(true)
        setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
        if (data.ins_type === 'Censo') {
          await Api.get('/census/getResultsJson?_id=' + data._id)
            .then((res) => {
              setResult(res.data.results.results);
            })
            .catch((error) => {
              console.error('Error:', error.message);
            });
        } else {
          await Api.get('/survey/getResultsJson?_id=' + data._id)
            .then((res) => {
              setResult(res.data.results.results);
            })
            .catch((error) => {
              console.error('Error:', error.message);
            });
        }
      })
      .catch((error) => {
        setSnackMessage({
          color: 'error',
          message: error.response.data.message,
        })
        setOpenSnack(true)
      })
  }

  useEffect(() => {
    (async () => {
      setProgress(true);
      if (data.ins_type === 'Censo') {
        await Api.get('/census/getResultsJson?_id=' + data._id)
          .then((res) => {
            setResult(res.data.results.results);
            setStudy(res.data.results.study)
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      } else {
        await Api.get('/survey/getResultsJson?_id=' + data._id)
          .then((res) => {
            setResult(res.data.results.results);
            setStudy(res.data.results.study)
          })
          .catch((error) => {
            console.error('Error:', error.message);
          });
      }
      setProgress(false);
    })();
    return () => {
      setSurvey(null)
    };
  }, [data, setProgress]);

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <div id="surveyVizPanel" />
                {result.length === 0 && progress && <div>Cargando...</div>}
                {result.length === 0 && !progress && <div>No hay respuestas por ahora.</div>}
              </CardContent>
            </Card>
          </Grid>
          <Grid>
            <Button variant="contained" color="primary" onClick={saveStudieVisual}>Guardar</Button>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
ViewStudy.propTypes = {
  data: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  progress: PropTypes.bool,
}

export default ViewStudy
