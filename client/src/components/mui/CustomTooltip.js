import React from 'react';
import {
  Tooltip,
  Zoom,
} from "@mui/material";
import { styled } from '@mui/material/styles'
import { tooltipClasses } from '@mui/material/Tooltip'

const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}));

const CustomTooltip = ({ title, content, placement, sx }) => {
  return (
    <BootstrapTooltip title={title} transitioncomponent={Zoom} placement={placement ?? 'bottom'} sx={sx ?? ''}>
      {content}
    </BootstrapTooltip>
  );
}

export default CustomTooltip;