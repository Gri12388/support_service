import React from 'react';

import Type from '../Type/Type.jsx';
import Status from '../Status/Status.jsx';

import './ClaimTile.scss';

function ClaimTile({item, type, status}) {
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
        <button className='button3'>Browse</button>
      </main>
    </section>
  );
}

export default ClaimTile;