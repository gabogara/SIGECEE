import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import 'dayjs/locale/es';
import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  IconButton,
  TextField,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Slide,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "survey-core/defaultV2.min.css";
import Api from "../../../services/Api";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import 'moment/locale/es';

const initialState = {
  id: "",
  title: "",
  description: "",
  ins_type: "",
  image: "",
  errorEmptyTitle: "v",
  errorEmptyDesc: "v",
  errorEmptyImg: "v",
};



const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#818181",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const PostEdit = ({
  data,
  setVisible,
  visible,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  setdataTable,
  setValue,
  setdataTable2,
}) => {
  const [
    { _id, title, description, ins_type, image, errorEmptyTitle,
      errorEmptyDesc,
      errorEmptyImg, },
    setState,
  ] = useState(initialState)
  const todos = useSelector((state) => state.todos);
  const [uploadFile, setUploadFile] = useState(null);
  const [valueQuill, setValueQuill] = useState('');
  const [file, setFile] = useState()
  const [preview, setPreview] = useState()

  useEffect(() => {
    //console.log('data.isAdmin' + user.isAdmin)
    setState(() => ({
      _id: data._id,
      title: data.title,
      description: data.description,
      ins_type: data.ins_type,
      image: data.image
    }));
    setValueQuill(data.text)
    if (!file) {
      setPreview(undefined)
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [file, data])

  const cleanModal = async () => {
    setVisible(false)
    setState(initialState)
    setPreview(undefined)
    setFile(undefined)
    setValueQuill('')
    acceptedFiles.splice(acceptedFiles.indexOf(uploadFile), 1);
    /*setState(initialState);
    setCensusData({});*/
  };

  const edit = async (e) => {
    setProgress(true)
    if (title.trim() !== "" && description.trim() !== "") {
      const formData = new FormData()
      formData.append('_id', _id)
      formData.append('title', title)
      formData.append('text', valueQuill)
      formData.append('description', description)
      if (uploadFile) {
        if ((uploadFile.size / 1024 < 3000)) {
          formData.append('image', uploadFile)
        } else {
          setProgress(false)
          setSnackMessage({
            color: "error",
            message: 'La imagen supera el límite de carga de 3 MB, selecciona otra imagen con menor peso.',
          });
          setOpenSnack(true);
          return
        }
      }

      await Api.post("/blog/edit", formData)
        .then(async (res) => {
          setOpenSnack(true);
          setSnackMessage({
            ...snackMessage,
            color: "success",
            message: res.data.message,
          });
          await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
            .then(async (res) => {
              setdataTable(res.data.studies)
              await Api.get('/blog/entries')
                .then((res) => {
                  setdataTable2(res.data.entry)
                  setVisible(false)
                  setProgress(false);
                  setValue(1)
                })
                .catch((error) => {
                  console.error('Error:', error.message)
                })
            })
            .catch((error) => {
              console.error('Error:', error.message)
            })
        })
        .catch((error) => {
          setSnackMessage({
            color: "error",
            message: error.response.data.message,
          });
          setOpenSnack(true);
        });
    } else {
      if (title === "") {
        setState((prevState) => ({ ...prevState, errorEmptyTitle: "e" }));
      }
      if (description === "") {
        setState((prevState) => ({ ...prevState, errorEmptyDesc: "e" }));
      }
      if (!uploadFile) {
        setState((prevState) => ({ ...prevState, errorEmptyImg: "e" }));
      }
    }
    setProgress(false)
  };


  const onDrop = useCallback((acceptedFiles) => {
    setUploadFile(acceptedFiles[0]);
    setFile(acceptedFiles[0])
    setState((prevState) => ({
      ...prevState,
      errorEmptyImg: "",
    }))
    // const reader = new FileReader();
    // reader.onabort = () => console.log("file reading was aborted");
    // reader.onerror = () => console.log("file reading has failed");
    // reader.onload = () => {
    //   // Do whatever you want with the file contents

    // };
    //reader.readAsArrayBuffer(acceptedFiles[0]);
  }, []);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxFiles: 1,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'color': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link',],
    ],
  }

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'color'
  ]

  return (
    <>
      <Dialog
        fullScreen
        open={visible}
        onClose={cleanModal}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#0d47a1' }}>
          <Toolbar>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Editar publicación de estudio en página principal
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={cleanModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>

            <Grid container spacing={10}>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      variant="standard"
                      label="Título de la publicación"
                      type="text"
                      value={title}
                      autoComplete="current-title"
                      fullWidth
                      display="flex"
                      onChange={(e) => {
                        setState((prevState) => ({
                          ...prevState,
                          title: e.target.value,
                        }));
                        e.target.value !== "" && e.target.value !== null
                          ? setState((prevState) => ({
                            ...prevState,
                            errorEmptyTitle: "v",
                          }))
                          : setState((prevState) => ({
                            ...prevState,
                            errorEmptyTitle: "i",
                          }));
                      }}
                      error={errorEmptyTitle === "e" ? true : false}
                      color={errorEmptyTitle === "v" ? "success" : ""}
                      helperText={
                        errorEmptyTitle === "e"
                          ? "El nombre de la publicación es obligatorio"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      id="standard-multiline-static"
                      label="Descripción corta de la publicación"
                      multiline
                      rows={2}
                      fullWidth
                      variant="standard"
                      value={description}
                      onChange={(e) => {
                        setState((prevState) => ({
                          ...prevState,
                          description: e.target.value,
                        }));
                        e.target.value !== "" && e.target.value !== null
                          ? setState((prevState) => ({
                            ...prevState,
                            errorEmptyDesc: "v",
                          }))
                          : setState((prevState) => ({
                            ...prevState,
                            errorEmptyDesc: "i",
                          }));
                      }}
                      error={errorEmptyDesc === "e" ? true : false}
                      color={errorEmptyDesc === "v" ? "success" : ""}
                      helperText={
                        errorEmptyDesc === "e"
                          ? "La descripción corta de la publicación es obligatoria"
                          : ""
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <div {...getRootProps({ style })}>
                        <input {...getInputProps()} />
                        <UploadFileIcon fontSize="large" />
                        <p>Arrastra hasta aquí la imagen de la publicación</p>
                      </div>
                      <aside>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
                          Archivo cargado {errorEmptyImg === "e" && (
                            <Typography variant="caption" sx={{ color: 'red' }}>
                              Imagen requerida
                            </Typography>
                          )}
                        </Typography>
                        <ul>{files}</ul>
                      </aside>
                    </Grid>
                  </Grid>
                </Grid>

              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Vista previa
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <div className='listItem-wrap'>
                      <img src={preview !== undefined ? preview : image} alt='' />
                      <header>
                        <p>
                          <Typography component="h2" variant="h6">
                            {title}</Typography>
                          {moment().format('DD MMM YYYY')}
                        </p>
                        <span>{ins_type}</span>
                      </header>
                      <footer>
                        <p>
                          <br></br>
                          <Typography variant="subtitle2" paragraph>
                            {description}
                          </Typography>
                          <br></br>
                          {/* <Typography variant="subtitle2" color="primary">
          <a href={url} target="_blank" rel="noopener noreferrer" >Leer más...</a>
        </Typography> */}

                        </p>
                      </footer>
                    </div>
                  </Grid>
                </Grid>

              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Detalle de la descripción
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <ReactQuill theme="snow" value={valueQuill} onChange={setValueQuill} modules={modules}
                  formats={formats} />
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
            onClick={edit}
          >
            Editar
          </Button>
        </DialogActions>
      </Dialog >
    </>
  );
};
export default PostEdit;

PostEdit.propTypes = {
  data: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  setdataTable: PropTypes.func,
  setValue: PropTypes.func,
  setdataTable2: PropTypes.func,
};
