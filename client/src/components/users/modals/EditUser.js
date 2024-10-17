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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
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
  errorEmptyName: "i",
  errorEmptyEmail: "i",
  errorEmptyRole: "i",
  errorEmptySchool: "i",
};

const ModalEditUser = ({
  data,
  roles,
  schools,
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
      role,
      school,
      //isAdmin,
      errorEmptyName,
      errorEmptyEmail,
      errorEmail,
      errorEmptyRole,
      errorEmptySchool,
    },
    setState,
  ] = useState(initialState); // or it could be other thing than an object...

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role === undefined ? "" : data.role._id,
      school: data.school === undefined ? "" : data.school._id,
      //isAdmin: data.isAdmin,
      errorEmptyName: "v",
      errorEmptyEmail: "v",
      errorEmail: "v",
      errorEmptyRole: "v",
      errorEmptySchool: "v",
    }));
  }, [data]);

  const onChangeEmail = (em) => {
    setState((prevState) => ({ ...prevState, email: em }));
    if (/.+@.+..+/.test(em)) {
      setState((prevState) => ({ ...prevState, errorEmail: "v" }));
      setState((prevState) => ({ ...prevState, errorEmptyEmail: "v" }));
    } else {
      setState((prevState) => ({ ...prevState, errorEmail: "i" }));
      setState((prevState) => ({ ...prevState, errorEmptyEmail: "i" }));
    }
  };
  const EditUser = async (e) => {
    setProgress(true);
    if (
      name !== "" &&
      email.trim() !== "" &&
      /.+@.+..+/.test(email) &&
      role !== "" &&
      role.length > 0 &&
      school !== ""
    ) {
      var edit_user = {};
      if (school !== "" && school.length > 0) {
        edit_user = {
          _id: _id,
          name: name,
          email: email,
          role: role,
          school: school,
          //isAdmin: isAdmin,
        };
      } else {
        edit_user = {
          _id: _id,
          name: name,
          email: email,
          role: role,
          //isAdmin: isAdmin,
        };
      }
      await Api.post("/user/edit", edit_user)
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
          setProgress(false);
          setOpenSnack(true);
          setSnackMessage({
            ...snackMessage,
            color: "error",
            message: error.response.data.message,
          });
        });
    } else {
      setProgress(false);
      if (email.trim() === "") {
        setState((prevState) => ({ ...prevState, errorEmptyEmail: "e" }));
      } else if (!/.+@.+..+/.test(email)) {
        setState((prevState) => ({ ...prevState, errorEmail: "e" }));
      }
      if (name === "") {
        setState((prevState) => ({ ...prevState, errorEmptyName: "e" }));
      }
      if (role === "" || role.length === 0) {
        setState((prevState) => ({ ...prevState, errorEmptyRole: "e" }));
      }
      if (school === "") {
        setState((prevState) => ({ ...prevState, errorEmptySchool: "e" }));
      }
    }
  };

  return (
    <>
      {data && <Dialog
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
          Editar información de usuario
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ px: 3 }}
            >
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
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      name: e.target.value,
                    }));
                    e.target.value !== "" && e.target.value !== null
                      ? setState((prevState) => ({
                        ...prevState,
                        errorEmptyName: "v",
                      }))
                      : setState((prevState) => ({
                        ...prevState,
                        errorEmptyName: "i",
                      }));
                  }}
                  error={
                    errorEmptyName === "e"
                      ? true
                      : errorEmptyName === "v"
                        ? false
                        : false
                  }
                  color={errorEmptyName === "v" ? "success" : ""}
                  helperText={
                    errorEmptyName === "e" ? "El nombre es obligatorio" : ""
                  }
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
                  onChange={(e) => {
                    onChangeEmail(e.target.value);
                  }}
                  error={
                    errorEmptyEmail === "e" || errorEmail === "e"
                      ? true
                      : errorEmail === "v"
                        ? false
                        : false
                  }
                  color={errorEmail === "v" ? "success" : ""}
                  helperText={
                    errorEmptyEmail === "e"
                      ? "El correo electrónico es obligatorio"
                      : errorEmail === "e"
                        ? "Formato de correo electrónico inválido"
                        : ""
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="standard" fullWidth sx={{ m: 0, p: 0 }}>
                  <InputLabel id="demo-simple-select-standard-label">
                    Rol de usuario
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    value={role}
                    size="small"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        role: e.target.value,
                      }));
                      e.target.length > 0 && e.target.value !== ""
                        ? setState((prevState) => ({
                          ...prevState,
                          errorEmptyRole: "v",
                        }))
                        : setState((prevState) => ({
                          ...prevState,
                          errorEmptyRole: "i",
                        }));
                    }}
                    label="Rol de usuario"
                    error={
                      errorEmptyRole === "e"
                        ? true
                        : errorEmptyRole === "v"
                          ? false
                          : false
                    }
                  >
                    {roles.map(({ _id, name }, index) => (
                      <MenuItem key={index} value={_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errorEmptyRole === "e"
                      ? "Seleccione un rol de usuario"
                      : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl variant="standard" fullWidth sx={{ m: 0, p: 0 }}>
                  <InputLabel id="label-school">Escuela</InputLabel>
                  <Select
                    labelId="label-school"
                    value={school}
                    size="small"
                    onChange={(e) => {
                      setState((prevState) => ({
                        ...prevState,
                        school: e.target.value,
                      }));
                      e.target.value !== ""
                        ? setState((prevState) => ({
                          ...prevState,
                          errorEmptySchool: "v",
                        }))
                        : setState((prevState) => ({
                          ...prevState,
                          errorEmptySchool: "i",
                        }));
                    }}
                    label="Escuela"
                    error={
                      errorEmptySchool === "e"
                        ? true
                        : false
                    }
                  >
                    {schools.map(({ _id, name }, index) => (
                      <MenuItem key={index} value={_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#d32f2f" }}>
                    {errorEmptySchool === "e"
                      ? "Seleccione una escuela"
                      : ""}
                  </FormHelperText>
                </FormControl>
              </Grid>
              {/*<Grid item xs={12} md={6}>
                <FormControlLabel
                  control={<Switch defaultChecked={isAdmin} />}
                  label="¿Administrador?"
                  value={isAdmin}
                  onClick={() => {
                    setState((prevState) => ({
                      ...prevState,
                      isAdmin: !isAdmin,
                    }));
                    console.log(!isAdmin);
                  }}
                />
                </Grid>*/}
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
            onClick={(e) => EditUser(e)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>}
    </>
  );
};

ModalEditUser.propTypes = {
  data: PropTypes.object,
  roles: PropTypes.array,
  schools: PropTypes.array,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setResult: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
};

export default ModalEditUser;
