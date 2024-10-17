import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Box,
  Grid,
  TextField,
  Divider,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Api from "../../../services/Api";
import { useSelector } from "react-redux";

const initialState = {
  _id: "",
  name: "",
  description: "",
};

const DeletePopulation = ({
  populationData,
  visible,
  setVisible,
  setOpenSnack,
  snackMessage,
  setSnackMessage,
  setProgress,
  setResult,
}) => {
  const [{ _id, name, description }, setState] =
    useState(initialState);
  const todos = useSelector((state) => state.todos);

  useEffect(() => {
    (async () => {

      setState((prevState) => ({
        ...prevState,
        _id: populationData._id,
        name: populationData.name,
        description: populationData.description,
      }));

    })();
  }, [populationData]);

  const cleanModal = () => {
    setVisible(false);
  };

  const Delete = async () => {
    setProgress(true);
    var delete_population = {
      _id: _id,
    };

    await Api.post("/population/delete", delete_population)
      .then(async (res) => {
        cleanModal();
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "success",
          message: res.data.message,
        });
        await Api.get("/population/all?roleA=" + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
          setResult(res.data.populations);
        });
      })
      .catch((error) => {
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "error",
          message: error.response.data.message,
        });
      });

    setProgress(false);
  };

  return (
    <>
      <Dialog
        open={visible}
        onClose={cleanModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="md"
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
          Eliminar población
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  size="small"
                  label="Nombre de la población"
                  type="text"
                  value={name}
                  autoComplete="current-name"
                  fullWidth
                  sx={{ mb: 1 }}
                  display="flex"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-multiline-static"
                  label="Descripción de la población"
                  multiline
                  rows={2}
                  fullWidth
                  variant="standard"
                  value={description}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>¿Está segur@ que desea borrar la población?</Typography>
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
            onClick={Delete}
          >
            Sí, borrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

DeletePopulation.propTypes = {
  populationData: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
  setResult: PropTypes.func,
};

export default DeletePopulation;
