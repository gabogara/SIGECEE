import React from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
} from '@mui/material'
import PropTypes from 'prop-types'
import { ArrowRightRounded } from '@mui/icons-material'
import { styled } from "@mui/material/styles";

import Breadcrumbs from '../../layout/AppBreadcrumb'

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AccountProfileDetails = ({ user, roles, schools, setVisibleEdit, setVisiblePass }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        marginBottom: 2,
      }}
    >
      <DrawerHeader />
      <Breadcrumbs />
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Grid container spacing={3}>
          <Grid item lg={12} md={12} xs={12}>
            <form autoComplete="off" noValidate>
              <Card>
                <CardHeader
                  subheader=""
                  title={user.name ?? ''}
                ></CardHeader>
                <Divider />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item md={3} xs={12}>
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
                              src={user.image}
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
                    <Grid item md={9} xs={12}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Grid container spacing={2}>
                          {/* <Grid item md={6} xs={12}>
                                                        {user.name ? (
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label="Nombre y apellido"
                                                                type="text"
                                                                value={user.name ?? ''}
                                                                autoComplete="current-name-profile"
                                                                fullWidth
                                                                sx={{ mb: 1 }}
                                                                display="flex"
                                                                inputProps={{ readOnly: true }}
                                                            />
                                                        ) : (
                                                            <Skeleton variant="text" fullWidth height={49} />
                                                        )}
                                                    </Grid> */}
                          <Grid item xs={12}>
                            <TextField
                              variant="standard"
                              size="small"
                              label="Correo electrónico"
                              type="email"
                              value={user.email ?? ''}
                              fullWidth
                              sx={{ mb: 1 }}
                              display="flex"
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
                                value={(user.role === undefined ? '' : user.role._id) ?? ''}
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
                                value={(user.school === undefined ? '' : user.school._id) ?? ''}
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
                          {/*<Grid item md={3} xs={12}>
                              <Chip
                                fontSize="small"
                                label={status === 0 ? 'Inactivo' : status === 1 ? 'Activo' : 'Eliminado'}
                                color={status === 0 ? 'warning' : status === 1 ? 'success' : 'error'}
                              />
                            </Grid>
                          */}
                          {/*<Grid item md={12} xs={12}>
                              <FormControlLabel
                                  control={<Switch checked={user.isAdmin ?? false} />}
                                  label={
                                      user.isAdmin ? (
                                          <small>Esta cuenta tiene permisos de Administrador.</small>
                                      ) : (
                                          <small>Esta cuenta no tiene permisos de Administrador.</small>
                                      )
                                  }
                                  value={user.isAdmin ?? false}
                                  onClick={() => {
                                      return false
                                  }}
                              />
                          </Grid>*/}
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                  <Divider sx={{ marginBottom: '0.5rem', marginTop: '0.5rem' }} />
                  <Grid container spacing={0}>
                    <Grid item md={12} xs={12}>
                      <Button
                        variant="text"
                        style={{ textTransform: 'none' }}
                        onClick={() => setVisibleEdit(true)}
                      >
                        Modificar perfil
                        <ArrowRightRounded />
                      </Button>
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Divider sx={{ marginBottom: '0.5rem', marginTop: '0.5rem' }} />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <Button
                        variant="text"
                        style={{ textTransform: 'none' }}
                        onClick={() => setVisiblePass(true)}
                      >
                        Modificar contraseña
                        <ArrowRightRounded />
                      </Button>
                    </Grid>
                  </Grid>
                  <Divider sx={{ marginTop: '0.5rem' }} />
                </CardContent>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default AccountProfileDetails

AccountProfileDetails.propTypes = {
  user: PropTypes.object,
  roles: PropTypes.array,
  schools: PropTypes.array,
  setVisibleEdit: PropTypes.func,
  setVisiblePass: PropTypes.func,
}
