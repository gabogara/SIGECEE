import React, { useEffect } from 'react'
import * as SurveyCreator from 'survey-creator-react'
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import PropTypes from 'prop-types'
import {
  Box,
  Grid,
  Fab,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save';
import Api from '../../../services/Api'
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditQuestionModal = ({
  visible,
  setVisible,
  setProgress,
  data,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  reduxInfo,
  creator,
}) => {

  const todos = useSelector((state) => state.todos);

  useEffect(() => {
    if (data.data !== undefined) {
      creator.JSON = data.data
      creator.activeTab = "designer"
    }
  }, [creator, data])

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
  };

  const saveQuestion = async (e) => {
    setProgress(true)
    let evalData = creator.getSurveyJSON()
    if (evalData.pages[0] !== undefined) {
      var edit_question = {
        _id: data._id,
        data: evalData,
      }
      await Api.post('/question/edit', edit_question)
        .then(async (res) => {
          cleanModal()
          setOpenSnack(true)
          setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
          await Api.get('/question/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
            setdataTable(res.data.questions)
          })
        })
        .catch((error) => {
          setSnackMessage({
            color: 'error',
            message: error.response.data.message,
          })
          setOpenSnack(true)
        })
    } else {
      setOpenSnack(true)
      setSnackMessage({
        ...snackMessage,
        color: 'warning',
        message: 'La pregunta está vacía.',
      })
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
            Editar pregunta
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
  )
}

export default EditQuestionModal

EditQuestionModal.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  setProgress: PropTypes.func,
  data: PropTypes.object,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  reduxInfo: PropTypes.object,
  creator: PropTypes.object,
}
