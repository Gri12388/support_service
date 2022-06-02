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
      <section className='Claims__table'>
        <div className='Claims__table-head'>
          <p className='text7 column1'>Title</p>
          <p className='text7 column2'>Created</p>
          <p className='text7 column3'>Type</p>
          <p className='text7 column4'>Status</p>
          <p className='text7 column5'>Actions</p>
        </div>
      </section>
    </div>
  );
}

export default Claims;