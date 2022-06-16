import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Type from '../Type/Type.jsx';
import Status from '../Status/Status.jsx';

import { roles } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './ClaimRow.scss';

function ClaimRow({item, type, status}) {
  
  const role = useMemo(() => sessionStorage.getItem('role'), []);

  const navigate = useNavigate();

  const onBrowse = () => {
    navigate('/base/claim', {state: {id: item._id, title: item.title, description: item.description, typeSlug: item.type.slug}})
  }

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
        {role === roles.admin && <p className='text3-link' onClick={onBrowse}>Browse</p>}
      </div>
    </>
  )
}

export default ClaimRow;