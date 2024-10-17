import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Api from '../../../services/Api'

/* i: initial, e: error, v: valid*/
const initialState = {
  password: '',
  newPass: '',
  newPass2: '',
  errorEmptyPassword: 'i',
}

const ChangePasswordModal = ({ user, setVisible, visible, setOpenSnack, setSnackMessage }) => {
  const [{ password, newPass, newPass2, errorEmptyPassword }, setState] = useState(initialState)

  useEffect(() => {
    setState({
      password: '',
      newPass: '',
      newPass2: '',
      errorEmptyPassword: 'i',
    })
  }, [user])

  const ChangePassword = async (e) => {
    e.preventDefault()

    if (password !== '' && newPass !== '' && newPass2 !== '') {
      if (newPass === newPass2) {
        var verify_pass = {
          _id: user._id,
          password: password,
        }
          ; (async () => {
            await Api.post('/user/getPass', verify_pass)
              .then((res) => {
                if (res.data.user) {
                  var change_pass = {
                    _id: user._id,
                    password: newPass,
                  }
                    ; (async () => {
                      await Api.post('/user/changePass', change_pass)
                        .then((res) => {
                          cleanModal()
                          setSnackMessage({
                            color: 'success',
                            message: res.data.message,
                          })
                          setOpenSnack(true)
                        })
                        .catch((error) => {
                          setSnackMessage({
                            color: 'error',
                            message: res.message,
                          })
                          setOpenSnack(true)
                          console.error('Error:', error.message)
                        })
                    })()
                } else {
                  setSnackMessage({
                    color: 'error',
                    message: res.data.message.message,
                  })
                  setOpenSnack(true)
                }
              })
              .catch((error) => {
                setSnackMessage({
                  color: 'error',
                  message: error.response.data.message,
                })
                setOpenSnack(true)
              })
          })()
      } else {
        setSnackMessage({
          color: 'warning',
          message: 'La nueva contraseña y la confirmación de la nueva contraseña, no coinciden.',
        })
        setOpenSnack(true)
      }
    } else {
      setState((prevState) => ({ ...prevState, errorEmptyPassword: 'e' }))
      setSnackMessage({
        color: 'warning',
        message: 'Ingrese la(s) contraseña(s).',
      })
      setOpenSnack(true)
    }
  }

  const cleanModal = () => {
    setVisible(false)
    setState({
      password: '',
      newPass: '',
      newPass2: '',
      errorEmptyPassword: 'i',
    })
  }

  return (
    <>
      <Dialog
        open={visible}
        onClose={cleanModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="xs"
      >
        <DialogTitle id="alert-dialog-title">
          {visible ? (
            <IconButton
              aria-label="close"
              onClick={cleanModal}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
          Cambiar contraseña
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                <TextField
                  variant="standard"
                  label="Contraseña actual"
                  type="password"
                  value={password ?? ''}
                  autoComplete="current-password-add"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    setState((prevState) => ({ ...prevState, password: e.target.value }))
                  }}
                  error={errorEmptyPassword === 'e' && password === '' ? true : false}
                  color={password !== '' ? 'success' : ''}
                  helperText={
                    errorEmptyPassword === 'e' && password === ''
                      ? 'La contraseña es obligatoria'
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  label="Nueva contraseña"
                  type="password"
                  value={newPass ?? ''}
                  autoComplete="current-password-add"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    setState((prevState) => ({ ...prevState, newPass: e.target.value }))
                  }}
                  error={errorEmptyPassword === 'e' && newPass === '' ? true : false}
                  color={newPass !== '' ? 'success' : ''}
                  helperText={
                    errorEmptyPassword === 'e' && newPass === ''
                      ? 'La nueva contraseña es obligatoria'
                      : ''
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ marginBoottom: 1 }}>
                <TextField
                  variant="standard"
                  label="Confirmación de nueva contraseña"
                  type="password"
                  value={newPass2 ?? ''}
                  autoComplete="current-password-add"
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    setState((prevState) => ({ ...prevState, newPass2: e.target.value }))
                  }}
                  error={errorEmptyPassword === 'e' && newPass2 === '' ? true : false}
                  color={newPass2 !== '' ? 'success' : ''}
                  helperText={
                    errorEmptyPassword === 'e' && newPass2 === ''
                      ? 'La confirmacion de contraseña es obligatoria'
                      : ''
                  }
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            style={{ textTransform: 'none' }}
            color="primary"
            onClick={cleanModal}
          >
            Cerrar
          </Button>
          <Button
            variant="contained"
            style={{ textTransform: 'none' }}
            color="primary"
            onClick={(e) => ChangePassword(e)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

ChangePasswordModal.propTypes = {
  user: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setOpenSnack: PropTypes.func,
  setSnackMessage: PropTypes.func,
}

export default ChangePasswordModal
