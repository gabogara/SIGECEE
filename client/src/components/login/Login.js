import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Alert,
  Typography,
  Grid,
  Card,
  CardContent,
  Link,
  Fade,
  Box,
  /*CardMedia,*/
} from "@mui/material";
import Api from "../../services/Api";
import Footer from '../layout/Footer3';
import "@fontsource/montserrat/500.css";
import background from "../../assets/images/mural.jpg";
/*import sigecee from "../../assets/images/sigecee_blue.png";*/
import { useDispatch } from "react-redux";
import SimpleBackdrop from "../mui/ProgressMUI";
import DividerText from "../mui/DividerText";
import InfoIcon from '@mui/icons-material/Info';
import CustomTooltip from "../mui/CustomTooltip"
import Header from "../blog/Header";
const Login = () => {
  const [email, setEmail] = useState("");
  const [emailRecover, setEmailRecover] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmptyEmail, setEmptyErrorEmail] = useState("i"); /* i: initial, e: error, v: valid*/
  const [errorEmptyEmailRecover, setEmptyErrorEmailRecover] = useState("i");
  const [errorEmptyPassword, setEmptyErrorPassword] = useState("i");
  const [errorEmail, setErrorEmail] = useState("i");
  const [errorEmailRecover, setErrorEmailRecover] = useState("i");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessageRecover, setErrorMessageRecover] = useState("");
  const [alertClass, setAlertClass] = useState(false);
  const [alertClassRecover, setAlertClassRecover] = useState(false);
  const [alertClassRecoverColor, setAlertClassRecoverColor] = useState("error");
  const [progress, setProgress] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginCard, setLoginCard] = useState(true);
  /*const todos = useSelector((state) => state.todos);*/

  /*useEffect(() => {
    if (todos && Object.keys(todos).length !== 0 && Object.getPrototypeOf(todos) === Object.prototype) {
      navigate(`/dashboard`);
    }
  }, [navigate]);*/

  const cleanLogin = () => {
    setEmail("");
    setEmptyErrorEmail("i");
    setEmptyErrorPassword("i");
    setErrorMessage("")
    setErrorEmail("i")
    setAlertClass(false)
  }

  const cleanRecover = () => {
    setEmailRecover("");
    setEmptyErrorEmailRecover("i");
    setErrorEmailRecover("i");
    setErrorMessageRecover("")
    setAlertClassRecover(false)
    setAlertClassRecoverColor("error")
  }

  const onChangeEmail = (em) => {
    setEmail(em);
    setAlertClass(false);
    if (/.+@.+..+/.test(em)) {
      setErrorEmail("v");
      setEmptyErrorEmail("v");
    } else {
      setErrorEmail("i");
      setEmptyErrorEmail("i");
    }
  };

  const onChangeEmailRecover = (em) => {
    setEmailRecover(em);
    setAlertClassRecover(false);
    if (/.+@.+..+/.test(em)) {
      setErrorEmailRecover("v");
      setEmptyErrorEmailRecover("v");
    } else {
      setErrorEmailRecover("i");
      setEmptyErrorEmailRecover("i");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      LoginUser()
    }
  }

  const handleKeyPress2 = (event) => {
    if (event.key === 'Enter') {
      RecoverUser()
    }
  }

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  const LoginUser = async () => {
    setProgress(true);

    if (email.trim() !== "" && password !== "") {
      if (/.+@.+..+/.test(email)) {
        const login_user = {
          email: email,
          password: password,
        };
        await Api.post("/user/login", login_user)
          .then((res) => {
            dispatch({ type: "USER_LOGIN_SUCCESS", payload: res.data.user });
            navigate("/dashboard");
          })
          .catch((error) => {
            setEmptyErrorPassword("i");
            setPassword("");
            setErrorMessage(error.response.data.message);
            setAlertClass(true);
          });
      } else {
        setErrorEmail("e");
      }
    } else {
      if (email.trim() === "" && password !== "") {
        setEmptyErrorEmail("e");
      } else if (
        email.trim() !== "" &&
        email.trim() !== null &&
        (password === "" || password === null)
      ) {
        setEmptyErrorPassword("e");
      } else {
        setEmptyErrorEmail("e");
        setEmptyErrorPassword("e");
      }
    }
    setProgress(false);
  };

  const RecoverUser = async () => {
    setProgress(true);

    if (emailRecover.trim() !== "") {
      if (/.+@.+..+/.test(emailRecover)) {
        const recover_user = {
          email: emailRecover,
        };
        await Api.post("/user/recover", recover_user)
          .then((res) => {
            setEmailRecover("")
            setAlertClassRecoverColor("success")
            setErrorMessageRecover(res.data.message);
            setAlertClassRecover(true);
          })
          .catch((error) => {
            setAlertClassRecoverColor("error")
            setErrorMessageRecover(error.response.data.message);
            setAlertClassRecover(true);
          });
      } else {
        setErrorEmailRecover("e");
      }
    } else {
      setEmptyErrorEmailRecover("e");
    }
    setProgress(false);
  };



  return (
    <>
      <Header showItems={false} />
      <SimpleBackdrop open={progress} />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: `url(${background})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          alignContent: "center",
          //height: "100vh",
          //position: 'fixed',
          //bottom: 0,
          backgroundColor: "rgba(0,0,0,.6)",
          //height: '100vh'
        }}
      >


        <Grid item xs={12} md={7} lg={5} sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh', p: 1, display: 'flex', }} >

          {!loginCard && <Fade in={!loginCard} style={{ transformOrigin: '0 0 0' }}
            {...(!loginCard ? { timeout: 700 } : {})}>
            <Card sx={{
              pt: {
                xs: 1,
                md: 3.7
              }, pb: 0.7, px: {
                xs: 1,
                md: 7
              },
            }}>
              <CardContent>
                {/* Box sx={{ display: 'flex', width: '50%', justifyContent: 'center', ml: 'auto', mr: 'auto' }}>
                  <Box component="span" sx={{ ml: 'auto', mr: 'auto' }}><CardMedia
                    component="img"
                    sx={{ width: '100%' }}
                    image={sigecee}
                    alt="SIGECEE"

                  />
                  </Box>
                </Box>*/}
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ pb: 2, textAlign: 'center', textShadow: '1px 1px 2px grey;' }}
                  fontFamily="Montserrat"
                >
                  Sistema para la Gestión de Censos, Encuestas y Estudios

                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ pb: 1, textAlign: 'center', fontWeight: 500 }}
                  fontFamily="Roboto"
                >
                  <DividerText children={'Recuperar contraseña'} />
                </Typography>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                  className="text-medium-emphasis"
                  sx={{ pb: 1 }}
                >
                  Ingresa tu correo para recuperar tu contraseña.
                </Typography>
                <Grid container direction="column" justifyContent="center">
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <TextField
                        variant="standard"
                        size="small"
                        label="Correo electrónico"
                        type="email"
                        value={emailRecover}
                        autoComplete="current-email"
                        fullWidth
                        display="flex"
                        onChange={(e) => {
                          onChangeEmailRecover(e.target.value);
                        }}
                        error={
                          errorEmptyEmailRecover === "e" || errorEmailRecover === "e"
                            ? true
                            : false
                        }
                        color={errorEmailRecover === "v" ? "success" : ""}
                        helperText={
                          errorEmptyEmailRecover === "e"
                            ? "Debes ingresar tu correo electrónico"
                            : errorEmailRecover === "e"
                              ? "Formato de correo electrónico inválido"
                              : ""
                        }
                        onKeyPress={handleKeyPress2}
                      />
                      <CustomTooltip title="Se le enviará un correo con una nueva contraseña aleatoria, la cual puede ser modificada en cualquier momento desde su Perfil." placement="bottom" sx={{ textAlign: 'justify' }} content={<InfoIcon color="info" sx={{ ml: 1, my: 0.5, cursor: 'pointer' }} />} />
                    </Box>
                  </Grid>
                </Grid>
                <Alert
                  severity={alertClassRecoverColor}
                  sx={{
                    visibility: alertClassRecover ? "visible" : "hidden",
                    my: 1,
                  }}
                >
                  <Typography variant="caption">{errorMessageRecover}</Typography>
                </Alert>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
                    backgroundColor: '#0d47a1',
                    ":hover": {
                      boxShadow: 6,
                    },
                    textTransform: "none"
                  }}
                  color="primary"
                  onClick={RecoverUser}
                >
                  Recuperar
                </Button>
                <Grid item container direction="column" justifyContent="center" sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="caption" gutterBottom><Link sx={{ cursor: 'pointer' }} onClick={() => {
                    setLoginCard(true)
                    cleanRecover()
                  }}>Iniciar sesión</Link></Typography>
                </Grid>
                {/* <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ textAlign: 'center', mt: 1 }}>
                  <Grid item>
                    <CustomTooltip title="Volver a la página principal" placement="bottom" sx={{ textAlign: 'center' }} content={(
                      <Typography variant="caption" gutterBottom>
                        <LinkRouter to="/" style={{ display: 'flex' }} >
                          <NewspaperIcon sx={{ color: '#0d47a1' }} />
                        </LinkRouter>
                      </Typography>
                    )} />
                  </Grid>
                </Grid> */}
              </CardContent>
            </Card>
          </Fade>}
          {loginCard && <Fade in={loginCard} style={{ transformOrigin: '0 0 0' }}
            {...(loginCard ? { timeout: 700 } : {})}>

            <Card sx={{
              mt: '64px',
              pt: {
                xs: 1,
                md: 3.7
              }, pb: 0.7, px: {
                xs: 1,
                md: 7
              }, mb: 3
            }}>

              <CardContent>

                {/* Box sx={{ display: 'flex', width: '50%', justifyContent: 'center', ml: 'auto', mr: 'auto' }}>
                  <Box component="span" sx={{ ml: 'auto', mr: 'auto' }}><CardMedia
                    component="img"
                    sx={{ width: '100%' }}
                    image={sigecee}
                    alt="SIGECEE"

                  />
                  </Box>
                </Box>*/}

                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ pb: 2, textAlign: 'center', textShadow: '1px 1px 2px grey;' }}
                  fontFamily="Montserrat"
                >
                  Sistema para la Gestión de Censos, Encuestas y Estudios

                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  gutterBottom
                  sx={{ py: 1, textAlign: 'center', fontWeight: 500 }}
                  fontFamily="Roboto"
                >
                  <DividerText children={'Iniciar sesión'} />
                </Typography>

                <Typography
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                  className="text-medium-emphasis"
                  sx={{ pb: 1 }}
                >
                  Ingresa tu correo y contraseña para acceder al sistema.
                </Typography>
                <Grid item container direction="column" justifyContent="center">
                  <TextField
                    variant="standard"
                    size="small"
                    label="Correo electrónico"
                    type="email"
                    value={email}
                    autoComplete="current-email"
                    fullWidth
                    sx={{ mb: 1 }}
                    display="flex"
                    onChange={(e) => {
                      onChangeEmail(e.target.value);
                    }}
                    error={
                      errorEmptyEmail === "e" || errorEmail === "e"
                        ? true
                        : false
                    }
                    color={errorEmail === "v" ? "success" : ""}
                    helperText={
                      errorEmptyEmail === "e"
                        ? "Debes ingresar tu correo electrónico"
                        : errorEmail === "e"
                          ? "Formato de correo electrónico inválido"
                          : ""
                    }
                    onKeyPress={handleKeyPress}
                  />
                </Grid>
                <TextField
                  variant="standard"
                  label="Contraseña"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  size="small"
                  fullWidth
                  sx={{ mb: 1 }}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setAlertClass(false);
                    e.target.value !== "" && e.target.value !== null
                      ? setEmptyErrorPassword("v")
                      : setEmptyErrorPassword("i");
                  }}
                  error={
                    errorEmptyPassword === "e"
                      ? true
                      : false
                  }
                  color={errorEmptyPassword === "v" ? "success" : ""}
                  helperText={
                    errorEmptyPassword === "i" || errorEmptyPassword === "v"
                      ? ""
                      : errorEmptyPassword === "e"
                        ? "Debes ingresar tu contraseña"
                        : ""
                  }
                  onKeyPress={handleKeyPress}
                />
                <Alert
                  severity="error"
                  sx={{
                    visibility: alertClass ? "visible" : "hidden",
                    mb: 1,
                  }}
                >
                  <small>{errorMessage}</small>
                </Alert>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
                    backgroundColor: '#0d47a1',
                    ":hover": {
                      boxShadow: 6,
                    },
                    textTransform: "none"
                  }}
                  onClick={LoginUser}
                >
                  Ingresar
                </Button>
                <Grid container direction="column" justifyContent="center" alignItems="center" >
                  <Grid item sx={{ textAlign: 'center', mt: 2, verticalAlign: 'middle', display: 'flex' }}>
                    <Typography variant="caption" gutterBottom>
                      <Link sx={{ cursor: 'pointer' }} onClick={() => {
                        setLoginCard(false)
                        cleanLogin()
                      }}>¿Olvidaste tu contraseña?</Link>
                    </Typography>
                  </Grid>
                </Grid>
                {/* <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ textAlign: 'center', mt: 1 }}>
                  <Grid item>
                    <CustomTooltip title="Volver a la página principal" placement="bottom" sx={{ textAlign: 'center' }} content={(
                      <Typography variant="caption" gutterBottom>
                        <LinkRouter to="/" style={{ display: 'flex' }} >
                          <NewspaperIcon sx={{ color: '#0d47a1' }} />
                        </LinkRouter>
                      </Typography>
                    )} />
                  </Grid>
                </Grid> */}
              </CardContent>
            </Card>
          </Fade>}
        </Grid>
        <Footer />
      </Grid>

    </>
  );
};

export default Login;
