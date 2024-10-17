import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Box,
  IconButton,
  ListItemIcon,
  Zoom,
  Tooltip,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import NewspaperIcon from '@mui/icons-material/Newspaper';
import { tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}))

const AppHeaderDropdown = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const todos = useSelector((state) => state.todos);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const LogoutUser = () => {
    navigate("/login");
    dispatch({ type: "USER_LOGOUT" });
    sessionStorage.removeItem("option");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <>
          <BootstrapTooltip title="Ir a la página principal" transitioncomponent={Zoom}>
            <IconButton
              onClick={() => navigate("/")}
              size="small"
              transitioncomponent={Zoom}
              sx={{ color: 'white' }}
            >

              <NewspaperIcon />
            </IconButton>
          </BootstrapTooltip>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            transitioncomponent={Zoom}
          >

            <Avatar src={todos.userInfo.image} />
          </IconButton>
        </>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem component={Link} to="/profile">
          <Avatar sx={{ bgcolor: '#0d47a1' }}>
            <small>{todos.userInfo.name[0]}</small>
          </Avatar>
          Mi perfil
        </MenuItem>
        <Divider />
        <MenuItem onClick={LogoutUser}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
};

export default AppHeaderDropdown;
