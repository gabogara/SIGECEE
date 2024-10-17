import React, { useEffect } from "react";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";
import PropTypes from "prop-types";
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Grid, Fab, AppBar, Toolbar, Dialog, IconButton, Typography, Slide
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import Api from '../../../services/Api'
//import '../customTraslation.ts'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewSurveyModal = ({
  visible,
  setVisible,
  surveyData,
  setSurveyData,
  setProgress,
  canEdit,
  creator,
  setVisibleEdit
}) => {
  let survey = new Model(surveyData.data);
  survey.locale = 'custom';
  survey.ignoreValidation = true

  const cleanModal = async () => {
    setVisible(false)
    creator.JSON = {}
    creator.text = ''
    creator.activeTab = "designer"
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const editSurvey = async () => {
    setProgress(true)
    await Api.get('/survey/get?id=' + surveyData._id)
      .then((res) => {
        setSurveyData(res.data.survey)
        setVisibleEdit(true)
        setVisible(true)
      })
      .catch((error) => {
        console.error('Error:', error.message)
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
            Ver encuesta
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
            {surveyData.status === 0 && canEdit._id === surveyData.createdBy._id && <Fab sx={{
              position: 'fixed', bottom: 20, right: 16, backgroundColor: '#0d47a1', color: 'white',
              ":hover": {
                boxShadow: 6,
                backgroundColor: '#1976d2'
              },
            }} variant="extended" onClick={editSurvey}>
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
  );
};
export default ViewSurveyModal;

ViewSurveyModal.propTypes = {
  surveyData: PropTypes.object,
  setSurveyData: PropTypes.func,
  setProgress: PropTypes.func,
  canEdit: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  creator: PropTypes.object,
  setVisibleEdit: PropTypes.func,
};
