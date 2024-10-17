import React from "react";
import { PieChart } from "@mui/icons-material";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled, alpha } from '@mui/material/styles';
import CustomTooltip from "../mui/CustomTooltip";
import SettingsIcon from '@mui/icons-material/Settings';
import NewspaperIcon from '@mui/icons-material/Newspaper';
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

const RowMenu = ({ row, setInfo, reduxInfo, setInstData, setValue, setVisible }) => {
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
        {row.result_count > 0 && 
          <MenuItem onClick={() => {
            setInstData(row)
            setValue(2)
            handleClose()
            /*
            setValue(2)*/
          }} disableRipple>
            <PieChart />
            Configuración de estudio
          </MenuItem>
        }
        {row.result_count > 0 && row.study_count === 1 && row.blog_count === 0 && reduxInfo.role.alias !== 'INV' && 
          <MenuItem onClick={() => {
            setInstData(row)
            setVisible(true)
            handleClose()
            //setValue(1)
            /*
            setValue(2)*/
          }} disableRipple>
            <NewspaperIcon />
            Publicar estudio en pág. principal
          </MenuItem>
        }
        {row.blog_count >= 1 && reduxInfo.role.alias !== 'INV' &&
          <MenuItem onClick={() => {
            console.log(row)
            setInfo(row.ins_type, row._id)
            handleClose()
          }} disableRipple>
            <SettingsIcon />
            Editar configuración de publicación en pág. principal
          </MenuItem>
        }
      </StyledMenu>

    </>
  );
}

export default RowMenu;