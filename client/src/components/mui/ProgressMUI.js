import * as React from 'react'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function SimpleBackdrop({ open }) {
  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }} open={open}>
        <Grid container justifyContent='center' spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress color="inherit" fontSize="large" />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6">
              Cargando
            </Typography>
          </Grid>
        </Grid>



      </Backdrop>
    </>
  )
}

SimpleBackdrop.propTypes = {
  open: PropTypes.bool,
}
