import React from 'react';
import { Link } from 'react-router-dom';

//import Status from '../Status/Status.jsx';
import ClaimRow from '../ClaimRow/ClaimRow.jsx';
import Pager from '../Pager/Pager.jsx';

import '../../assets/styles/common.scss';
import './Claims.scss';

function Claims() {

  return (
    <div className='container2'>
      <header className='Claims__header'>
        <p className='text4'>Your claims</p>
        <Link 
          className='button2 Claims__button'
          to='/base/new'
        >
          🞣 Create claim
        </Link>
      </header>
      <main className='Claims__table'>
        <section className='Claims__table-head'>
          <p className='text7 column1'>Title</p>
          <p className='text7 column2'>Created</p>
          <p className='text7 column3'>Type</p>
          <p className='text7 column4'>Status</p>
          <p className='text7 column5'>Actions</p>
        </section>
        <ClaimRow />
      </main>
      <Pager />
    </div>
  );
}

export default Claims;