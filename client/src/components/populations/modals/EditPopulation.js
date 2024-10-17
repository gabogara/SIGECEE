import React, { useState, useCallback, useMemo, useEffect } from "react";
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
} from "@mui/material";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { useDropzone } from "react-dropzone";
import { read, utils } from "xlsx";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Api from "../../../services/Api";

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

const initialState = {
  _id: "",
  name: "",
  errorEmptyName: "i",
  description: "",
  errorEmptyDesc: "i",
};

const EditPopulation = ({
  populationData,
  visible,
  setVisible,
  setOpenSnack,
  snackMessage,
  setSnackMessage,
  setProgress,
  setResult,
}) => {
  const todos = useSelector((state) => state.todos);
  const [{ _id, name, errorEmptyName, description, errorEmptyDesc }, setState] =
    useState(initialState);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    (async () => {

      setState((prevState) => ({
        ...prevState,
        _id: populationData._id,
        name: populationData.name,
        errorEmptyName: "v",
        description: populationData.description,
        errorEmptyDesc: "v",
      }));

    })();
  }, [populationData]);

  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      setUploadFile(reader.result);
      /**/
    };
    reader.readAsArrayBuffer(acceptedFiles[0]);
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
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
  });

  const cleanModal = () => {
    setVisible(false);
    acceptedFiles.splice(acceptedFiles.indexOf(uploadFile), 1);
  };

  const Edit = async () => {
    setProgress(true);
    if (name.trim() !== "" && description.trim() !== "") {
      var edit_population = {}
      if (uploadFile !== null) {
        const wb = read(uploadFile);
        const data_file = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

        edit_population = {
          _id: _id,
          name: name,
          description: description,
          data: data_file,
          updatedBy: todos.userInfo._id,
        };
      } else {
        edit_population = {
          _id: _id,
          name: name,
          description: description,
          updatedBy: todos.userInfo._id,
        };
      }

      await Api.post("/population/edit", edit_population)
        .then(async (res) => {
          cleanModal();
          setOpenSnack(true);
          setSnackMessage({
            ...snackMessage,
            color: "success",
            message: res.data.message,
          });
          await Api.get("/population/all?roleA=" + todos.userInfo.role.alias + '&schoolA=' + todos.userInfo.school.alias + '&key=' + todos.userInfo._id + '&schoolI=' + todos.userInfo.school._id).then((res) => {
            setResult(res.data.populations);
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
      if (name.trim() === "") {
        setState((prevState) => ({ ...prevState, errorEmptyName: "e" }));
      }
      if (description.trim() === "") {
        setState((prevState) => ({ ...prevState, errorEmptyDesc: "e" }));
      }
    }
    setProgress(false);
  };

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
          Editar población
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <TextField
                  variant="standard"
                  size="small"
                  label="Nombre de la población"
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
                    errorEmptyName === "e"
                      ? "El nombre de la población es obligatorio"
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-multiline-static"
                  label="Descripción de la población"
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
                  helperText={
                    errorEmptyDesc === "e"
                      ? "La descripción corta de la población es obligatoria"
                      : ""
                  }
                  error={errorEmptyDesc === "e" ? true : false}
                  color={errorEmptyDesc === "v" ? "success" : ""}
                />
              </Grid>
              {populationData.census_count === 0 && populationData.surveys_count === 0 && <Grid item xs={12} sx={{ mt: 2 }}>
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  <UploadFileIcon fontSize="large" />
                  <p>Arrastra hasta aquí el archivo Excel de la población</p>
                </div>
                <aside>
                  <h4>Archivo cargado</h4>
                  <ul>{files}</ul>
                </aside>
              </Grid>}
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
            onClick={Edit}
          >
            Editar población
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EditPopulation.propTypes = {
  populationData: PropTypes.object,
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
  setResult: PropTypes.func,
};

export default EditPopulation;
