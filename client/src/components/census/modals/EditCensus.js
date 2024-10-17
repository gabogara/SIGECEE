import React, { useEffect } from 'react'
import * as SurveyCreator from 'survey-creator-react'
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Grid,
  Fab,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide, SpeedDial, SpeedDialAction, SpeedDialIcon
} from '@mui/material'
import 'survey-core/defaultV2.min.css'
import 'survey-creator-core/survey-creator-core.min.css'
import SaveIcon from '@mui/icons-material/Save';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import QuizIcon from "@mui/icons-material/Quiz";
import Api from '../../../services/Api'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditCensusModal = ({
  visible,
  setVisible,
  censusData,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setVisibleImportBank,
  setVisibleImportStruct,
  setdataQuestion,
  setdataStruct,
  setProgress,
  creator,
}) => {

  const todos = useSelector((state) => state.todos);
  const actions = [
    { icon: <HelpCenterIcon />, name: 'Importar preguntas desde banco de preguntas', },
    { icon: <QuizIcon />, name: 'Importar preguntas desde estructuras base' },
    { icon: <ContentPasteSearchIcon />, name: 'Importar preguntas desde censos o encuestas', },
    { icon: <DeleteSweepIcon />, name: 'Limpiar censo', },
  ];

  useEffect(() => {
    if (censusData.data !== undefined) {
      creator.JSON = censusData.data
    }
  }, [creator, censusData])

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
  };

  const handleClick = async (index) => {
    setProgress(true)
    if (index === 0) {
      await Api.get('/question/all/wData?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
        .then((res) => {
          setdataQuestion(res.data.questions);
          setVisibleImportBank(true)
        })
        .catch((error) => {
          setSnackMessage({
            color: 'error',
            message: error.response.data.message,
          });
          setOpenSnack(true);
        });

    } else if (index === 1) {
      await Api.get('/struct/all/wData?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
        .then((res) => {
          setdataStruct(res.data.structs);
          setVisibleImportStruct(true)
        })
        .catch((error) => {
          setSnackMessage({
            color: 'error',
            message: error.response.data.message,
          });
          setOpenSnack(true);
        });
    } else if (index === 2) {
      //Modal de instrumentos
    } else if (index === 3) {
      creator.JSON = {}
    }
    setProgress(false)
  }

  const saveCensus = async (e) => {
    setProgress(true)
    let evalData = creator.getSurveyJSON()
    if (evalData.pages !== undefined) {
      if (evalData.title !== undefined) {
        var edit_struct = {
          _id: censusData._id,
          data: evalData,
        }
        await Api.post('/census/edit', edit_struct)
          .then(async (res) => {
            cleanModal(true)
            setOpenSnack(true)
            setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
            await Api.get('/census/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
              setdataTable(res.data.census)
            })
          })
          .catch((error) => {
            console.log(error)
            setOpenSnack(true)
            setSnackMessage({
              ...snackMessage,
              color: 'error',
              message: error.response.data.message ?? error,
            })
          })
      } else {
        setOpenSnack(true)
        setSnackMessage({
          ...snackMessage,
          color: 'warning',
          message: 'El título del censo está vacío. Debe ingresar un título.',
        })
      }
    } else {
      setOpenSnack(true)
      setSnackMessage({
        ...snackMessage,
        color: 'warning',
        message: 'El censo está vacío. Debe eligir una pregunta para guardar.',
      })
      //creator.text = JSON.stringify(evalData)
    }
    setProgress(false)
  }

  return (
    <Dialog
      fullScreen
      open={visible}
      onClose={cleanModal}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative', backgroundColor: '#0d47a1' }}>
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6" component="div">
            Editar censo
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
      <Box sx={{ height: '100%' }}>
        <Grid container>
          <Grid item xs={12}>
            <Fab sx={{
              position: 'fixed', bottom: 20, right: 16, backgroundColor: '#0d47a1', color: 'white',
              ":hover": {
                boxShadow: 6,
                backgroundColor: '#1976d2'
              },
            }} variant="extended" onClick={saveCensus}>
              <SaveIcon sx={{ mr: 1 }} />
              Guardar
            </Fab>
            <SpeedDial
              ariaLabel="SpeedDial basic example"
              sx={{ position: 'fixed', bottom: 80, right: 16 }}
              icon={<SpeedDialIcon />}
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
          <Grid item xs={12} sx={{ height: 'calc(100vh - 64px)', p: 0, backgroundColor: '#f3f3f3' }}>
            <SurveyCreator.SurveyCreatorComponent creator={creator} />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}

export default EditCensusModal

EditCensusModal.propTypes = {
  censusData: PropTypes.object,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setVisibleImportBank: PropTypes.func,
  setVisibleImportStruct: PropTypes.func,
  setdataQuestion: PropTypes.func,
  setdataStruct: PropTypes.func,
  setProgress: PropTypes.func,
  creator: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
}
