import React, { useState } from 'react';

import InputText from '../InputText/InputText.jsx';

import '../../assets/styles/common.scss';
import './NewClaim.scss';

function NewClaim() {
  let [title, setTitle] = useState('');
  let [description, setDescription] = useState('');

  const onTitleInput = e => setTitle(e.target.value);
  const onDescriptionInput = e => setDescription(e.target.value);

  return(
    <form className='container2'>
      <p className='text4 NewClaim__title'>Creating new claim</p>
      <section className='NewClaim__section'>
        <InputText 
          id='fromNewClaim__title'
          label='TITLE'
          placeholder='Type claim title'
          callback={onTitleInput}
        />
      </section>
      <section className='NewClaim__section'>
        <InputText 
          id='fromNewClaim__description'
          label='DESCRIPTION'
          placeholder='Type claim description'
          callback={onDescriptionInput}
        />
      </section>
      <section className='NewClaim__section'></section>
      <section className='NewClaim__section'></section>
    </form>
  ); 
}

export default NewClaim;