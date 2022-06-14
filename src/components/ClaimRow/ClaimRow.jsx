import React from 'react';

import Type from '../Type/Type.jsx';
import Status from '../Status/Status.jsx';

import '../../assets/styles/common.scss';
import './ClaimRow.scss';

function ClaimRow({item, type, status}) {
  if (type === null || type === undefined || status === null || status === undefined || type.id === null || type.id === undefined || status.id === null || status.id === undefined) return;
  return (
    <>
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
    </>
  )
}

export default ClaimRow;