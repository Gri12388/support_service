import React from 'react';
import { useState } from 'react';
import InputText from '../InputText/InputText.jsx';

import '../../assets/styles/common.scss';
import './Login.scss';

import mail from '../../assets/images/mail.svg';
import lock from '../../assets/images/lock.svg';


function Login() {
  const [email, setEmail] = useState('');
  let [password, setPassword] = useState();

  const onEmailInput = e => setEmail(e.target.value);
  const onPasswordInput = e => setPassword(e.target.value);

  return (
    <form className='Login__form'>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id='InputText__email'
          type='email'
          label='E-MAIL'
          placeholder='Type your e-mail'
          img={mail}
          alt='mail'
          callback={onEmailInput}
        />
      </div>
      <div className='Login__InputText2_wrapper'>
        <InputText
          id='InputText__password'
          type='password'
          label='PASSWORD'
          placeholder='Type your password'
          img={lock}
          alt='lock'
          callback={onPasswordInput}
        />
      </div>
      <div className='Login__checkbox_wrapper'>
        <input type='checkbox' id='Login__checkbox' name='Login__checkbox' className='Login__checkbox' />
        <label htmlFor='' className='text2'>Keep me logged in</label>
      </div>

      
      <button className='button2 Login__button'>Login</button>
      <p className='text2 Login__text'>
        Not a member?
        <span className='text2 interactiv Login__text-marked'>
          &nbsp;Request registration
        </span>
      </p>
    </form>
  );
}

export default Login;