import React from 'react';
import { Link } from "react-router-dom";

/** MUI imports */
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import background from "../../../assets/images/mural.jpg";

const PREFIX = 'Participado';

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

const SurveyDone = () => {
  return (
    <StyledContainer component="main" className={classes.root}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundImage: `url(${background})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          alignContent: "center",
          height: "100vh",
          position: 'fixed',
          bottom: 0,
        }}
      >
        <Grid item xs={12} md={7} lg={5} sx={{ justifyContent: 'center', alignItems: 'center' }} >
          <Card sx={{ pt: 3.7, pb: 0.7, px: 7 }}>
            <CardContent>
              <Grid container justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h5" color="info" align="center" className={classes.oopsText}>
                    ¡Vaya!
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5" color="info" align="center" className={classes.notFoundText}>
                    Ya has participado en esta encuesta.
                  </Typography>
                </Grid>
                <Grid item>
                  <Button component={Link} to="/" disableElevation variant="contained" color="info" className={classes.backBtn}    >
                    Regresar
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default SurveyDone;
