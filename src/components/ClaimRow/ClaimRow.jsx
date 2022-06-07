import React from 'react';
import { useSelector } from 'react-redux';

import Type from '../Type/Type.jsx';
import Status from '../Status/Status.jsx';

import { selectClaims, selectTotalClaimsNumber, selectToken } from '../../store/slices/claimsSlaice.js';
import { selectTypes } from '../../store/slices/typesSlice.js';
import { selectStatuses } from '../../store/slices/statusesSlice.js';


import '../../assets/styles/common.scss';
import './ClaimRow.scss';

function ClaimRow() {

  console.log (Date('2021-11-11T09:14:33.869Z').toLocaleString('en-US'));

  const claims = useSelector(selectClaims);
  const types = useSelector(selectTypes);
  const statuses = useSelector(selectStatuses);
  
  console.log (claims);
  
  const items = claims.map((item) => {
    let type, status;

    if (!item.type || !item.type.name) type = types[4];
    else {
      type = types.find(elem => {
        let el = elem.type.toLowerCase();
        let it = item.type.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
        //(elem.type.toLowerCase().localeCompare(item.type.name.toLowerCase())) === 0;
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
    <section key={item._id} className='CR__row'>
      <div className='column1'>
        <p className='text3'>{item.title}</p>
      </div>
      <div className='column2'>
        <p className='text3'>{new Date(item.createdAt).toLocaleDateString('en-US')}</p>
      </div>
      <div className='column3'>
        <Type typeId={type.id}/> 
      </div>
      <div className='column4'>
        <Status statusId={status.id}/>
      </div>
      <div className='column5'>
        <p className='text3-link'>Browse</p>
      </div>
    </section>
  )});

    console.log(items);



  return (
    <>
      {items}
    </>
  )
}

export default ClaimRow;