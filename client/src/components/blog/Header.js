import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Drawer,
  CssBaseline,
  Typography
} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Fade from '@mui/material/Fade';
import Logo from "../../assets/images/sigecee_white_simple.png";
import LogoBlue from "../../assets/images/sigecee_blue_simple.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const drawerWidth = 240;
const pages = ['Acerca de', 'Funcionalidades', 'Publicaciones', 'Créditos'];

function Header(props) {

  const { executeScrollAbout, executeScrollFunc, executeScrollPosts, showItems, executeScrollCredits } = props;

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { window } = props;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  /* React redux */
  const dispatch = useDispatch();

  const drawer = (
    <Box sx={{ textAlign: 'center' }}>
      <Box
        component="img"
        sx={{
          height: 20,
          my: 2,
          ":hover": {
            cursor: 'pointer',
          },
        }}
        alt="SIGECEE"
        src={LogoBlue}
        onClick={() => navigate(`/`)}
      />
      <Divider />
      <List>
        {showItems && pages.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => handleRouting(item)}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleRouting = (page) => {
    if (page === 'Acerca de') {
      executeScrollAbout();
    }
    if (page === 'Funcionalidades') {
      executeScrollFunc();
    }
    if (page === 'Publicaciones') {
      executeScrollPosts();
    }
    if (page === 'Créditos') {
      executeScrollCredits();
    }
  }

  const goToLogin = () => {
    dispatch({
      type: "ADD_SELECTED",
      payload: "ddlPrincipal",
    });
    navigate(`/login`)
  }

  function ScrollTop(props) {
    const { children, window } = props;
    // Note that you normally won't need to set the window ref as useScrollTrigger
    // will default to window.
    // This is only being set here because the demo is in an iframe.
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
      disableHysteresis: true,
      threshold: 100,
    });

    const handleClick = (event) => {
      const anchor = (event.target.ownerDocument || document).querySelector(
        '#back-to-top-anchor',
      );

      if (anchor) {
        anchor.scrollIntoView({
          block: 'center',
        });
      }
    };

    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          {children}
        </Box>
      </Fade>
    );
  }

  ScrollTop.propTypes = {
    children: PropTypes.element.isRequired,
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "black" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="img"
            sx={{
              height: 20,
              mr: 2,
              // minWidth: '125px'
              ":hover": {
                cursor: 'pointer',
              },
            }}
            alt="SIGECEE"
            src={Logo}
            onClick={() => navigate(`/`)}
          />
          {showItems && <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {pages.map((item) => (
              <Button key={item} sx={{ color: '#fff', textTransform: 'none', fontFamily: 'Montserrat', mx: 1.5 }} onClick={() => handleRouting(item)}>
                {item}
              </Button>
            ))}

          </Box>}
          {!showItems && <Typography
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
          </Typography>}
          <Tooltip title="Iniciar sesión">
            <Button variant="contained" size="small" color="info" onClick={goToLogin} sx={{ fontFamily: 'Montserrat', textTransform: "none", ml: "auto" }}>
              Acceder
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >

          {drawer}
        </Drawer>
      </Box>
      <ScrollTop {...props}>
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
}

export default Header;
