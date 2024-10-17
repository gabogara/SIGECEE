import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import 'dayjs/locale/es';
import {
  Dialog,
  IconButton,
  TextField,
  Grid,
  Box,
  InputAdornment,
  Slide,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "survey-core/defaultV2.min.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Api from "../../../services/Api";
import moment from 'moment';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Event from '@mui/icons-material/Event';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initialState = {
  finish_date: null,
  errorEmptyFieldDate: "i",
};

const EditDateModal = ({
  surveyData,
  setVisible,
  visible,
  setdataTable,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setSurveyData,
  setProgress,
}) => {
  const [
    {
      finish_date,
      errorEmptyFieldDate,
    },
    setState,
  ] = useState(initialState);
  const todos = useSelector((state) => state.todos);

  const cleanModal = async () => {
    setVisible(false)
    setState(initialState)
  };

  useEffect(() => {
    (async () => {
      if (Object.keys(surveyData).length !== 0) {
        setState((prevState) => ({
          ...prevState,
          finish_date: surveyData.endDate ?? null,
        }));
      }
    })();
  }, [surveyData, setState]);

  const editDate = async (e) => {
    setProgress(true)
    const edit_census = {
      _id: surveyData._id,
      endDate: finish_date,
    };

    await Api.post("/survey/date", edit_census)
      .then(async (res) => {
        cleanModal()
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "success",
          message: res.data.message,
        });
        setSurveyData(res.data.survey)
        await Api.get('/survey/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
          setdataTable(res.data.survey);
        });
      })
      .catch((error) => {
        setSnackMessage({
          color: "error",
          message: error.response.data.message,
        });
        setOpenSnack(true);
      });
    setProgress(false)
  };

  return (
    <>
      <Dialog
        open={visible}
        onClose={cleanModal}
        TransitionComponent={Transition}
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
          <Box component="span" sx={{ mr: 6 }}>
            Editar fecha de finalización y cierre de encuesta
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 5 }}>
            <Grid container>
              <Grid item xs={12} >
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                  <MobileDatePicker
                    label="Fecha de finalización y cierre de encuesta"
                    value={finish_date}
                    minDate={moment()}
                    onChange={(newValue) => {
                      setState((prevState) => ({
                        ...prevState,
                        finish_date: newValue,
                      }));
                    }}
                    closeOnSelect={true}
                    renderInput={({ InputProps, ...params }) => (
                      <TextField
                        {...params}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Event />
                            </InputAdornment>
                          )
                        }}
                        fullWidth
                      />
                    )}
                    inputFormat="DD/MM/YYYY"
                    error={errorEmptyFieldDate === "e" ? true : false}

                  />
                </LocalizationProvider>
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
          <Button
            variant="contained"
            style={{ textTransform: "none" }}
            sx={{
              backgroundColor: '#0d47a1',
              ":hover": {
                boxShadow: 6,
              },
            }}
            onClick={editDate}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default EditDateModal;

EditDateModal.propTypes = {
  surveyData: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setdataTable: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setSurveyData: PropTypes.func,
  setProgress: PropTypes.func,
};