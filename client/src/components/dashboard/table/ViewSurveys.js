import React from 'react'
import { Model } from 'survey-core'
import { Survey } from 'survey-react-ui';
import PropTypes from 'prop-types'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const ViewQuestionModal = ({ structData, setVisible, visible }) => {
  const survey = new Model(structData)
  survey.locale = 'es'

  return (
    <>
      <Dialog
        open={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {visible ? (
            <IconButton
              aria-label="close"
              onClick={() => setVisible(false)}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
          Ver encuesta
        </DialogTitle>
        <DialogContent dividers>
          <div>
            <Survey model={survey} />
          </div>
          <br />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{ textTransform: 'none' }}
            color="primary"
            onClick={() => setVisible(false)}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
export default ViewQuestionModal

ViewQuestionModal.propTypes = {
  structData: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
}