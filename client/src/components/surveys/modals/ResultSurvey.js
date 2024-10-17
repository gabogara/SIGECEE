import React, { useState } from 'react'
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import PropTypes from 'prop-types'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Pagination,
  Fade,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Slide,
  Chip,
  Divider,
} from '@mui/material'
import 'survey-core/defaultV2.min.css'
import 'survey-creator-core/survey-creator-core.min.css'
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import { SurveyPDF } from "survey-pdf";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const ResultModal = ({
  visible,
  setVisible,
  surveyData,
  results,
  creator
}) => {
  //const todos = useSelector((state) => state.todos)
  //const [results, setResult] = useState([])
  const [inFade, setInFade] = useState({ hidden: true })
  const [selectedEmail, setSelectedEmail] = useState(0)



  const [page, setPage] = React.useState(1);

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
    setPage(1)
  };

  const handleChangePag = (event, value) => {
    setInFade({ hidden: false });
    setTimeout(() => {
      setInFade({ hidden: true })
      setPage(value)
      setSelectedEmail(value - 1)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, 500)
  };

  const handleChangePag2 = (value) => {
    setInFade({ hidden: false });
    setTimeout(() => {
      setInFade({ hidden: true })
      setPage(value + 1)
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }, 500)
  };

  const exportToPdfOptions = {
    fontSize: 12,
    haveCommercialLicense: true,
  };

  const savePdf = function (surveyData, surveyJson) {
    const surveyPdf = new SurveyPDF(surveyJson, exportToPdfOptions);
    surveyPdf.data = surveyData;
    surveyPdf.save();
  };

  let survey = new Model(surveyData.data);
  survey.onComplete.add(function (sender) {
    document.querySelector('#surveyResult').textContent = "Result JSON:\n" + JSON.stringify(sender.data, null, 3);
  });
  survey.locale = 'es';
  survey.showTitle = true
  console.log(results)
  console.log(results.length)
  if (results && results.length !== 0) {
    //console.log(results[page - 1])
    survey.data = results[page - 1].result
    survey.addNavigationItem({
      id: "pdf-export",
      title: "Guardar en PDF",
      action: () => savePdf(survey.data, survey.toJSON())
    });
  }
  survey.mode = 'display';

  return (
    <>
      {Object.keys(results).length !== 0 &&

        <Dialog
          fullScreen
          open={visible}
          onClose={cleanModal}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: 'relative', backgroundColor: '#0d47a1' }}>
            <Toolbar>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Ver respuestas
              </Typography>
              <IconButton
                edge="end"
                color="inherit"
                onClick={cleanModal}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box sx={{ width: '100%' }}>
            <Grid container >
              <Grid
                item
                xs={12}
                sx={{
                  zIndex: 100,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
              </Grid>
              <Grid item xs={12} sx={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Card>
                  <CardContent>
                    <Box sx={{ width: "100%" }}>
                      <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                      >
                        {surveyData.type === 1 && surveyData.anonymous === false && <Grid item xs={12} md={12} sx={{ textAlign: 'center', justifyContent: 'center', display: 'block', mb: 3 }}>
                          {surveyData.maillist.length !== results.map((item1) => item1.email).length && <Typography variant="h6">No se obtuvieron respuestas de los siguientes encuestados: </Typography>
                          }
                          {surveyData.maillist.length !== results.map((item1) => item1.email).length && surveyData.maillist.map((item) => (

                            (!results.map((item1) => item1.email).includes(item)) &&
                            <Chip label={item} color="error" variant="outlined" sx={{ ml: 1, mt: 1 }} />

                          ))}
                          {surveyData.maillist.length === results.map((item1) => item1.email).length && <Chip
                            label='Todos los encuestados respondieron la encuesta'
                            icon={<DoneIcon />}
                            color="success"
                            variant="outlined"
                          />}
                          <Divider sx={{ mt: 2 }} />
                        </Grid>}
                        <Grid item xs={12} md={12} sx={{ textAlign: 'center' }}>
                          <Typography variant="h6">Respuesta {page} de {results.length}</Typography>
                        </Grid>
                        {surveyData.type === 1 && surveyData.anonymous === false &&
                          <>
                            <Grid item xs={12} md={12} sx={{ textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                              <FormControl variant="standard" fullWidth sx={{
                                m: 0, p: 0, width: {
                                  xs: "100%",
                                  sm: '50%'
                                }
                              }}>
                                <InputLabel id="label-school" sx={{ textAlign: 'center' }}>Respuesta de:</InputLabel>
                                <Select
                                  labelId="label-school"
                                  value={selectedEmail}
                                  size="small"
                                  onChange={(e) => {
                                    setSelectedEmail(e.target.value)
                                    handleChangePag2(e.target.value)
                                  }}
                                  label="Respuesta de:"
                                >
                                  {results.map(({ email }, index) => (
                                    <MenuItem key={index} value={index}>
                                      {email}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </>

                        }
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Pagination count={results.length} variant="outlined" shape="rounded" showFirstButton showLastButton page={page} onChange={handleChangePag} />
                        </Grid>
                        {<Fade in={inFade.hidden} style={{ transformOrigin: '0 0 0' }}
                          {...(inFade.hidden ? { timeout: 500 } : {})}>
                          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Survey model={survey} />
                          </Grid>
                        </Fade>}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Pagination count={results.length} variant="outlined" shape="rounded" showFirstButton showLastButton page={page} onChange={handleChangePag} />
                        </Grid>
                      </Grid>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Dialog>

      }



    </>
  )
}

export default ResultModal

ResultModal.propTypes = {
  surveyData: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  results: PropTypes.array,
  creator: PropTypes.object,
}
