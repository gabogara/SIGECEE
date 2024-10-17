import React, { useEffect } from "react";
import PropTypes from "prop-types";
import 'dayjs/locale/es';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "survey-core/defaultV2.min.css";
import { Model } from "survey-core";
import { Survey } from "survey-react-ui";

const ViewFromBankModal = ({
  questionData,
  setVisible,
  visible,
  type,
}) => {

  let survey = new Model(questionData.data);
  survey.locale = 'custom';
  survey.ignoreValidation = true
  survey.showNavigationButtons = 'none'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const cleanModal = async () => {
    setVisible(false)
  };

  return (
    <>
      <Dialog
        open={visible}
        onClose={cleanModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {visible ? (
            <IconButton
              aria-label="close"
              onClick={cleanModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
          Ver {type}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ width: '100%', p: 0 }}>
            <Grid container >
              <Grid item xs={12}>
                <Survey model={survey} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{ textTransform: "none" }}
            color="primary"
            onClick={cleanModal}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ViewFromBankModal;

ViewFromBankModal.propTypes = {
  questionData: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  type: PropTypes.string,
};
