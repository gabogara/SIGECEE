import React from 'react';
import { categoryList } from '../../../constants';
import FilterListToggle from '../../common/FilterListToggle';

import './styles.css';

//console.log(categoryList)
const FilterPanel = ({
  selectedCategory,
  selectCategory,

}) => (
  <div>
    <div className='input-group'>
      <p className='label'>Categorías</p>
      <FilterListToggle
        options={categoryList}
        value={selectedCategory}
        selectToggle={selectCategory}
      />
    </div>
  </div>
);


export default FilterPanel;
