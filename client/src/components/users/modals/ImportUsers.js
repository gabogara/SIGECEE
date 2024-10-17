import React, { useState, useCallback, useMemo } from "react";
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
  Link
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

const ImportUsers = ({
  visible,
  setVisible,
  setOpenSnack,
  snackMessage,
  setSnackMessage,
  setProgress,
  setResult,
}) => {
  const todos = useSelector((state) => state.todos);
  const [uploadFile, setUploadFile] = useState(null);

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

  const Import = async () => {
    setProgress(true);
    const wb = read(uploadFile);
    const data_file = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    var massive_users = {
      data: data_file,
      createdBy: todos.userInfo._id,
    };

    await Api.post("/user/massive", massive_users)
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
          Importar usuarios masivo
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ width: "100%", marginTop: 2, marginBottom: 2 }}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12}>
                <ol>
                  <li style={{ marginBottom: 10 }}> Descarga la plantilla en Excel <Link href="/doc/Plantilla_usuarios_masivo.xlsx" target="_blank" download>aquí</Link>.</li>
                  <li style={{ marginBottom: 10 }}>Ingresa los datos de los usuarios a importar en el archivo Excel.</li>
                  <li style={{ marginBottom: 10 }}>Suba el archivo Excel de usuarios.</li>
                </ol>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <div {...getRootProps({ style })}>
                  <input {...getInputProps()} />
                  <UploadFileIcon fontSize="large" />
                  <p>Arrastra hasta aquí el archivo Excel de usuarios</p>
                </div>
                <aside>
                  <h4>Archivo cargado</h4>
                  <ul>{files}</ul>
                </aside>
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
            onClick={Import}
          >
            Importar usuarios
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ImportUsers.propTypes = {
  visible: PropTypes.bool,
  setVisible: PropTypes.func,
  setOpenSnack: PropTypes.func,
  snackMessage: PropTypes.object,
  setSnackMessage: PropTypes.func,
  setProgress: PropTypes.func,
  setResult: PropTypes.func,
};

export default ImportUsers;
