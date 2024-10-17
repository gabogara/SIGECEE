import React from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui';
import PropTypes from 'prop-types'
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Grid, Fab, AppBar, Toolbar, Dialog, IconButton, Typography, Slide,
} from '@mui/material'
import Api from '../../../services/Api'
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const DeleteSurveyModal = ({
  visible,
  setVisible,
  data,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  creator
}) => {
  let survey = new Model(data.data);
  survey.locale = 'es';
  survey.ignoreValidation = true
  const todos = useSelector((state) => state.todos);

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
  };

  const DeleteSurvey = async (e) => {
    setProgress(true)
    var delete_censu = {
      _id: data._id,
    }
    await Api.post('/survey/delete', delete_censu)
      .then(async (res) => {
        setOpenSnack(true)
        setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
        await Api.get('/survey/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
          setdataTable(res.data.survey)
          cleanModal()
        })
      })
      .catch((error) => {
        setSnackMessage({
          color: 'error',
          message: error.response.data.message,
        })
        setOpenSnack(true)
      })
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
            ¿Desea borrar la siguiente encuesta?
          </Typography>
          <IconButton
            edge="start"
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
            }} variant="extended" onClick={DeleteSurvey}>
              <DeleteIcon sx={{ mr: 1 }} />
              Borrar
            </Fab>
          </Grid>
          <Grid item xs={12} sx={{ height: 'calc(100vh - 64px)', p: 0, backgroundColor: '#f3f3f3' }}>
            <Survey model={survey} />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}
export default DeleteSurveyModal

DeleteSurveyModal.propTypes = {
  data: PropTypes.object,
  setdataTable: PropTypes.func,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  creator: PropTypes.object,
}
