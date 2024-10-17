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
  Card,
  CardContent,
  CardActions,
  Avatar,
  Divider,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import Api from '../../../services/Api'

/* i: initial, e: error, v: valid*/
const initialState = {
  _id: '',
  name: '',
  email: '',
  role: '',
  school: '',
  //isAdmin: false,
  errorEmptyName: 'i',
  errorEmptySchool: 'i',
  image: '',
}

const Input = styled('input')({
  display: 'none',
})

const ModalEditProfile = ({
  user,
  setUser,
  schools,
  setVisible,
  visible,
  setOpenSnack,
  setSnackMessage,
}) => {
  //const todos = useSelector((state) => state.todos)
  const [
    { _id, name, email, role, school, /*isAdmin,*/ errorEmptyName, image },
    setState,
  ] = useState(initialState)
  const [file, setFile] = useState()
  const [preview, setPreview] = useState()
  const dispatch = useDispatch()
  const todos = useSelector((state) => state.todos);

  useEffect(() => {
    setState({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role === undefined ? '' : user.role._id,
      school: user.school === undefined ? '' : user.school._id,
      //isAdmin: user.isAdmin,
      errorEmptyName: 'v',
      errorEmptySchool: 'v',
      image: user.image,
    })

    if (!file) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [user, file])

  const saveFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(undefined)
      return
    }
    setFile(e.target.files[0])
  }

  const validarExtensionArchivo = (nombreArchivo) => {
    const extensionesPermitidas = [".jpg", ".png", ".jpeg"];
    const extensionArchivo = nombreArchivo.substring(nombreArchivo.lastIndexOf(".")).toLowerCase();
    return extensionesPermitidas.includes(extensionArchivo);
  }

  const EditUser = async (e) => {
    e.preventDefault()
    if (name !== '') {
      var edit_user = {
        _id: _id,
        name: name,
        email: email,
        role: role,
        school: school !== '' && school.length > 0 ? school : '',
        //isAdmin: isAdmin,
      }
      if (file) {
        if (validarExtensionArchivo(file.name)) {
          if ((file.size / 1024 < 1000)) {
            const formData = new FormData()
            formData.append('image', file)
            formData.append('_id', _id)
            formData.append('name', name)
            await Api.post('/user/profile', formData)
              .then(async (res) => {
                setVisible(false)
                setOpenSnack(true)
                setSnackMessage({
                  color: 'success',
                  message: 'Perfil editado exitosamente.', //res.data.message,
                })
                setUser({ ...user, name: res.data.user.name, image: res.data.user.image })
                dispatch({ type: 'USER_SAVE', payload: { ...todos.userInfo, name: res.data.user.name, image: res.data.user.image } })
                setPreview(undefined)
                setFile(undefined)
              })
              .catch((error) => {
                console.error('Error:', error.message)
                setOpenSnack(true)
                setSnackMessage({
                  color: 'error',
                  message: error.message,
                })
              })
          } else {
            setOpenSnack(true);
            setSnackMessage({
              color: "error",
              message: 'La imagen supera el límite de carga de 1 MB, selecciona otra imagen con menor peso.',
            });
          }
        } else {
          setOpenSnack(true)
          setSnackMessage({
            color: 'error',
            message: 'Solo archivos png, jpg y jpeg permitidos.',
          })
        }
      } else {
        await Api.post('/user/edit', edit_user)
          .then(async (res) => {
            setVisible(false)
            setOpenSnack(true)
            setSnackMessage({
              color: 'success',
              message: 'Perfil editado exitosamente.', //res.data.message,
            })
            setUser({ ...user, name: res.data.user.name, image: res.data.user.image })
            dispatch({ type: 'USER_SAVE', payload: { ...todos.userInfo, name: res.data.user.name, image: res.data.user.image } })
            setPreview(undefined)
            setFile(undefined)
          })
          .catch((error) => {
            console.error('Error:', error.message)
            setOpenSnack(true)
            setSnackMessage({
              color: 'error',
              message: error.message,
            })
          })
      }


    } else {
      if (name === '') {
        setState((prevState) => ({ ...prevState, errorEmptyName: 'e' }))
      }
    }
  }

  const cleanModal = () => {
    setVisible(false)
    setPreview(undefined)
    setState({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role === undefined ? '' : user.role._id,
      school: user.school === undefined ? '' : user.school._id,
      //isAdmin: user.isAdmin,
      errorEmptyName: 'v',
      errorEmptySchool: 'v',
      image: user.image,
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
          Editar perfil
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: '100%' }}>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid item xs={12}>
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
                        src={preview !== undefined ? preview : image}
                        sx={{
                          height: 120,
                          mb: 2,
                          width: 120,
                        }}
                      />
                    </Box>
                  </CardContent>
                  <Divider />
                  <CardActions style={{ justifyContent: 'center' }}>
                    <label htmlFor="contained-button-file">
                      <Input
                        accept="image/jpg, image/jpeg, image/png"
                        id="contained-button-file"
                        type="file"
                        onChange={saveFile}
                      />
                      <Button
                        variant="text"
                        component="span"
                        fullWidth
                        style={{ textTransform: 'none' }}
                      >
                        Cambiar imagen
                      </Button>
                    </label>
                  </CardActions>
                </Card>
              </Grid>
              <Grid item xs={12} sx={{ marginTop: '1rem' }}>
                <TextField
                  variant="standard"
                  size="small"
                  label="Nombre y apellido"
                  type="text"
                  value={name ?? ''}
                  autoComplete="current-name"
                  fullWidth
                  sx={{ mb: 1 }}
                  display="flex"
                  onChange={(e) => {
                    setState((prevState) => ({ ...prevState, name: e.target.value }))
                    e.target.value !== '' && e.target.value !== null
                      ? setState((prevState) => ({ ...prevState, errorEmptyName: 'v' }))
                      : setState((prevState) => ({ ...prevState, errorEmptyName: 'i' }))
                  }}
                  error={errorEmptyName === 'e' ? true : errorEmptyName === 'v' ? false : false}
                  color={errorEmptyName === 'v' ? 'success' : ''}
                  helperText={errorEmptyName === 'e' ? 'El nombre es obligatorio' : ''}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" style={{ textTransform: 'none' }} onClick={cleanModal}>
            Cerrar
          </Button>
          <Button
            variant="contained"
            style={{ textTransform: 'none' }}
            onClick={(e) => EditUser(e)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

ModalEditProfile.propTypes = {
  user: PropTypes.object,
  setUser: PropTypes.func,
  schools: PropTypes.array,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setOpenSnack: PropTypes.func,
  setSnackMessage: PropTypes.func,
}

export default ModalEditProfile
