import React from 'react'
import { Model, StylesManager } from 'survey-core'
import { Survey, } from 'survey-react-ui';
import PropTypes from 'prop-types'
import {
  Box,
  Grid, Fab, AppBar, Toolbar, Dialog, IconButton, Typography, Slide
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import Api from '../../../services/Api'
import CloseIcon from "@mui/icons-material/Close";
StylesManager.applyTheme("defaultV2");
var defaultThemeColors = StylesManager.ThemeColors["default"];
defaultThemeColors["$main-color"] = "#0d47a1";
defaultThemeColors["$main-hover-color"] = "#6fe06f";
defaultThemeColors["$text-color"] = "#4a4a4a";
defaultThemeColors["$header-color"] = "#7ff07f";
defaultThemeColors["$header-background-color"] = "#4a4a4a";
defaultThemeColors["$body-container-background-color"] = "#f8f8f8";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewQuestionModal = ({ visible, setVisible, data, setProgress, setQuestionData, canEdit, creator, setVisibleEdit }) => {
  const survey = new Model(data.data)
  survey.locale = 'es'
  //survey.mode = 'display';
  survey.showTitle = false
  survey.showNavigationButtons = 'none'

  const editQuestion = async () => {
    setProgress(true)
    await Api.get('/question/get?id=' + data._id)
      .then((res) => {
        setQuestionData(res.data.question)
        setVisibleEdit(true)
        setVisible(false)
      })
      .catch((error) => {
        console.error('Error:', error.message)
      })
    setProgress(false)
  }

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
  };

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
            Ver pregunta
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
            {Object.keys(data).length > 0 && canEdit._id === data.createdBy._id && <Fab sx={{
              position: 'fixed', bottom: 20, right: 16, backgroundColor: '#0d47a1', color: 'white',
              ":hover": {
                boxShadow: 6,
                backgroundColor: '#1976d2'
              },
            }} variant="extended" onClick={editQuestion}>
              <EditIcon sx={{ mr: 1 }} />
              Editar
            </Fab>}
          </Grid>
          <Grid item xs={12} sx={{ height: 'calc(100vh - 64px)', p: 0, backgroundColor: '#f3f3f3' }}>
            <Survey model={survey} />
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}
export default ViewQuestionModal

ViewQuestionModal.propTypes = {
  data: PropTypes.object,
  setProgress: PropTypes.func,
  setQuestionData: PropTypes.func,
  canEdit: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  creator: PropTypes.object,
}
