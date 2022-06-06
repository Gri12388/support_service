import React, { useState } from 'react';

import InputText from '../InputText/InputText.jsx';
import { rules, errors } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Login.scss';

import mail from '../../assets/images/mail.svg';
import lock from '../../assets/images/lock.svg';


function Login({ loading, setLoading }) {
  const [email, setEmail] = useState({content: '', status: false, touched: false, error: errors.emailErrors.noEmail});
  const [password, setPassword] = useState({content: '', status: false, touched: false, error: errors.passwordErrors.noPassword});
  const states = [
    {state: email, setState: setEmail},
    {state: password, setState: setPassword},
  ];

  const onEmailInput = e => setEmail(state=>({...state, content: e.target.value}));
  const onPasswordInput = e => setPassword(state=>({...state, content: e.target.value}));

  const onSubmit = e => {
    e.preventDefault();

    let isValid = states.every(item => item.state.status);
    if (!isValid) {
      states.forEach(item => {
        if (!item.state.status) item.setState(state=>({...state, touched: true}));
      });
      return;
    }

    let post = {
      email: email.content,
      password: password.content
    }
    
    sendRequest(JSON.stringify(post));
    setLoading(state=>({...state, isLoading: true, isBlocked: true}));


    // setForm(state=>({...state, isVisible: false}));
    // setLoading(state=>({...state, isVisible: true}));
    // toggleBlockModal();
    

    //---------------------------------------------------
    // testAsync();
    // setForm(state=>({...state, isVisible: false}));
    // setLoading(state=>({...state, isVisible: true}));
    // toggleBlockModal();
    //---------------------------------------------------

  }

  async function sendRequest(body) {
    let promise = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}, 
      body: body,
    });
    
    if (promise.status === 200) {
      let data = await promise.json();
      console.log (data);
    }

    
    debugger
    // setLoading(state=>({...state, isVisible: false}));
    // toggleBlockModal();

    // switch (promise.status) {
    //   case 200: setMessage(state=>({...state, isVisible: true, content: 'You are registered successfully', isRegistered: true}));
    //             break;
    //   case 409: setMessage(state=>({...state, isVisible: true, content: 'User with the same credentials is already registered', isRegistered: false}));
    //             break;
    //   default:  setMessage(state=>({...state, isVisible: true, content: 'You are not registered', isRegistered: false}));
    // }
  }

  const onBlur = (setter, checker) => {
    setter(state=>({...state, touched: true}));
    checker();
  }

  const checkEmail = () => {
    if (email.content.length === 0) return setEmail(state=>({...state, status: false, error: errors.emailErrors.noEmail}));
    if (!rules.emailRegExp.test(email.content)) return setEmail(state=>({...state, status: false, error: errors.emailErrors.wrongEmail}));
    setEmail(state=>({...state, status: true, error: ''}));
  }

  const checkPassword = () => {
    if (password.content.length === 0) return setPassword(state=>({...state, status: false, error: errors.passwordErrors.noPassword}));
    if (password.content.length < rules.passwordLengthMin) return setPassword(state=>({...state, status: false, error: errors.passwordErrors.shortPassword}));
    if (password.content.length > rules.passwordLengthMax) return setPassword(state=>({...state, status: false, error: errors.passwordErrors.longPassword}));
    setPassword(state=>({...state, status: true, error: ''}));
  }

  return (
    <form className='Login__form' onSubmit={onSubmit}>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id='fromLogin__email'
          type='email'
          label='E-MAIL'
          placeholder='Type your e-mail'
          img={mail}
          alt='mail'
          callbacks={{onChange: onEmailInput, onBlur: onBlur.bind(null, setEmail, checkEmail)}}
          state={email}
        />
      </div>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id='fromLogin__password'
          type='password'
          label='PASSWORD'
          placeholder='Type your password'
          img={lock}
          alt='lock'
          callbacks={{onChange: onPasswordInput, onBlur: onBlur.bind(null, setPassword, checkPassword)}}
          state={password}
        />
      </div>
      <div className='Login__checkbox_wrapper'>
        <input type='checkbox' id='Login__checkbox' name='Login__checkbox' className='Login__checkbox' />
        <label htmlFor='' className='text2'>Keep me logged in</label>
      </div>

      
      {/* <button className='button2 xbutton1'>Login</button> */}
      <input type='submit' className='button2 xbutton1' value='Login' />
    </form>
  );
}

export default Login;

//---------------------------

  // let [email, setEmail] = useState('');
  // let [password, setPassword] = useState();

//---------------------------