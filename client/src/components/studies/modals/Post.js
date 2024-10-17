import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import 'dayjs/locale/es';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  TextField,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "survey-core/defaultV2.min.css";
import Api from "../../../services/Api";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";

const initialState = {
  title: "",
  description: "",
};

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

const Post = ({
  data,
  setVisible,
  visible,
  setSnackMessage,
  setOpenSnack,
  snackMessage,
  setProgress,
  setdataTable,
  setValue
}) => {
  const [
    {
      title,
      description,
    },
    setState,
  ] = useState(initialState);
  const todos = useSelector((state) => state.todos);
  const [uploadFile, setUploadFile] = useState(null);
  // useEffect(() => {
  //   (async () => {
  //     if (Object.keys(surveyData).length !== 0) {
  //       setState((prevState) => ({
  //         ...prevState,
  //         name: surveyData.data.title ?? "",
  //         description: surveyData.data.description ?? "",
  //         type: surveyData.type ?? "",
  //         finish_date: surveyData.endDate ?? null,
  //         population: surveyData.population ?? '',
  //         field_email: surveyData.emailField ?? '',
  //       }));
  //       setLink(surveyData.link ?? '')
  //       if (surveyData.population) {
  //         setSelect(
  //           populations.filter(
  //             (element) => element._id === surveyData.population
  //           )
  //         );
  //       }
  //     }
  //   })();
  // }, [surveyData, setState, populations]);

  const cleanModal = async () => {
    setVisible(false)
    acceptedFiles.splice(acceptedFiles.indexOf(uploadFile), 1);
    /*setState(initialState);
    setCensusData({});*/
  };

  const publish = async (e) => {
    setProgress(true)
    if (title.trim() !== "" && description.trim() !== "" && uploadFile) {
      const formData = new FormData()
      formData.append('image', uploadFile)
      formData.append('title', title)
      formData.append('description', description)
      formData.append('createdBy', todos.userInfo._id,)
      formData.append('ins_type', data.ins_type)
      formData.append('ins_id', data._id)

      await Api.post("/blog/add", formData)
        .then(async (res) => {
          setOpenSnack(true);
          setSnackMessage({
            ...snackMessage,
            color: "success",
            message: res.data.message,
          });
          await Api.get('/study/all?roleA=' + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id)
            .then((res) => {
              setdataTable(res.data.studies)
              setProgress(false);
              setOpenSnack(true)
              setSnackMessage({ ...snackMessage, color: 'success', message: res.data.message })
              setValue(0)
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
      // if (title === "") {
      //   setState((prevState) => ({ ...prevState, errorEmptyTitle: "e" }));
      // }
      // if (errorEmptyFieldDate === "") {
      //   setState((prevState) => ({ ...prevState, errorEmptyFieldDate: "e" }));
      // }
    }
    setProgress(false)
  };


  const onDrop = useCallback((acceptedFiles) => {
    setUploadFile(acceptedFiles[0]);
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

  return (
    <>
      <Dialog
        open={visible}
        onClose={cleanModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="md"
        fullWidth
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
          Publicar estudio en el blog
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  label="Título de entrada del blog"
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
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-multiline-static"
                  label="Descripción de entrada del blog"
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
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <div {...getRootProps({ style })}>
                    <input {...getInputProps()} />
                    <UploadFileIcon fontSize="large" />
                    <p>Arrastra hasta aquí la imagen de entrada del blog</p>
                  </div>
                  <aside>
                    <h4>Archivo cargado</h4>
                    <ul>{files}</ul>
                  </aside>
                </Grid>
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
            onClick={publish}
          >
            Publicar estudio en blog
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default Post;

Post.propTypes = {
  data: PropTypes.object,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  setSnackMessage: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setProgress: PropTypes.func,
  setdataTable: PropTypes.func,
  setValue: PropTypes.func,
};
