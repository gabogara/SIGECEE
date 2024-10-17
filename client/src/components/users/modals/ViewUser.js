import React from "react";
import PropTypes from "prop-types";
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
  Card,
  CardHeader,
  CardContent,
  Divider,
  Chip,
  Avatar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import moment from 'moment';

const ModalViewUser = ({ data, roles, schools, setVisible, visible }) => {

  return (
    <>
      {data && <Dialog
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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
          Ver usuario
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            <Grid container>
              <Grid item lg={12} md={12} xs={12}>
                <form autoComplete="off" noValidate>
                  <Card>
                    <CardHeader
                      subheader=""
                      title={(<>{data.name}<Chip
                        fontSize="small"
                        sx={{ ml: 1.5 }}
                        label={data.status === 0 ? 'Bloqueado' : data.status === 1 ? 'Activo' : 'Eliminado'}
                        color={data.status === 0 ? 'error' : data.status === 1 ? 'success' : 'error'}
                      /></>)}
                    ></CardHeader>
                    <Divider />
                    <CardContent>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={3} >
                          <Card>
                            <CardContent>
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  display: 'flex',
                                  flexDirection: 'column',
                                }}
                              >
                                <Avatar
                                  src={data.image}
                                  sx={{
                                    height: 150,
                                    mb: 2,
                                    width: 150,
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={9} >
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Grid container spacing={2}>
                              <Grid item md={6} xs={12}>
                                <TextField
                                  variant="standard"
                                  size="small"
                                  label="Correo electrónico"
                                  type="email"
                                  value={data.email}
                                  autoComplete="current-email-profile"
                                  fullWidth
                                  sx={{ mb: 1 }}
                                  display="flex"
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <TextField
                                  variant="standard"
                                  label="Contraseña"
                                  type="password"
                                  value="******"
                                  autoComplete="current-password-profile"
                                  size="small"
                                  fullWidth
                                  inputProps={{ readOnly: true }}
                                />
                              </Grid>
                              <Grid item md={6} xs={12}>
                                <FormControl variant="standard" fullWidth sx={{ m: 0, p: 0 }}>
                                  <InputLabel id="demo-simple-select-standard-label">
                                    Rol de usuario
                                  </InputLabel>
                                  <Select
                                    labelId="demo-simple-select-standard-label"
                                    value={(data.role && data.role._id ? data.role._id : '')}
                                    size="small"
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
                              <Grid item md={6} xs={12}>
                                <FormControl variant="standard" fullWidth sx={{ m: 0, p: 0 }}>
                                  <InputLabel id="label-school">Escuela</InputLabel>
                                  <Select
                                    labelId="label-school"
                                    value={(data.school && data.school._id ? data.school._id : '')}
                                    size="small"
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
                              <Grid item xs={12} md={6}>
                                <Typography sx={{ fontWeight: 600 }}>Creado por:</Typography> {data.createdBy ? data.createdBy.name : "Sistema"}
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography sx={{ fontWeight: 600 }}>Creado el:</Typography>
                                {moment(data.createdAt).format('DD MMM YYYY hh:mm a')}
                              </Grid>
                            </Grid>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </form>
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
        </DialogActions>
      </Dialog>}
    </>
  );
};

ModalViewUser.propTypes = {
  data: PropTypes.object,
  roles: PropTypes.array,
  schools: PropTypes.array,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
};

export default ModalViewUser;
