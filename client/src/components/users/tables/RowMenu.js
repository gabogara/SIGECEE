import React from "react";
import { Edit, Delete, Search, Block, CheckCircleOutline, Password } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';
import CustomTooltip from "../../mui/CustomTooltip";
const ITEM_HEIGHT = 48;

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    cursor: "pointer",
    fontSize: 12,
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 5px 7px -1px, rgba(0, 0, 0, 0.05) 0px 2px 3px -1px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      fontSize: 14,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        cursor: "pointer",
        ":hover": {
          cursor: "pointer",
        },
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const RowMenu = ({ row, setInfo, setAccionChangeStatus }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}

      >
        <CustomTooltip title="Ver acciones" content={(
          <MoreVertIcon sx={{
            ":hover": {
              cursor: "pointer"
            },
          }} />
        )} />
      </IconButton>

      <StyledMenu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            //width: '20ch',
          },
        }}
      >
        <MenuItem onClick={() => {
          setInfo(row._id, 'view');
          handleClose()
        }} disableRipple>
          <Search />
          Ver
        </MenuItem>
        <MenuItem onClick={() => {
          setInfo(row._id, 'edit');
          handleClose()
        }} disableRipple>
          <Edit />
          Editar
        </MenuItem>
        <MenuItem onClick={() => {
          setInfo(row._id, 'recover');
          handleClose()
        }} disableRipple>
          <Password />
          Restablecer contraseña
        </MenuItem>
        <MenuItem onClick={() => {
          setInfo(row._id, 'change');
          let text = row.status === 0 ? "Desbloquear" : "Bloquear"
          setAccionChangeStatus(text);
          handleClose()
        }} disableRipple>
          {row.status === 0 ? <CheckCircleOutline /> : <Block />}
          {row.status === 0 ? "Desbloquear acceso" : "Bloquear acceso"}
        </MenuItem>
        <MenuItem onClick={() => {
          setInfo(row._id, 'delete');
          handleClose()
        }} disableRipple>
          <Delete />
          Borrar
        </MenuItem>
      </StyledMenu>

    </>
  );
}
export default RowMenu;