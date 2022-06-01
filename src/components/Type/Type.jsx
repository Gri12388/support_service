import React from 'react';
import { useSelector } from 'react-redux';

import { selectTypes } from '../../store/slices/typesSlice.js';

import '../../assets/styles/common.scss';
import './Type.scss';

function Type({typeId}) {
  const types = useSelector(selectTypes);

  return (
    <div className='Type__wrapper'>
      <div className='Type__mark' style={{backgroundColor: types[typeId].color}}></div>
      <p className='text5'>{types[typeId].type}</p>
    </div>
  );
}

export default Type;