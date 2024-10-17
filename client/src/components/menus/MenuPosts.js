import React from "react";
import { Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';
import CustomTooltip from "../mui/CustomTooltip";
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

const RowMenu = ({ row, setInfo, reduxInfo, changeStatus }) => {
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
        {/* <MenuItem onClick={() => {
          setInfo(row._id, 2);
          handleClose()
        }} disableRipple>
          <Search />
          Ver
        </MenuItem> */}
        {((reduxInfo.role.alias !== 'INV' && (reduxInfo._id.toString() === row.createdById.toString())) || (reduxInfo.role.alias === 'ADM')) && 
          <MenuItem onClick={() => { 
            setInfo(row._id, 1)
            handleClose()
            }} disableRipple>
            <Edit />
            Editar
          </MenuItem>
        }
        {((reduxInfo.role.alias !== 'INV' && (reduxInfo._id.toString() === row.createdById.toString())) || (reduxInfo.role.alias === 'ADM')) && 
          <MenuItem onClick={() => {
            changeStatus(row._id, row.status === 1 ? 0 : 1)
            handleClose()
          }} disableRipple>
            {row.status === 1 ? <VisibilityOff /> : <Visibility />}
            {row.status === 1 ? 'Ocultar en la pág. principal' : "Colocar visible en la pág. principal"}
          </MenuItem>
        }
        {((reduxInfo._id.toString() === row.createdById.toString()) || (reduxInfo.role.alias === 'ADM')) &&
          <MenuItem onClick={() => {
            setInfo(row._id, 2)
            handleClose()
          }} disableRipple>
            <Delete />
            Borrar
          </MenuItem>
        }
      </StyledMenu>

    </>
  );
}


// {(todos.userInfo.role.alias !== 'INV') && <span>
//               <BootstrapTooltip title="Editar" transitioncomponent={Zoom}>
//                 <Edit
//                   sx={{ cursor: 'pointer', paddingLeft: 0.5 }}
//                   fontSize="small"
//                   onClick={() => { setInfo(entry._id, 1) }}
//                 />
//               </BootstrapTooltip>
//             </span>}
//             {(todos.userInfo.role.alias !== 'INV') && <span className="ps-2">
//               <BootstrapTooltip
//                 title={entry.status === 1 ? 'Ocultar en la pág. principal' : 'Colocar visible en la pág. principal'}
//                 transitioncomponent={Zoom}
//               >
//                 {entry.status === false ? (
//                   <Visibility
//                     sx={{ cursor: 'pointer' }}
//                     fontSize="small"
//                     onClick={() => {
//                       changeStatus(entry._id, entry.status === 1 ? 0 : 1)
//                     }}
//                   />
//                 ) : (
//                   <VisibilityOff
//                     sx={{ cursor: 'pointer' }}
//                     fontSize="small"
//                     onClick={() => {
//                       changeStatus(entry._id, entry.status === 1 ? 0 : 1)
//                     }}
//                   />
//                 )}
//               </BootstrapTooltip>
//             </span>}
//             {(todos.userInfo.role.alias !== 'INV') && <span className="ps-2">
//               <BootstrapTooltip title="Borrar" transitioncomponent={Zoom}>
//                 <Delete
//                   sx={{ cursor: 'pointer' }}
//                   fontSize="small"
//                   onClick={() => { setInfo(entry._id, 2) }}
//                 />
//               </BootstrapTooltip>
//             </span>}

export default RowMenu;