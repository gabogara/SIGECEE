import React, { useEffect } from 'react';
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
  Slide
} from '@mui/material'
import Api from '../../../services/Api'
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddQuestionModal = ({
  visible,
  setVisible,
  setProgress,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  reduxInfo,
  creator,
}) => {

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
    console.log(creator.toolbox.isCompact)
    creator.toolbox.forceCompact = true;
  };

  useEffect(() => {
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
    creator.toolbox.forceCompact = true;
  }, [creator])
  const todos = useSelector((state) => state.todos);

  const saveQuestion = async (e) => {
    setProgress(true)
    let evalData = creator.getSurveyJSON()
    //console.log(evalData)
    if (evalData && evalData.pages[0] !== undefined) {
      var register_question = {
        data: evalData,
        visibility: 1,
        createdBy: reduxInfo._id,
      }
      await Api.post('/question/add', register_question)
        .then(async (res) => {
          setProgress(false)
          cleanModal()
          setOpenSnack(true)
          setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
          await Api.get('/question/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
            setdataTable(res.data.questions)
          })
        })
        .catch((error) => {
          setProgress(false)
          setSnackMessage({
            color: 'error',
            message: error.response.data.message,
          })
          setOpenSnack(true)
        })
    } else {
      setProgress(false)
      setOpenSnack(true)
      setSnackMessage({
        ...snackMessage,
        color: 'warning',
        message: 'La pregunta está vacía. Debe eligir una pregunta para guardar.',
      })
    }
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
            Agregar nueva pregunta
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
            }} variant="extended" onClick={saveQuestion}>
              <SaveIcon sx={{ mr: 1 }} />
              Guardar
            </Fab>
          </Grid>
          <Grid item xs={12} sx={{ height: 'calc(100vh - 64px)', p: 0, backgroundColor: '#f3f3f3' }}>
            <SurveyCreator.SurveyCreatorComponent creator={creator} />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

export default AddQuestionModal

AddQuestionModal.propTypes = {
  setProgress: PropTypes.func,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  reduxInfo: PropTypes.object,
  creator: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
}