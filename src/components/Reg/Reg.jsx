import React, { useState } from 'react';

import InputText from '../InputText/InputText.jsx';

import './Reg.scss';

const rules = {
  nameLengthMin: 3,
  nameLengthMax: 20,
}

const errors = {
  nameErrors: {
    noName: 'Type name',
    shortName: 'Name is short',
    longName: 'Name is long',
    lengthError: `Name's length should be more than ${rules.nameLengthMin} signs and less than ${rules.nameLengthMax} signs`,
  }
}

function Reg() {

  const [name, setName] = useState({content: '', status: false, touched: false, error: ''});
  const [surname, setSurname] = useState({content: '', status: false, touched: false, error: ''});
  const [email, setEmail] = useState({content: '', status: false, touched: false, error: ''});
  const [password, setPassword] = useState({content: '', status: false, touched: false, error: ''});
  const [passwordCopy, setPasswordCopy] = useState({content: '', status: false, touched: false, error: ''});

  const onNameInput = e => setName(state=>({...state, content: e.target.value}));
  const onSurnameInput = e => setSurname(state=>({...state, content: e.target.value}));
  const onEmailInput = e => setEmail(state=>({...state, content: e.target.value}));
  const onPasswordInput = e => setPassword(state=>({...state, content: e.target.value}));
  const onPasswordCopyInput = e => setPasswordCopy(state=>({...state, content: e.target.value}));
  const onSubmit = (e) => {
    e.preventDefault();
    // for (let i = 0; i < el.target.length - 1; i++) {
    //   console.log(el.target[i].value);
    // }
    console.log(name);
  }

  const onBlurName = () => {
    setName(state=>({...state, touched: true}));
    checkName();
  }

  const checkName = () => {
    if (name.content.length === 0) return setName(state=>({...state, status: false, error: errors.nameErrors.noName}));
    if (name.content.length < rules.nameLengthMin) return setName(state=>({...state, status: false, error: errors.nameErrors.shortName}));
    if (name.content.length > rules.nameLengthMax) return setName(state=>({...state, status: false, error: errors.nameErrors.longName}));
    setName(state=>({...state, status: true, error: ''}));
  }

  return (
    <form className='Reg__modal' onSubmit={onSubmit}>
      <section className='Reg__section'>
        <InputText 
          id='fromReg__name'
          label='NAME'
          placeholder='Type your name'
          callbacks={{onChange: onNameInput, onBlur: onBlurName}}
          state={name}
        />
      </section>
      {/* <section className='Reg__section'>
        <InputText 
          id='fromReg__surname'
          label='SURNAME'
          placeholder='Type your surname'
          callback={onSurnameInput}
          state={surname}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          type='email'
          id='fromReg__email'
          label='E-MAIL'
          placeholder='Type your e-mail'
          callback={onEmailInput}
          state={email}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          type='password'
          id='fromReg__password'
          label='PASSWORD'
          placeholder='Type your password'
          callback={onPasswordInput}
          state={password}
        />
      </section>
      <section className='Reg__section'>
        <InputText 
          type='password'
          id='fromReg__password-copy'
          label='PASSWORD AGAIN'
          placeholder='Type your password again'
          callback={onPasswordCopyInput}
          state={passwordCopy}
        />
      </section> */}
      {/* <button className='button2 xbutton1'>Register</button> */}
      <input type='submit' className='button2 xbutton1' value='Register' />
      <div className='button2 Reg__button' id='Reg__button'>╳</div>
    </form>
  );
}

export default Reg;