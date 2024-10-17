/** React imports */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/** Icons 
import UCV from "../../assets/images/UCV.png";*/
import Ciencias from "../../assets/images/descarga.jpg";
import sigecee from "../../assets/images/sigecee_white_simple.png";
import "@fontsource/montserrat/500.css";

/** MUI icons */
import DashboardIcon from "@mui/icons-material/Dashboard";
import QuizIcon from "@mui/icons-material/Quiz";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import PieChartIcon from '@mui/icons-material/PieChart';
import Groups2Icon from '@mui/icons-material/Groups2';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import SupportIcon from '@mui/icons-material/Support';
//import MilitaryTechIcon from '@mui/icons-material/MilitaryTech'

/** MUI imports */
import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Link
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";

/** Components imports */
import ProfileDrop from "./AppHeaderDropdown";

const PREFIX = "NavBar";

const classes = {
  root: `${PREFIX}-root`,
  tooltip: `${PREFIX}-tooltip`,
  offset: `${PREFIX}-offset`,
  toolbar: `${PREFIX}-toolbar`,
  navbarLogo: `${PREFIX}-navbarLogo`,
  selectedItem: `${PREFIX}-selectedItem`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.offset}`]: theme.mixins.toolbar,

  [`& .${classes.root}`]: {
    display: "flex",
  },

  [`& .${classes.toolbar}`]: {
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0d47a1"
  },

  [`& .${classes.lastchild}`]: {
    marginLeft: "auto",
  },

  [`& .${classes.navbarLogo}`]: {
    display: "block",
    height: 18,

  },

  [`& .${classes.selectedItem}`]: {
    color: "#0d47a1",
    fontWeight: 600,
  },
}));

/** Global variables ----------------------------------------------------------- */
const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const NavBar = ({ window }) => {
  const navigate = useNavigate();

  /* React redux */
  const dispatch = useDispatch();

  const todos = useSelector((state) => state.todos);
  /** Component states */
  const [mobileOpen, setMobileOpen] = useState(false);

  const [openDrawer, setOpenDrawer] = useState(false);

  /** Component functions */
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
    setMobileOpen(false);
  };

  const handleDrawerMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  const selectMenuOption = (index) => {
    switch (index) {
      case 1:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlPrincipal",
        });
        navigate(`/dashboard`);
        break;
      case 2:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlUser",
        });
        navigate(`/users`);
        break;
      case 3:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlQuestion",
        });
        navigate(`/questions`);
        break;
      case 4:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlStruct",
        });
        navigate(`/structs`);
        break;
      case 5:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlPopulation",
        });
        navigate(`/populations`);
        break;
      case 6:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlCensus",
        });
        navigate(`/census`);
        break;
      case 7:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlSurvey",
        });
        navigate(`/surveys`);
        break;
      case 8:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlStudies",
        });
        navigate(`/studies`);
        break;
      case 9:
        dispatch({
          type: "ADD_SELECTED",
          payload: "ddlCredits",
        });
        navigate(`/credits`);
        break;
      default:
        break;
    }
  };

  const handleListItemClick = (index) => {
    handleDrawerClose();
    selectMenuOption(index);
    dispatch({ type: 'ADD_SELECTED_OPTION', payload: index });
  };

  const theme = useTheme();

  const listDrawer = (
    <List disablePadding>
      <ListItemButton
        key={"Ciencias"}
        sx={{ px: "5px", py: "12px", cursor: "default" }}
      >
        <ListItemIcon sx={{ my: "auto", mx: "auto", minWidth: 40 }}>
          <Avatar src={Ciencias} />
        </ListItemIcon>
      </ListItemButton>

      <ListItemButton
        key={"Principal"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlPrincipal"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(1)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Inicio" />
      </ListItemButton>
      {todos.userInfo.role.alias === 'ADM' && <ListItemButton
        key={"Management"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlUser"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(2)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <SupervisorAccountIcon />
        </ListItemIcon>
        <ListItemText primary="Gestión de usuarios" />
      </ListItemButton>}
      <ListItemButton
        key={"Questions"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlQuestion"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(3)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <QuestionMarkIcon />
        </ListItemIcon>
        <ListItemText primary="Banco de preguntas" />
      </ListItemButton>
      <ListItemButton
        key={"Structs"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlStruct"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(4)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <QuizIcon />
        </ListItemIcon>
        <ListItemText primary="Estructuras base" />
      </ListItemButton>
      <ListItemButton
        key={"Populations"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlPopulation"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(5)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <TravelExploreIcon />
        </ListItemIcon>
        <ListItemText primary="Poblaciones" />
      </ListItemButton>
      <ListItemButton
        key={"Surveys"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlSurvey"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(7)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <FactCheckIcon />
        </ListItemIcon>
        <ListItemText primary="Encuestas" />
      </ListItemButton>
      <ListItemButton
        key={"Census"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlCensus"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(6)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <Groups2Icon />
        </ListItemIcon>
        <ListItemText primary="Censos" />
      </ListItemButton>
      <ListItemButton
        key={"Studies"}
        sx={{ px: "17px", py: "12px" }}
        className={
          todos.selected === "ddlStudies"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(8)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <PieChartIcon />
        </ListItemIcon>
        <ListItemText primary="Estudios" />
      </ListItemButton>
      <Link href="/doc/ManualUsuario.pdf" target="_blank" sx={{
        fontWeight: 600,
        fontSize: 14,
        fontFamily: "Roboto",
        textDecoration: 'none',
        color: '#202020'
      }} >
        <ListItemButton
          key={"Support"}
          sx={{ px: "17px", py: "12px" }}
          className={"submenuSis"}
        >
          <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
            <SupportIcon />
          </ListItemIcon>
          Manual de usuario
          {/* <ListItemText primary="Manual de usuario" /> */}
        </ListItemButton>
      </Link>
      {/* <ListItemButton
        key={"Credits"}
        sx={{ p: "17px" }}
        className={
          todos.selected === "ddlCredits"
            ? "navBarOptionSelected submenuSis"
            : "submenuSis"
        }
        onClick={() => handleListItemClick(9)}
      >
        <ListItemIcon sx={{ my: "auto", minWidth: 40 }}>
          <MilitaryTechIcon />
        </ListItemIcon>
        <ListItemText primary="Créditos" />
      </ListItemButton> */}
    </List>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root className={classes.root}>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <Box sx={{
            display: "flex",
            verticalAlign: 'middle',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Box
              component="img"
              className={classes.navbarLogo}
              alt="SIGECEE"
              src={sigecee}
            />
            <Typography
              variant="subtitle1"
              noWrap
              component="a"
              href="/"
              sx={{
                display: { xs: 'none', md: 'flex' },
                //fontFamily: 'Montserrat',
                color: 'inherit',
                textDecoration: 'none',
                ml: 3,
                alignSelf: 'center'
              }}
            >
              Sistema para la Gestión de Censos, Encuestas y Estudios de la Facultad de Ciencias UCV
            </Typography></Box>

          <Box sx={{ display: "flex", }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerMobile}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>
            {/*<Typography sx={{ fontWeight: '600', color: '#fff', ml: 1}}>Gestión de censos, encuestas y estudios</Typography>*/}
          </Box>
          <ProfileDrop className={classes.lastchild} />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
      >
        <MuiDrawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerMobile}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          {listDrawer}
        </MuiDrawer>
        <Drawer
          variant="permanent"
          open={openDrawer}
          PaperProps={{
            onMouseEnter: handleDrawerOpen,
            onMouseLeave: handleDrawerClose,
          }}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
          {listDrawer}
        </Drawer>
      </Box>
    </Root>
  );
};

export default NavBar;
