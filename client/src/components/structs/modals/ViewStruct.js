import React from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui';
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
import EditIcon from '@mui/icons-material/Edit';
import Api from '../../../services/Api'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ViewStructModal = ({ visible, setVisible, data, setProgress, setStructData, canEdit, creator, setVisibleEdit }) => {
  const survey = new Model(data.data)
  survey.locale = 'es'
  survey.showNavigationButtons = 'none'

  const editStruct = async () => {
    setProgress(true)
    await Api.get('/struct/get?id=' + data._id)
      .then((res) => {
        setStructData(res.data.struct)
        setVisibleEdit(true)
        setVisible(true)
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
    <>
      <Dialog
        fullScreen
        open={visible}
        onClose={cleanModal}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#0d47a1' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Ver estructura base
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
              }} variant="extended" onClick={editStruct}>
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
    </>
  )
}
export default ViewStructModal

ViewStructModal.propTypes = {
  data: PropTypes.object,
  setProgress: PropTypes.func,
  setStructData: PropTypes.func,
  canEdit: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  creator: PropTypes.object,
  setVisibleEdit: PropTypes.func,
}
