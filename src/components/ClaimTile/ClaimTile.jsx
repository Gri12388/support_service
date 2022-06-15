import React from 'react';
import { useNavigate } from 'react-router-dom';

import Type from '../Type/Type.jsx';
import Status from '../Status/Status.jsx';

import './ClaimTile.scss';

function ClaimTile({item, type, status}) {

  const navigate = useNavigate();

  const onBrowse = () => {
    navigate('/base/claim', {state: {id: item._id, title: item.title, description: item.description, typeSlug: item.type.slug}})
  }

  if (type === null || type === undefined || status === null || status === undefined || type.id === null || type.id === undefined || status.id === null || status.id === undefined) return;
  return (
    <section className='CT__container'>
      <header className='CT__header'>
        <p className='text10 CT__title'>{item.title}</p>
      </header>
      <main className='CT__main'>
        <div className='CT__row'>
          <p className='text11'>Created</p>
          <p className='text5'>{new Date(item.createdAt).toLocaleDateString('en-US')}</p>
        </div>
        <div className='CT__row'>
          <p className='text11'>Type</p>
          <Type typeId={type.id}/>
        </div>
        <div className='CT__row'>
          <p className='text11'>Status</p>
          <Status statusId={status.id}/>
        </div>
        <button className='button3' onClick={onBrowse}>Browse</button>
      </main>
    </section>
  );
}

export default ClaimTile;