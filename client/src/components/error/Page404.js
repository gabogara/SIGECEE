import React from 'react';
import { Link } from "react-router-dom";

/** MUI imports */
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Grid,
  Typography,
} from '@mui/material';

const PREFIX = 'Error';

const classes = {
  root: `${PREFIX}-root`,
  commonWhite: `${PREFIX}-commonWhite`,
  oopsText: `${PREFIX}-oopsText`,
  notFoundText: `${PREFIX}-notFoundText`,
  backBtn: `${PREFIX}-backBtn`
};

const StyledContainer = styled(Box)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    height: '100vh',
    [theme.breakpoints.up('xs')]: {
      padding: '60px 30px',
    },
    [theme.breakpoints.up('md')]: {
      padding: 70
    },
    [theme.breakpoints.up('xl')]: {
      padding: 115
    },
  },

  [`& .${classes.oopsText}`]: {
    [theme.breakpoints.up('xs')]: {
      fontSize: 40,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 50,
    }
  },

  [`& .${classes.notFoundText}`]: {
    color: '#000',
    [theme.breakpoints.up('xs')]: {
      fontSize: 20,
    },
    [theme.breakpoints.up('md')]: {
      fontSize: 25,
    }
  },

  [`& .${classes.backBtn}`]: {
    marginTop: 60,
    borderRadius: 40,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 18,
    '&:hover': {
      backgroundColor: '#1565c0',
      color: '#fff',
    },
  }
}));

const Error404 = () => {
  return (
    <StyledContainer component="main" className={classes.root}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" color="info" align="center" className={classes.oopsText}>
            Oops
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" color="info" align="center" className={classes.notFoundText}>
            Página no encontrada
          </Typography>
        </Grid>
        <Grid item>
          <Button component={Link} to="/" disableElevation variant="contained" color="info" className={classes.backBtn}    >
            Regresar
          </Button>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default Error404;
