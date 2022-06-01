import React from 'react';
import { useSelector } from 'react-redux';

// import { selectTypes } from '../../store/slices/typesSlice.js';
// import { selectStatuses } from '../../store/slices/statusesSlice.js';

import '../../assets/styles/common.scss';
import './Claims.scss';

function Claims() {
  // const types = useSelector(selectTypes);
  // const statuses = useSelector(selectStatuses);
  // debugger
  return (
    <div className='Claims__container'>
      <header className='Claims__header'>
        <p className='text4'>Your claims</p>
        <button className='button2 Claims__button'>🞣 Create claim</button>
      </header>
    </div>
  );
}

export default Claims;