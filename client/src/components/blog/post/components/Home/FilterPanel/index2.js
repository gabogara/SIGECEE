import React from 'react';
import { categoryList} from '../../../constants';
import FilterListToggle from '../../common/FilterListToggle/index2';

import './styles.css';

const FilterPanel2 = ({
  selectedCategory,
  selectCategory,
 
}) => (
  <div>
    <div className='input-group'>
      <FilterListToggle
        options={categoryList}
        value={selectedCategory}
        selectToggle={selectCategory}
      />
    </div>
  </div>
);


export default FilterPanel2;