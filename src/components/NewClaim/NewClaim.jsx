import React, { useState } from 'react';

import InputText from '../InputText/InputText.jsx';
import Sel from '../Sel/Sel.jsx';

import '../../assets/styles/common.scss';
import './NewClaim.scss';

function NewClaim() {
  
  let [title, setTitle] = useState('');
  let [description, setDescription] = useState('');
  let [type, setType] = useState('');

  const onTitleInput = e => setTitle(e.target.value);
  const onDescriptionInput = e => setDescription(e.target.value);
  const onTypeInput = e => setType(e.target.value);

  return(
    <form className='container2'>
      <p className='text4 NewClaim__title'>Creating new claim</p>
      <section className='NewClaim__input'>
        <InputText 
          id='fromNewClaim__title'
          label='TITLE'
          placeholder='Type claim title'
          callback={onTitleInput}
        />
      </section>
      <section className='NewClaim__input'>
        <Sel 
          id='fromNewClaim__type'
          label='TYPE'
          groupId={'fromNewClaim__sel1'}
          callback={onTypeInput}
          placeholder='Select type'
        />
      </section>
      <section className='NewClaim__input'>
        <InputText 
          id='fromNewClaim__description'
          label='DESCRIPTION'
          placeholder='Type claim description'
          callback={onDescriptionInput}
        />
      </section>
      <section className='NewClaim__buttons'>
        <button className='button3'>Cancel</button>
        <button className='button2'>Create</button>
      </section>
    </form>
  ); 
}

export default NewClaim;