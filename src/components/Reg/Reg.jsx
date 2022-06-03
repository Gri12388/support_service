import React, { useState } from 'react';

import InputText from '../InputText/InputText.jsx';

import './Reg.scss';

function Reg() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCopy, setPasswordCopy] = useState('');

  const onNameInput = e => setName(e.target.value);
  const onSurnameInput = e => setSurname(e.target.value);
  const onEmailInput = e => setEmail(e.target.value);
  const onPasswordInput = e => setPassword(e.target.value);
  const onPasswordCopyInput = e => setPasswordCopy(e.target.value);
  const onSubmit = (e, el) => {
    e.preventDefault();
    // for (let i = 0; i < el.target.length - 1; i++) {
    //   console.log(el.target[i].value);
    // }

    console.log(e);
    console.log(el);
    return false;
  }

  return (
    <form className='Reg__modal' onSubmit={onSubmit}>
      <section className='Reg__section'>
        <InputText 
          id='fromReg__name'
          label='NAME'
          placeholder='Type your name'
          callback={onNameInput}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          id='fromReg__surname'
          label='SURNAME'
          placeholder='Type your surname'
          callback={onSurnameInput}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          type='email'
          id='fromReg__email'
          label='E-MAIL'
          placeholder='Type your e-mail'
          callback={onEmailInput}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          type='password'
          id='fromReg__password'
          label='PASSWORD'
          placeholder='Type your password'
          callback={onPasswordInput}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          type='password'
          id='fromReg__password-copy'
          label='PASSWORD AGAIN'
          placeholder='Type your password again'
          callback={onPasswordCopyInput}
        />
      </section>
      {/* <button className='button2 xbutton1'>Register</button> */}
      <input type='submit' className='button2 xbutton1' value='Register' />
      <div className='button2 Reg__button' id='Reg__button'>╳</div>
    </form>
  );
}

export default Reg;