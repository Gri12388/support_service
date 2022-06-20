import React from 'react';

import '../../assets/styles/common.scss';
import './Type.scss';

function Type({ typeId }) {
  const types = Object.values(JSON.parse(sessionStorage.getItem('types')));

  return (
    <div className='Type__wrapper'>
      <div className='Type__mark' style={{ backgroundColor: types[typeId].color }}></div>
      <p className='text5'>{ types[typeId].type }</p>
    </div>
  );
}

export default Type;