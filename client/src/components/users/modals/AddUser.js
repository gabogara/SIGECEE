import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
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
  name: "",
  email: "",
  role: "",
  school: "",
  /*isAdmin: false,*/
  errorEmptyName: "i",
  errorEmptyEmail: "i",
  errorEmptyRole: "i",
  errorEmptySchool: "i",
};

const ModalAddUser = ({
  roles,
  schools,
  visible,
  setVisible,
  setResult,
  setOpenSnack,
  snackMessage,
  setSnackMessage,
  setProgress,
}) => {
  const todos = useSelector((state) => state.todos);

  const [
    {
      name,
      email,
      role,
      school,
      /*isAdmin,*/
      errorEmptyName,
      errorEmptyEmail,
      errorEmail,
      errorEmptyRole,
      errorEmptySchool,
    },
    setState,
  ] = useState(initialState);

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

  const cleanModal = () => {
    setVisible(false);
    setState({ ...initialState });
  };

  const RegisterUser = async (e) => {
    setProgress(true);
    if (
      name !== "" &&
      email.trim() !== "" &&
      /.+@.+..+/.test(email) &&
      role !== "" &&
      role.length > 0 &&
      school !== ""
    ) {
      var register_user = {
        name: name,
        email: email,
        role: role,
        school: school !== "" ? school : undefined,
        //isAdmin: isAdmin,
        status: 1,
        createdBy: todos.userInfo._id,
      };
      await Api.post("/user/register", register_user)
        .then(async (res) => {
          cleanModal();
          setProgress(false);
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
    } else {
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
          Agregar nuevo usuario
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
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
                  error={errorEmptyName === "e" ? true : false}
                  color={errorEmptyName === "v" ? "success" : ""}
                  helperText={
                    errorEmptyName === "e" ? "El nombre y apellido es obligatorio" : ""
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
                    errorEmptyEmail === "e" || errorEmail === "e" ? true : false
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
                    error={errorEmptyRole === "e" ? true : false}
                  >
                    {roles.map(({ _id, name }, index) => (
                      <MenuItem key={index} value={_id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText sx={{ color: "#d32f2f" }}>
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
            onClick={(e) => RegisterUser(e)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ModalAddUser.propTypes = {
  roles: PropTypes.array,
  schools: PropTypes.array,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  setResult: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
};

export default ModalAddUser;
