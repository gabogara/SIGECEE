import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import 'dayjs/locale/es';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  MenuItem,
  Tooltip,
  Zoom,
  Typography,
  Alert,
  InputAdornment,
  Slide,
  Fab,
  Button,
  FormControlLabel,
  Switch
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "survey-core/defaultV2.min.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Api from "../../../services/Api";
import InfoIcon from "@mui/icons-material/Info";
import { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import moment from 'moment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Event from '@mui/icons-material/Event';
import ImportModal from "./ImportPopulation";
import ImportEditDateModal from "./EditDate";
import SaveIcon from '@mui/icons-material/Save';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import EventIcon from '@mui/icons-material/Event';
import BlockIcon from '@mui/icons-material/Block';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const initialState = {
  name: "",
  description: "",
  type: "",
  errorEmptyType: "i",
  population: "",
  errorEmptyPopulation: "i",
  field_email: "",
  errorEmptyFieldEmail: "i",
  finish_date: null,
  errorEmptyFieldDate: "i",
  anonymous: false
};

const PublishModal = ({
  surveyData,
  setVisible,
  visible,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  populations,
  setSurveyData,
  setProgress,
  setPopulation,
  creator
}) => {
  const [
    {
      name,
      description,
      type,
      errorEmptyType,
      population,
      errorEmptyPopulation,
      field_email,
      errorEmptyFieldEmail,
      finish_date,
      errorEmptyFieldDate,
      anonymous
    },
    setState,
  ] = useState(initialState);
  const todos = useSelector((state) => state.todos);
  const [headers, setSelect] = useState({});
  const [link, setLink] = useState('');
  const [openImportModal, setOpenImportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [indexHeader, setIndexHeaders] = useState([]);
  const [openEditDateModal, setOpenEditDateModal] = useState(false);

  useEffect(() => {
    (async () => {
      if (Object.keys(surveyData).length !== 0) {
        setState((prevState) => ({
          ...prevState,
          name: surveyData.data.title ?? "",
          description: surveyData.data.description ?? "",
          type: surveyData.type ?? "",
          finish_date: surveyData.endDate ?? null,
          population: surveyData.population ?? '',
          field_email: surveyData.emailField ?? '',
          anonymous: surveyData.anonymous ?? false,
        }));
        setLink(surveyData.link ?? '')
        if (surveyData.population) {
          setSelect(
            populations.filter(
              (element) => element._id === surveyData.population
            )
          );
          setIndexHeaders(
            buscarPosicionesConCorreos(populations.filter((element) => element._id === surveyData.population)[0].data)
          )
        }
      }
    })();
  }, [surveyData, setState, populations]);

  const cleanModal = async () => {
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
    setVisible(false)
    setCopied(false)
  };

  const publishSurvey = async (e) => {
    setProgress(true)
    if (type !== '' && finish_date !== null && finish_date !== '') {
      if (type === 1) {
        if (population !== '' && field_email !== '') {
          const publishCensu = {
            _id: surveyData._id,
            emailField: field_email,
            endDate: finish_date,
            publishBy: todos.userInfo._id,
            type: type,
            population: population,
            anonymous: anonymous,
          };

          await Api.post("/survey/publish", publishCensu)
            .then(async (res) => {
              setLink(res.data.survey.link)
              setOpenSnack(true);
              setSnackMessage({
                ...snackMessage,
                color: "success",
                message: res.data.message,
              });
              setSurveyData(res.data.survey)
              await Api.get('/survey/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
                setdataTable(res.data.survey);
              });
            })
            .catch((error) => {
              setSnackMessage({
                color: "error",
                message: error.response.data.message,
              });
              setOpenSnack(true);
            });
        } else {
          if (population === "") {
            setState((prevState) => ({ ...prevState, errorEmptyPopulation: "e" }));
          }
          if (field_email === "") {
            setState((prevState) => ({ ...prevState, errorEmptyFieldEmail: "e" }));
          }
        }

      } else {
        const publishCensu = {
          _id: surveyData._id,
          emailField: field_email,
          endDate: finish_date,
          publishBy: todos.userInfo._id,
          type: type,
          population: population,
          anonymous: anonymous,
        };

        await Api.post("/survey/publish", publishCensu)
          .then(async (res) => {
            setLink(res.data.survey.link)
            setOpenSnack(true);
            setSnackMessage({
              ...snackMessage,
              color: "success",
              message: res.data.message,
            });
            setSurveyData(res.data.survey)
            await Api.get('/survey/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
              setdataTable(res.data.survey);
            });
          })
          .catch((error) => {
            setSnackMessage({
              color: "error",
              message: error.response.data.message,
            });
            setOpenSnack(true);
          });
      }

    } else {
      if (type === "") {
        setState((prevState) => ({ ...prevState, errorEmptyType: "e" }));
      }
      if (finish_date === null || finish_date === '') {
        setState((prevState) => ({ ...prevState, errorEmptyFieldDate: "e" }));
      }
    }
    setProgress(false)
  };

  const closeSurvey = async (e) => {
    setProgress(true)
    const publishCensu = {
      _id: surveyData._id,
    };

    await Api.post("/survey/close", publishCensu)
      .then(async (res) => {
        cleanModal()
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "success",
          message: res.data.message,
        });
        await Api.get('/survey/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
          setdataTable(res.data.survey);
        });
      })
      .catch((error) => {
        setSnackMessage({
          color: "error",
          message: error.response.data.message,
        });
        setOpenSnack(true);
      });
    setProgress(false)
  };

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 5000)
  }

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

  return (
    <>
      <ImportModal
        visible={openImportModal}
        setVisible={setOpenImportModal}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSnackMessage={setSnackMessage}
        setProgress={setProgress}
        setPopulation={setPopulation}
        setVisiblePublish={setVisible}
      />

      <ImportEditDateModal
        surveyData={surveyData}
        visible={openEditDateModal}
        setVisible={setOpenEditDateModal}
        setdataTable={setdataTable}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setSurveyData={setSurveyData}
        setProgress={setProgress}
      />

      <Dialog
        fullScreen
        open={visible}
        onClose={cleanModal}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#0d47a1' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              {surveyData.status === 0 ? 'Publicar encuesta' : 'Ver información de publicación'}
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
        <Box sx={{ p: 5 }}>
          {link === '' && <Fab sx={{
            position: 'fixed', bottom: 20, right: 16, backgroundColor: '#0d47a1', color: 'white',
            ":hover": {
              boxShadow: 6,
              backgroundColor: '#1976d2'
            },
          }} variant="extended" onClick={publishSurvey}>
            <SaveIcon sx={{ mr: 1 }} />
            Publicar
          </Fab>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                label="Título de la encuesta"
                type="text"
                value={name}
                autoComplete="current-name"
                fullWidth
                display="flex"
                inputProps={{ readOnly: true }}
              />
            </Grid>
            {description !== '' && <Grid item xs={12}>
              <TextField
                id="standard-multiline-static"
                label="Descripción de la encuesta"
                multiline
                rows={2}
                fullWidth
                variant="standard"
                value={description}
                inputProps={{ readOnly: true }}
              />
            </Grid>}
            {/*<Grid item xs={12}>
                <Typography variant="h6">Datos de publicación</Typography>
              </Grid>*/}
            <Grid item xs={12} md={6} sx={{ mt: 2 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione el tipo de encuesta
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  value={type}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      type: e.target.value,
                      errorEmptyType: "v",
                      population: '',
                      field_email: ''
                    }));
                  }}
                  label="Seleccione el tipo de encuesta"
                  error={errorEmptyType === "e" ? true : false}
                  inputProps={{ readOnly: surveyData.status !== 0 }}
                >
                  <MenuItem value="" selected disabled>
                    Seleccione una opción
                  </MenuItem>
                  <MenuItem key={0} value={0}>
                    Abierta
                    <BootstrapTooltip title="Las encuestas abiertas generan un enlace, el cual puede ser difundido a través de redes sociales, mensajería instantánea o cualquier medio de difusión. Esta encuesta puede ser accedida y respondida por cualquier participante, máximo 1 vez por dirección IP." transitioncomponent={Zoom} placement="right">
                      <InfoIcon sx={{ fontSize: "1rem", ml: 1 }} />
                    </BootstrapTooltip>
                  </MenuItem>
                  <MenuItem key={1} value={1}>
                    Cerrada
                    <BootstrapTooltip title="Las encuestas cerradas se envían por correo a una población específica seleccionada por el usuario y solo pueden ser accedidos y respondidos por los participantes de la población." transitioncomponent={Zoom} placement="right">
                      <InfoIcon sx={{ fontSize: "1rem", ml: 1 }} />
                    </BootstrapTooltip>
                  </MenuItem>
                </Select>
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errorEmptyType === "e"
                    ? "Seleccione el tipo de encuesta"
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            {type !== '' && <Grid item xs={12} md={6} sx={{ mt: 2 }} >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                <MobileDatePicker
                  label="Fecha de finalización y cierre de encuesta"
                  value={finish_date}
                  minDate={surveyData.status !== 0 ? finish_date : moment()}
                  onChange={(newValue) => {
                    setState((prevState) => ({
                      ...prevState,
                      finish_date: newValue,
                    }));
                  }}
                  closeOnSelect={true}
                  renderInput={({ InputProps, ...params }) => (
                    <TextField
                      {...params}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Event />
                          </InputAdornment>
                        )
                      }}
                      fullWidth
                    />
                  )}
                  inputFormat="DD/MM/YYYY"
                  error={errorEmptyFieldDate === "e" ? true : false}
                  inputProps={{
                    readOnly: surveyData.status !== 0
                  }}
                  readOnly={surveyData.status !== 0}
                />
              </LocalizationProvider>
            </Grid>}
            {type === 1 && <Grid item xs={12} md={6} sx={{ mt: 0.5 }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="demo-simple-select-standard-label">
                  Seleccione la población
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  value={population}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      population: e.target.value,
                    }));
                    e.target.value !== ""
                      ? setState((prevState) => ({
                        ...prevState,
                        errorEmptyPopulation: "v",
                      }))
                      : setState((prevState) => ({
                        ...prevState,
                        errorEmptyPopulation: "i",
                      }));

                    if (e.target.value !== "") {
                      setSelect(
                        populations.filter(
                          (element) => element._id === e.target.value
                        )
                      );
                      setIndexHeaders(
                        buscarPosicionesConCorreos(populations.filter((element) => element._id === e.target.value)[0].data)
                      )
                      setState((prevState) => ({
                        ...prevState,
                        field_email: "",
                      }));
                    }

                  }}
                  label="Seleccione la población"
                  error={errorEmptyPopulation === "e" ? true : false}
                  inputProps={{ readOnly: surveyData.status !== 0 }}
                >
                  <MenuItem value="" selected disabled>
                    Seleccione una opción
                  </MenuItem>
                  <MenuItem value="" onClick={() => {
                    setState(initialState);
                    cleanModal()
                    setSelect({})
                    setIndexHeaders([])
                    setOpenImportModal(true)
                  }}>
                    Importar una nueva población...
                  </MenuItem>
                  {populations && populations.map((element, index) => (
                    <MenuItem key={index} value={element._id}>
                      {element.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errorEmptyPopulation === "e"
                    ? "Seleccione la población"
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>}
            {type === 1 && <Grid item xs={12} md={6} sx={{ mt: 0.5 }}>
              <FormControl
                variant="outlined"
                fullWidth
                disabled={population === ""}
              >
                <InputLabel id="demo-simple-select-standard-label">
                  Campo correspondiente al correo
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  value={field_email}
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      field_email: e.target.value,
                    }));
                    e.target.value !== ""
                      ? setState((prevState) => ({
                        ...prevState,
                        errorEmptyFieldEmail: "v",
                      }))
                      : setState((prevState) => ({
                        ...prevState,
                        errorEmptyFieldEmail: "i",
                      }));
                  }}
                  label="Campo correspondiente al correo"
                  error={errorEmptyFieldEmail === "e" ? true : false}
                  inputProps={{ readOnly: surveyData.status !== 0 }}
                >
                  <MenuItem value="" selected disabled>
                    Seleccione una opción
                  </MenuItem>
                  {headers && indexHeader.length > 0 && indexHeader.map((element, index) => (
                    <MenuItem key={index} value={element}>
                      {headers[0].header[element]}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errorEmptyFieldEmail === "e"
                    ? "Seleccione el campo del correo"
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>}

            {type === 1 && <Grid item xs={12} md={6}>
              <BootstrapTooltip title="Al habilitar este campo, las respuestas de los participantes serán anónimas, es decir, no se asociará el correo con la respuesta." transitioncomponent={Zoom} placement="bottom">
                <FormControlLabel
                  control={<Switch checked={anonymous} />}
                  label="Respuestas anónimas"
                  value={anonymous}
                  onClick={() => {
                    if (surveyData.status > 0) {
                      return false
                    } else {
                      setState((prevState) => ({
                        ...prevState,
                        anonymous: !anonymous,
                      }));
                    }

                  }}
                />
              </BootstrapTooltip>
            </Grid>}
            {link && <Grid item xs={12} sx={{ mt: 0.5 }}>
              <CopyToClipboard text={link} onCopy={() => handleCopy()}>
                <BootstrapTooltip title={copied ? '¡Enlace copiado al portapapeles!' : 'Copiar enlace'} transitioncomponent={Zoom} placement="top">
                  <Alert severity="success" icon={<ContentCopyIcon />} variant="outlined" sx={{ cursor: 'pointer' }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={12}>El siguiente enlace puede ser compartido para que los participantes puedan responder la encuesta:</Grid>
                      <Grid item xs={12} sx={{ marginTop: 3 }}>{link}</Grid>
                    </Grid>
                  </Alert>
                </BootstrapTooltip>

              </CopyToClipboard>
            </Grid>}
            {surveyData.status === 1 && <Grid item xs={12} sx={{ mt: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <>
                <BootstrapTooltip title={<Typography variant="caption">
                  Permite editar fecha de finalización de la encuesta. En esta fecha, se cerrará la encuesta de manera automática, por lo que no se podrán recibir más respuestas luego.
                </Typography>} transitioncomponent={Zoom} placement="bottom">
                  <Button
                    variant="contained"
                    style={{ textTransform: "none" }}
                    sx={{
                      backgroundColor: '#1976d2',
                      mr: 2,
                      ":hover": {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => setOpenEditDateModal(true)}
                    startIcon={<EventIcon />}
                  >
                    Editar fecha de finalización
                  </Button>
                </BootstrapTooltip>
                <BootstrapTooltip title={<Typography variant="caption">
                  IMPORTANTE: Finalizar una encuesta es irreversible y culminará de inmediato, por lo que no se podrán recibir más respuestas.
                </Typography>} transitioncomponent={Zoom} placement="bottom">
                  <Button
                    variant="contained"
                    style={{ textTransform: "none" }}
                    color="error"
                    sx={{
                      ":hover": {
                        boxShadow: 6,
                      },
                    }}
                    onClick={closeSurvey}
                    startIcon={<BlockIcon />}
                  >
                    Finalizar encuesta
                  </Button>
                </BootstrapTooltip>
              </>
            </Grid>}




          </Grid>
        </Box>
      </Dialog>
    </>
  );
};
export default PublishModal;

PublishModal.propTypes = {
  surveyData: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  populations: PropTypes.array,
  setSurveyData: PropTypes.func,
  setProgress: PropTypes.func,
  setPopulation: PropTypes.func,
  creator: PropTypes.object,
};
