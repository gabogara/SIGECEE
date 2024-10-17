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
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SaveIcon from '@mui/icons-material/Save';
import ImportModal from "./ImportPopulation";
import EventIcon from '@mui/icons-material/Event';
import ImportEditDateModal from "./EditDate";
import CustomTooltip from "../../mui/CustomTooltip";
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
  censusData,
  setVisible,
  visible,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  populations,
  setCensusData,
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
  const [copied, setCopied] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [indexHeader, setIndexHeaders] = useState([]);
  const [openEditDateModal, setOpenEditDateModal] = useState(false);

  useEffect(() => {
    (async () => {
      if (Object.keys(censusData).length !== 0) {
        setState((prevState) => ({
          ...prevState,
          name: censusData.data.title ?? "",
          description: censusData.data.description ?? "",
          type: censusData.type ?? "",
          finish_date: censusData.endDate ?? null,
          population: censusData.population ?? '',
          field_email: censusData.emailField ?? '',
          anonymous: censusData.anonymous ?? false,
        }));
        setLink(censusData.link ?? '')
        if (censusData.population) {
          setSelect(
            populations.filter(
              (element) => element._id === censusData.population
            )
          );
          setIndexHeaders(
            buscarPosicionesConCorreos(populations.filter((element) => element._id === censusData.population)[0].data)
          )
        }
      }
    })();
  }, [censusData, setState, populations]);

  const cleanModal = async () => {
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
    setVisible(false)
    setCopied(false)
  };

  const publishCensus = async (e) => {
    setProgress(true)
    if (type !== '' && errorEmptyFieldDate !== '') {
      if (type === 1) {
        if (population !== '' && field_email !== '') {
          const publishCensu = {
            _id: censusData._id,
            emailField: field_email,
            endDate: finish_date.startOf("day").format(),
            publishBy: todos.userInfo._id,
            type: type,
            population: population,
            anonymous: anonymous,
          };

          await Api.post("/census/publish", publishCensu)
            .then(async (res) => {

              setLink(res.data.census.link)
              setOpenSnack(true);
              setSnackMessage({
                ...snackMessage,
                color: "success",
                message: res.data.message,
              });
              setCensusData(res.data.census)
              await Api.get('/census/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
                setdataTable(res.data.census);
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
          _id: censusData._id,
          emailField: field_email,
          endDate: finish_date.startOf("day").format(),
          publishBy: todos.userInfo._id,
          type: type,
          population: population,
          anonymous: anonymous,
        };

        await Api.post("/census/publish", publishCensu)
          .then(async (res) => {

            setLink(res.data.census.link)
            setOpenSnack(true);
            setSnackMessage({
              ...snackMessage,
              color: "success",
              message: res.data.message,
            });
            setCensusData(res.data.census)
            await Api.get('/census/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
              setdataTable(res.data.census);
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
      if (errorEmptyFieldDate === "") {
        setState((prevState) => ({ ...prevState, errorEmptyFieldDate: "e" }));
      }
    }
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


  const closeCensus = async (e) => {
    setProgress(true)
    const closeCensus = {
      _id: censusData._id,
    };

    await Api.post("/census/close", closeCensus)
      .then(async (res) => {
        cleanModal()
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "success",
          message: res.data.message,
        });
        await Api.get('/census/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
          setdataTable(res.data.census);
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
        censusData={censusData}
        visible={openEditDateModal}
        setVisible={setOpenEditDateModal}
        setdataTable={setdataTable}
        setSnackMessage={setSnackMessage}
        setOpenSnack={setOpenSnack}
        snackMessage={snackMessage}
        setCensusData={setCensusData}
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
              {censusData.status === 0 ? 'Publicar censo' : 'Ver información de publicación'}
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
          }} variant="extended" onClick={publishCensus}>
            <SaveIcon sx={{ mr: 1 }} />
            Publicar
          </Fab>}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="standard"
                label="Título del censo"
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
                label="Descripción del censo"
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
                  Seleccione el tipo de censo
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
                  label="Seleccione el tipo de censo"
                  error={errorEmptyType === "e" ? true : false}
                  inputProps={{ readOnly: censusData.status !== 0 }}
                >
                  <MenuItem value="" selected disabled>
                    Seleccione una opción
                  </MenuItem>
                  <MenuItem key={0} value={0}>
                    Abierto
                    <CustomTooltip title="Los censos abiertos generan un enlace, el cual puede ser difundido a través de redes sociales, mensajería instantánea o cualquier medio de difusión. Este censo puede ser accedido y respondido por cualquier participante máximo, 1 vez por dirección IP." placement="right" content={(
                      <InfoIcon color="info" sx={{ fontSize: "1rem", ml: 1 }} />
                    )} />
                  </MenuItem>
                  <MenuItem key={1} value={1}>
                    Cerrado
                    <CustomTooltip title="Los censos cerrados se envían por correo a una población específica seleccionada por el usuario y solo pueden ser accedidos y respondidos por los participantes de la población." placement="right" content={(
                      <InfoIcon color="info" sx={{ fontSize: "1rem", ml: 1 }} />
                    )} />
                  </MenuItem>
                </Select>
                <FormHelperText sx={{ color: "#d32f2f" }}>
                  {errorEmptyType === "e"
                    ? "Seleccione el tipo de censo"
                    : ""}
                </FormHelperText>
              </FormControl>
            </Grid>
            {type !== '' && <Grid item xs={12} md={6} sx={{ mt: 2 }} >
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                <MobileDatePicker
                  label="Fecha fin"
                  value={finish_date}
                  minDate={censusData.status !== 0 ? finish_date : moment()}
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
                    readOnly: censusData.status !== 0
                  }}
                  readOnly={censusData.status !== 0}
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
                  inputProps={{ readOnly: censusData.status !== 0 }}
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
                  {errorEmptyFieldEmail === "e"
                    ? "Seleccione el campo de la población"
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
                  inputProps={{ readOnly: censusData.status !== 0 }}
                >
                  <MenuItem value="" selected disabled>
                    Seleccione una opción
                  </MenuItem>
                  {indexHeader.length > 0 && indexHeader.map((element, index) => (
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
                    if (censusData.status > 0) {
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
                <BootstrapTooltip title={copied ? '¡Enlace copiado al portapapeles' : 'Copiar enlace'} transitioncomponent={Zoom} placement="top">
                  <Alert severity="success" icon={<ContentCopyIcon />} variant="outlined" sx={{ cursor: 'pointer' }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={12}>El siguiente enlace puede ser compartido para que los participantes puedan responder el censo:</Grid>
                      <Grid item xs={12} sx={{ marginTop: 3 }}>{link}</Grid>
                    </Grid>
                  </Alert>
                </BootstrapTooltip>

              </CopyToClipboard>

            </Grid>}
            {censusData.status === 1 && <Grid item xs={12} sx={{ mt: 1, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <>
                <CustomTooltip title="Permite editar fecha de finalización del censo. En esta fecha, se cerrará el censo de manera automática, por lo que no se podrán recibir más respuestas luego." placement="bottom" content={(
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
                )} />
                <CustomTooltip title="IMPORTANTE: Finalizar un censo es irreversible y finalizará de inmediato, por lo que no se podrán recibir más respuestas. Al finalizar el censo, también se creará una nueva población si se obtuvieron respuestas." placement="bottom" content={(
                  <Button
                    variant="contained"
                    style={{ textTransform: "none" }}
                    color="error"
                    sx={{
                      ":hover": {
                        boxShadow: 6,
                      },
                    }}
                    onClick={closeCensus}
                    startIcon={<BlockIcon />}
                  >
                    Finalizar censo
                  </Button>
                )} />
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
  censusData: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  populations: PropTypes.array,
  setCensusData: PropTypes.func,
  setProgress: PropTypes.func,
  setPopulation: PropTypes.func,
  creator: PropTypes.object,
};
