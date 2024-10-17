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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Api from "../../../services/Api";

/* i: initial, e: error, v: valid*/
const initialState = {
  _id: "",
  name: "",
  email: "",
  role: "",
  school: "",
  //isAdmin: false,
};

const ModalEditUser = ({
  setVisible,
  visible,
  setResult,
  data,
  accion,
  setOpenSnack,
  snackMessage,
  setSnackMessage,
  setProgress,
  roles,
  schools,
}) => {
  const [{ _id, name, email, status, role, school, /*isAdmin*/ }, setState] =
    useState(initialState);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      _id: data._id,
      name: data.name,
      email: data.email,
      status: data.status,
      role: data.role === undefined ? "" : data.role._id,
      school: data.school === undefined ? "" : data.school._id,
      //isAdmin: data.isAdmin,
    }));
  }, [data]);

  const ChangeStatusUser = async (e) => {
    setProgress(true);
    var edit_status_user = {};
    edit_status_user = {
      _id: _id,
      status: !status,
    };

    await Api.post("/user/change", edit_status_user)
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
          {accion} acceso a usuario
        </DialogTitle>
        <DialogContent dividers>

          <Divider />
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
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
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
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
                  inputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="standard" fullWidth sx={{ m: 0, p: 0 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Rol de usuario
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    value={role}
                    size="small"
                    label="Rol de usuario"
                    inputProps={{ readOnly: true }}
                  >
                    {roles.map(({ _id, name }, index) => (
                      <MenuItem key={index} value={_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl variant="standard" fullWidth sx={{ m: 0, p: 0 }}>
                  <InputLabel id="label-school">Escuela</InputLabel>
                  <Select
                    labelId="label-school"
                    value={school}
                    size="small"
                    label="Escuela"
                    inputProps={{ readOnly: true }}
                  >
                    {schools.map(({ _id, name }, index) => (
                      <MenuItem key={index} value={_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/*<Grid item xs={6}>
                <FormControlLabel
                  control={<Switch checked={isAdmin ?? false} />}
                  label={
                    isAdmin ? (
                      <small>
                        Esta cuenta tiene permisos de Administrador.
                      </small>
                    ) : (
                      <small>
                        Esta cuenta no tiene permisos de Administrador.
                      </small>
                    )
                  }
                  value={isAdmin ?? false}
                  onClick={() => {
                    return false;
                  }}
                />
                </Grid>*/}
            </Grid>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }}>¿Está segur@ que desea {accion.toLowerCase()} el usuario?</Typography>
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
            onClick={(e) => ChangeStatusUser(e)}
          >
            Sí, {accion.toLowerCase()}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ModalEditUser.propTypes = {
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setResult: PropTypes.func,
  data: PropTypes.object,
  accion: PropTypes.string,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
  roles: PropTypes.array,
  schools: PropTypes.array,
};

export default ModalEditUser;
