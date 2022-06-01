import React from 'react';

import Status from '../Status/Status.jsx';

import '../../assets/styles/common.scss';
import './Claims.scss';

function Claims() {

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