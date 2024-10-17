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

const ViewQuestionModal = ({ structData2, setVisible2, visible2 }) => {
  const survey = new Model(structData2)
  survey.locale = 'es'

  return (
    <>
      <Dialog
        open={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          {visible2 ? (
            <IconButton
              aria-label="close"
              onClick={() => setVisible2(false)}
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
          Ver censo
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
            onClick={() => setVisible2(false)}
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
  structData2: PropTypes.object,
  setVisible2: PropTypes.func,
  visible2: PropTypes.bool,
}