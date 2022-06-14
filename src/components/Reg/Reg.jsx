import React, { useState } from 'react';

import InputText from '../InputText/InputText.jsx';
import { rules, errors, messages } from '../../data/data.js'

import '../../assets/styles/common.scss';
import './Reg.scss';

import loadingImage from '../../assets/images/loading.png';

function Reg({toggleBlockModal}) {

  const [form, setForm] = useState({isVisible: true});
  const [loading, setLoading] = useState({isVisible: false});
  const [message, setMessage] = useState({isVisible: false, content: '', isRegistered: false});

  const [name, setName] = useState({content: '', status: false, touched: false, error: errors.nameErrors.noName});
  const [surname, setSurname] = useState({content: '', status: false, touched: false, error: errors.surnameErrors.noSurname});
  const [email, setEmail] = useState({content: '', status: false, touched: false, error: errors.emailErrors.noEmail});
  const [password, setPassword] = useState({content: '', status: false, touched: false, error: errors.passwordErrors.noPassword});
  const [passwordCopy, setPasswordCopy] = useState({content: '', status: false, touched: false, error: errors.passwordErrors.noPassword});

  const states = [
    {state: name, setState: setName},
    {state: surname, setState: setSurname},
    {state: email, setState: setEmail},
    {state: password, setState: setPassword},
    {state: passwordCopy, setState: setPasswordCopy},
  ];

  const onTryAgainButton = () => {
    setMessage(state=>({...state, isVisible: false, content: '', isRegistered: false}));
    setForm(state=>({...state, isVisible: true}));
    setName({status: false, touched: false, error: errors.nameErrors.noName});
    setSurname({status: false, touched: false, error: errors.surnameErrors.noSurname});
    setEmail({status: false, touched: false, error: errors.emailErrors.noEmail});
    setPassword({status: false, touched: false, error: errors.passwordErrors.noPassword});
    setPasswordCopy({status: false, touched: false, error: errors.passwordErrors.noPassword});
  }
  const onNameInput = e => setName(state=>({...state, content: e.target.value}));
  const onSurnameInput = e => setSurname(state=>({...state, content: e.target.value}));
  const onEmailInput = e => setEmail(state=>({...state, content: e.target.value}));
  const onPasswordInput = e => setPassword(state=>({...state, content: e.target.value}));
  const onPasswordCopyInput = e => setPasswordCopy(state=>({...state, content: e.target.value}));
  
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
      fullName: name.content + ' ' + surname.content,
      email: email.content,
      password: password.content
    }
    
    sendRequest(JSON.stringify(post));
    setForm(state=>({...state, isVisible: false}));
    setLoading(state=>({...state, isVisible: true}));
    toggleBlockModal();
  }

  async function sendRequest(body) {
    let promise = await fetch('http://localhost:3001/auth/registration', {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8'}, 
      body: body,
    });
    
    setLoading(state=>({...state, isVisible: false}));
    toggleBlockModal();
    //console.log (promise);

    switch (promise.status) {
      case 200: setMessage(state=>({...state, isVisible: true, content: messages.regGood, isRegistered: true}));
                break;
      case 409: setMessage(state=>({...state, isVisible: true, content: messages.alreadyRegistered, isRegistered: false}));
                break;
      default:  setMessage(state=>({...state, isVisible: true, content: messages.regBad, isRegistered: false}));
    }
  }

  const onBlur = (setter, checker) => {
    setter(state=>({...state, touched: true}));
    checker();
  }

  const checkName = () => {
    if (name.content.length === 0) return setName(state=>({...state, status: false, error: errors.nameErrors.noName}));
    if (name.content.length < rules.nameLengthMin) return setName(state=>({...state, status: false, error: errors.nameErrors.shortName}));
    if (name.content.length > rules.nameLengthMax) return setName(state=>({...state, status: false, error: errors.nameErrors.longName}));
    setName(state=>({...state, status: true, error: ''}));
  }

  const checkSurname = () => {
    if (surname.content.length === 0) return setSurname(state=>({...state, status: false, error: errors.surnameErrors.noSurname}));
    if (surname.content.length < rules.surnameLengthMin) return setSurname(state=>({...state, status: false, error: errors.surnameErrors.shortSurname}));
    if (surname.content.length > rules.surnameLengthMax) return setSurname(state=>({...state, status: false, error: errors.surnameErrors.longSurname}));
    setSurname(state=>({...state, status: true, error: ''}));
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

  const checkPasswordCopy = () => {
    if (passwordCopy.content.length === 0) return setPasswordCopy(state=>({...state, status: false, error: errors.passwordErrors.noPassword}));
    if (passwordCopy.content !== password.content) return setPasswordCopy(state=>({...state, status: false, error: errors.passwordErrors.noMatch}));
    setPasswordCopy(state=>({...state, status: true, error: ''}));
  }

  return (
    <div className='container3'>
      {form.isVisible && (
        <form className='Reg__modal' onSubmit={onSubmit}>
          <section className='Reg__section'>
          <InputText 
            id='fromReg__name'
            label='NAME'
            placeholder='Type your name'
            callbacks={{onChange: onNameInput, onBlur: onBlur.bind(null, setName, checkName)}}
            state={name}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            id='fromReg__surname'
            label='SURNAME'
            placeholder='Type your surname'
            callbacks={{onChange: onSurnameInput, onBlur: onBlur.bind(null, setSurname, checkSurname)}}
            state={surname}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            type='email'
            id='fromReg__email'
            label='E-MAIL'
            placeholder='Type your e-mail'
            callbacks={{onChange: onEmailInput, onBlur: onBlur.bind(null, setEmail, checkEmail)}}
            state={email}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            type='password'
            id='fromReg__password'
            label='PASSWORD'
            placeholder='Type your password'
            callbacks={{onChange: onPasswordInput, onBlur: onBlur.bind(null, setPassword, checkPassword)}}
            state={password}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            type='password'
            id='fromReg__password-copy'
            label='PASSWORD AGAIN'
            placeholder='Type your password again'
            callbacks={{onChange: onPasswordCopyInput, onBlur: onBlur.bind(null, setPasswordCopy, checkPasswordCopy)}}
            state={passwordCopy}
          />
          </section>
          <input type='submit' className='button2 xbutton1' value='Register' />
          <div className='button2 close-button' id='Reg__button'>╳</div>
        </form>
      )}
      {loading.isVisible && (
        <div className='Reg__modal1'>
          <img src={loadingImage} alt="loading" className='loading' />
          <p className='text3'>Loading...</p>
        </div>  
      )}
      {message.isVisible && (
        <div className='Reg__modal2'>
          <p className='text3'>{message.content}</p>
          {!message.isRegistered && (
            <button className='button4' onClick={onTryAgainButton}>Try again?</button>
          )}
          <div className='button2 close-button' id='Reg__button'>╳</div>
        </div>
      )}
      
    </div>
  );
}

export default Reg;

//--------------------------------------

// const onBlurName = () => {
//   setName(state=>({...state, touched: true}));
//   checkName();
// }

// const onBlurSurname = () => {
//   setSurname(state=>({...state, touched: true}));
//   checkSurname();
// }

// const onBlurEmail = () => {
//   setEmail(state=>({...state, touched: true}));
//   checkEmail();
// }

//--------------------------------

{/* <button className='button2 xbutton1'>Register</button> */}

//--------------------------------

// const rules = {
//   nameLengthMin: 1,
//   nameLengthMax: 20,
//   surnameLengthMin: 1,
//   surnameLengthMax: 20,
//   emailRegExp: /^\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3}$/,
//   passwordLengthMin: 6,
//   passwordLengthMax: 20,
// }

// const errors = {
//   nameErrors: {
//     noName: 'Type name',
//     shortName: 'Name is short',
//     longName: 'Name is long',
//   },
//   surnameErrors: {
//     noSurname: 'Type surname',
//     shortSurname: 'Surname is short',
//     longSurname: 'Surname is long',
//   },
//   emailErrors: {
//     noEmail: 'Type email',
//     wrongEmail: 'Wrong email',
//   },
//   passwordErrors: {
//     noPassword: 'Type password',
//     noPasswordCopy: 'Repeat password',
//     shortPassword: 'Password is short',
//     longPassword: 'Password is long',
//     noMatch: 'Passwords don\'t match', 
//   }
// }

//--------------------------------

// testAsync();
// setForm(state=>({...state, isVisible: false}));
// setLoading(state=>({...state, isVisible: true}));
// toggleBlockModal();

//---------------------------------------------------

// async function testAsync() {
//   let promise = await (() => new Promise(resolve => setTimeout(()=>resolve({}), 5000)))();
//   promise.status = 201;
//   setLoading(state=>({...state, isVisible: false}));
//   toggleBlockModal();
//   console.log (promise);
//   if (promise.status === 200) setMessage(state=>({...state, isVisible: true, content: 'You are registered successfully', isRegistered: true})); 
//   else setMessage(state=>({...state, isVisible: true, content: 'You are  not registered', isRegistered: false}));
// }

//------------------------------------------