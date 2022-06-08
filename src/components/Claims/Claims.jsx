import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import ClaimRow from '../ClaimRow/ClaimRow.jsx';
import Pager from '../Pager/Pager.jsx';

import { selectClaims } from '../../store/slices/claimsSlaice.js';
import { selectTypes } from '../../store/slices/typesSlice.js';
import { selectStatuses } from '../../store/slices/statusesSlice.js';

import '../../assets/styles/common.scss';
import './Claims.scss';

function Claims() {

  let [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const onClaimsWindowWidthResize = () => setWindowWidth(window.innerWidth);

  useEffect(()=> {
    window.addEventListener('resize', onClaimsWindowWidthResize);
    return () => {
      window.removeEventListener('resize', onClaimsWindowWidthResize);
    }
  }, []);

  const claims = useSelector(selectClaims);
  const types = useSelector(selectTypes);
  const statuses = useSelector(selectStatuses);

  const rows = claims.map((item) => {
    let type, status;

    if (!item.type || !item.type.name) type = types[4];
    else {
      type = types.find(elem => {
        let el = elem.type.toLowerCase();
        let it = item.type.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
      });
    }

    if (!item.status || !item.status.name) status = statuses[4];
    else {
      status = statuses.find(elem => {
        let el = elem.status.toLowerCase();
        let it = item.status.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
      })
    }

    return (
      <section className='Claims__row'>
        <ClaimRow item={item} type={type} status={status}/>  
      </section>
    );
  });

  return (
    <div className='container2'>
      <header className='Claims__header'>
        <p className={windowWidth > 799 ? 'text4' : 'text9'}>Your claims</p>
        <Link 
          className='button2 Claims__button'
          to='/base/new'
        >
          {windowWidth > 799 ? '🞣 Create claim' : '🞣'}
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
        {rows}
      </main>

      <Pager />
    </div>
  );
}

export default Claims;