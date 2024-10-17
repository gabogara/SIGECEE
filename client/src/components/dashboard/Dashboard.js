import React from "react";


/** MUI imports */
import { styled } from "@mui/material/styles";
import { Box, Grid, Typography } from "@mui/material";
import Featured from "./featured/Featured";
import "./dashboard.scss";
import { useSelector } from "react-redux";
import "@fontsource/montserrat/500.css";


const PREFIX = "Dashboard";

const classes = {
  root: `${PREFIX}-root`,
  commonWhite: `${PREFIX}-commonWhite`,
  oopsText: `${PREFIX}-oopsText`,
  notFoundText: `${PREFIX}-notFoundText`,
  backBtn: `${PREFIX}-backBtn`,
};

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  [`&.${classes.root}`]: {
    flexGrow: 1,
    width: "100%",
    height: "calc(100vh - 64px)",
    backgroundColor: "#ECECEC",
    [theme.breakpoints.down("md")]: {
      padding: "15px",
      height: "100%",
    },
    // [theme.breakpoints.down("lg")]: {
    //   height: "100%",
    // },
    padding: "30px",
    // [theme.breakpoints.up("md")]: {
    //   padding: 70,
    // },
    // [theme.breakpoints.up("xl")]: {
    //   padding: 115,
    // },
  },
}));

const Dashboard = () => {

  const todos = useSelector((state) => state.todos);

  return (
    <>
      <StyledContainer component="main" className={classes.root} >
        <DrawerHeader />
        <div className="homeContainer2">
          <Grid container sx={{ display: "flex", justifyContent: "left", textAlign: 'left', mt: 0, pl: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}> {/*fontFamily="Montserrat"*/}
              Bienvenido a SIGECEE,
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, ml: 1, }}>  {/*fontFamily="Montserrat"*/}
              {todos.userInfo.name}
            </Typography>
          </Grid>
          <Grid container sx={{ display: "flex", justifyContent: "left", textAlign: 'left', mt: 1, pl: 1 }}>
            <Typography variant="subtitle1"> {/*fontFamily="Montserrat"*/}
              Aquí podrás gestionar censos y encuestas, ejecutarlos en línea para obtener respuestas y posteriormente, generar estudios.
            </Typography>
          </Grid>
          <Grid container sx={{ display: "flex", justifyContent: "left", textAlign: 'left', mt: 2, pl: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}> {/*fontFamily="Montserrat"*/}¿Qué desea hacer?
            </Typography>
          </Grid>
          <Grid container>
            {todos.userInfo.role.alias === 'ADM' && <Featured type="usuarios" />}
            <Featured type="pregunta" />
            <Featured type="estructura" />
            <Featured type="poblacion" />
          </Grid>
          <Grid container>
            <Featured type="encuesta" />
            <Featured type="censo" />
            <Featured type="estudio" />
          </Grid>
        </div>
      </StyledContainer >
    </>
  );
};

export default Dashboard;
