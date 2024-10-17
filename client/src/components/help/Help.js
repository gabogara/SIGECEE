import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Help = ({ img, setVisible, visible, title }) => {
  return (
    <>
      {img && <Dialog
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="lg"
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
          {title}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                component="img"
                sx={{
                  display: "block",
                  width: '100%',
                }}
                alt="SIGECEE"
                src={img}
              />
            </Grid>
          </Grid>
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

Help.propTypes = {
  img: PropTypes.string,
  setVisible: PropTypes.func,
  visible: PropTypes.bool,
  title: PropTypes.string,
};

export default Help;
