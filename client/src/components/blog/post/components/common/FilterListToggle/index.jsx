import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, Typography } from '@mui/material';
import { styled } from "@mui/material/styles";
import ButtonBase from "@mui/material/ButtonBase";

const ImageButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  height: 80,
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 50,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },

}));



const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.common.white,
}));

const ImageBackdrop = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundColor: theme.palette.common.black,
  opacity: 0.4,
  transition: theme.transitions.create("opacity"),
}));

const ImageMarked = styled("span")(({ theme }) => ({
  height: 3,
  width: 18,
  backgroundColor: theme.palette.common.white,
  position: "absolute",
  bottom: -2,
  left: "calc(50% - 9px)",
  transition: theme.transitions.create("opacity"),
}));

const ImageSrc = styled("span")({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: "cover",
  backgroundPosition: "center 40%",
});

const FilterListToggle = ({ options, value, selectToggle }) => {

  return (
    <>
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={selectToggle}
      orientation="vertical"
      className="root"
      
    >
      {options.map(({ label, id, value,url }) => (
      
        <ToggleButton  key={id} value={value}>
          <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        minWidth: 171,
        width: "100%",
        mb: 2,
      }}
    >
      <ImageButton
        focusRipple
        key={id}
        style={{
          width: "100%",
        }}
      >
        <ImageSrc style={{ backgroundImage: `url(${url})` }} />
        <ImageBackdrop className="MuiImageBackdrop-root" />
        <Image>
          <Typography
            component="span"
            variant="subtitle1"
            color="inherit"
            sx={{
              fontFamily: "Montserrat",
              position: "relative",
              p: 4,
              pt: 2,
              pb: (theme) => `calc(${theme.spacing(1)} + 6px)`,
            }}
          >
            {label}
            <ImageMarked className="MuiImageMarked-root" />
          </Typography>
        </Image>
      </ImageButton>
    </Box>
         
        </ToggleButton> 
       
      ))}
      
    </ToggleButtonGroup>

    {/* { console.log(options) } */}

  </>
  );
};

export default FilterListToggle;
