import React, { useEffect, useState, useCallback } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import Api from "../../../services/Api";
import {
  Box,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Alert,
} from '@mui/material'
import background from '../../../assets/images/mural.jpg'
import SurveyDone from './surveyDone'
import SimpleBackdrop from '../../mui/ProgressMUI';
import { surveyLocalization } from "survey-core";
import '../../../customTraslation.ts'

var params = new URL(document.location).searchParams;
var survey_id = params.get("id");
/*var email_user = params.get("token");*/
var k1 = params.get("k1");
/*var k2 = params.get("k2");*/

/* i: initial, e: error, v: valid*/
const initialState = {
  email: "",
  errorEmptyEmail: "i",
  errorEmail: "i",
};

const UserSurvey = () => {
  const [render, setRender] = useState(null);
  const [validation, setValidation] = useState(false);
  const [alertClass, setAlertClass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [ip, setIP] = useState('');
  const [participation, setParticipation] = useState(false);
  const [
    {
      email,
      errorEmptyEmail,
      errorEmail,
    },
    setState,
  ] = useState(initialState);

  useEffect(() => {
    (async () => {
      const res_ip = await Api.get('https://geolocation-db.com/json/')
      setIP(res_ip.data.IPv4)
      const data = {
        _id: survey_id,
        iv: k1,
        ip: res_ip.data.IPv4,
      }
      await Api.post("/survey/prevalidate", data)
        .then(async (res) => {
          setValidation(true)
          //console.log(alertResults)
          setRender(res.data.survey);
        })
        .catch((error) => {
          if (error.response.data.participation) {
            setParticipation(true)
          } /*else {
            setAlertClass(true)
            setErrorMessage(error.response.data.message)
          }*/
        });

      setLoading(false)
    })();
  }, []);

  const onChangeEmail = (em) => {
    setState((prevState) => ({ ...prevState, email: em }));
    if (/.+@.+..+/.test(em)) {
      setState((prevState) => ({ ...prevState, errorEmail: "v" }));
      setState((prevState) => ({ ...prevState, errorEmptyEmail: "v" }));
    } else {
      setState((prevState) => ({ ...prevState, errorEmail: "i" }));
      setState((prevState) => ({ ...prevState, errorEmptyEmail: "i" }));
    }
  };

  const validationEmail = async () => {
    const data = {
      _id: survey_id,
      iv: k1,
      email: email,
      ip: ip,
    }
    await Api.post("/survey/validate", data)
      .then((res) => {
        setValidation(true)
        setRender(res.data.survey);
      })
      .catch((error) => {
        if (error.response.data.participation) {
          setParticipation(true)
        } else {
          setAlertClass(true)
          setErrorMessage(error.response.data.message)
        }
      });
  };

  const alertResults = useCallback(async (sender) => {
    const results = sender.data
    const data = {
      _id: survey_id,
      iv: k1,
      data: results,
      ip: ip,
      email: email ?? undefined
    }
    await Api.post("/survey/results", data)
      .then((res) => {
        console.log("Guardado")
      })
      .catch((error) => {
        console.log(error.response.data.message)
      });
    //alert(results);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, email]);


  let survey = null;
  if (validation) {
    surveyLocalization.defaultLocale = "es"
    survey = new Model(render);
    survey.locale = 'custom';
    survey.onComplete.add(alertResults);
  }

  if (isLoading) {
    return <SimpleBackdrop open={true} />
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      validationEmail()
    }
  }

  return (
    <>
      {participation && <SurveyDone />}
      {!participation && <Box sx={{ width: "100%" }}>
        {!validation && <Grid container
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            /*alignContent: 'center',*/
            height: '100vh',
            p: 2,
          }}>
          <Grid item md={8} lg={5}>
            <Card sx={{ py: 6, px: 5 }}>
              <CardContent>
                <Typography variant="h4" component="div" gutterBottom sx={{ pb: 1 }}>
                  Encuesta
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                  className="text-medium-emphasis"
                  sx={{ pb: 1 }}
                >
                  Ingresa tu correo para responder la encuesta.
                </Typography>
                <TextField
                  variant="standard"
                  size="small"
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  autoComplete="current-email-add"
                  fullWidth
                  sx={{ mb: 1 }}
                  display="flex"
                  onChange={(e) => {
                    setAlertClass(false)
                    onChangeEmail(e.target.value);
                  }}
                  error={
                    errorEmptyEmail === "e" || errorEmail === "e" ? true : false
                  }
                  color={errorEmail === "v" ? "success" : ""}
                  onKeyPress={handleKeyPress}
                  helperText={
                    errorEmptyEmail === "e"
                      ? "El correo electrónico es obligatorio"
                      : errorEmail === "e"
                        ? "Formato de correo electrónico inválido"
                        : ""
                  }
                />
                <Alert
                  severity="error"
                  sx={{
                    visibility: alertClass ? 'visible' : 'hidden',
                  }}
                >
                  <small>{errorMessage}</small>
                </Alert>
              </CardContent>
              <CardActions>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ width: '100%' }}
                  style={{ textTransform: 'none' }}
                  color="primary"
                  onClick={validationEmail}
                >
                  Validar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>}
        {validation && <Grid container
          alignItems="center"
          justifyContent="center"
          sx={{
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            /*alignContent: 'center',*/
            minHeight: '100vh',
            p: 2,
          }}>
          <Grid item xs={12} md={10} >
            <Survey model={survey} />
          </Grid>
        </Grid>}
      </Box>}
    </>
  );
};
export default UserSurvey;
