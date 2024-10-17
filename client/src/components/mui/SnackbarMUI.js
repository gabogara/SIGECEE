import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import PropTypes from 'prop-types'

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function CustomizedSnackbars({ open, setOpenSnack, message, color }) {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={open}
      autoHideDuration={4000}
      onClose={() => setOpenSnack(false)}
    >
      <Alert onClose={() => setOpenSnack(false)} severity={color} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
CustomizedSnackbars.propTypes = {
  open: PropTypes.bool,
  setOpenSnack: PropTypes.func,
  message: PropTypes.string,
  color: PropTypes.string,
}
