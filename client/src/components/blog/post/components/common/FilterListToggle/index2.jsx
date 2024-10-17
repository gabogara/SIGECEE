import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


const FilterListToggle = ({ options, value, selectToggle }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={selectToggle}
     
    >
      {options.map(({ label, id, value }) => (
        <ToggleButton key={id} value={value}>
          {label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default FilterListToggle;