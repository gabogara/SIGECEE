import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
//import { useSelector } from 'react-redux'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Box,
  Grid,
  Divider,
  Typography,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Api from "../../../services/Api";

/* i: initial, e: error, v: valid*/
const initialState = {
  _id: "",
  name: "",
  email: "",
};

const ModalRecoverPassUser = ({
  data,
  setVisible,
  visible,
  setResult,
  setOpenSnack,
  snackMessage,
  setSnackMessage,
  setProgress,
}) => {
  //const todos = useSelector((state) => state.todos)

  const [
    {
      _id,
      name,
      email,
    },
    setState,
  ] = useState(initialState); // or it could be other thing than an object...

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      _id: data._id,
      name: data.name,
      email: data.email,
    }));
  }, [data]);

  const RecoverPass = async (e) => {
    setProgress(true);
    var recover_pass = { _id: _id };
    await Api.post("/user/recover2", recover_pass)
      .then(async (res) => {
        setProgress(false);
        setVisible(false);
        setOpenSnack(true);
        setSnackMessage({
          ...snackMessage,
          color: "success",
          message: res.data.message,
        });
        await Api.get("/user/all").then((res) => {
          setResult(res.data.users);
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
  };

  return (
    <>
      <Dialog
        open={visible}
        onClose={() => {
          setVisible(false);
          setState({ ...initialState });
        }}
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
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
          Reestablecer contraseña de usuario
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ px: 3 }}
            >

              <Grid item xs={12} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>¿Está segur@ que desea reestablecer la contraseña del usuario?</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  size="small"
                  label="Nombre y apellido"
                  type="text"
                  value={name}
                  autoComplete="current-name"
                  fullWidth
                  sx={{ mb: 1 }}
                  display="flex"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  variant="standard"
                  size="small"
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  autoComplete="current-email-add"
                  fullWidth
                  sx={{ mb: 1 }}
                  display="flex"
                />
              </Grid>
              <Grid item xs={12} >
                <Divider sx={{ mb: 2 }} />
                <Alert
                  severity="info"
                  sx={{
                    my: 1,
                  }}
                >
                  <Typography variant="body2">Se le enviará un correo al usuario con una nueva contraseña aleatoria, la cual puede ser modificada en cualquier momento desde su Perfil de Usuario.</Typography>
                </Alert>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{ textTransform: "none" }}
            color="primary"
            onClick={() => {
              setVisible(false);
            }}
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
            onClick={(e) => RecoverPass(e)}
          >
            Sí, restablecer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ModalRecoverPassUser.propTypes = {
  data: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setResult: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
};

export default ModalRecoverPassUser;
