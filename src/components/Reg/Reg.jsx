import React, { useState, useEffect } from 'react';

import InputText from '../InputText/InputText.jsx';
import { rules, errors, messages, onPressedEnter } from '../../data/data.js'

import '../../assets/styles/common.scss';
import './Reg.scss';

import loadingImage from '../../assets/images/loading.png';

function Reg({toggleBlockModal}) {

  const [form, setForm] = useState({isVisible: true});
  const [loading, setLoading] = useState({isVisible: false});
  const [message, setMessage] = useState({isVisible: false, content: '', isRegistered: false});

  const [name, setName] = useState({
    content: '',
    error: errors.nameErrors.noName,
    focused: true, 
    status: false, 
    touched: false, 
  });
  const [surname, setSurname] = useState({
    content: '', 
    error: errors.surnameErrors.noSurname,
    fucused: false,
    status: false, 
    touched: false, 
  });
  const [email, setEmail] = useState({
    content: '', 
    error: errors.emailErrors.noEmail,
    focused: false,
    status: false, 
    touched: false, 
  });
  const [password, setPassword] = useState({
    content: '', 
    error: errors.passwordErrors.noPassword,
    focused: false,
    status: false, 
    touched: false, 
  });
  const [passwordCopy, setPasswordCopy] = useState({
    content: '', 
    status: false, 
    touched: false, 
    error: errors.passwordErrors.noPassword,
  });

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

  function onFocus( setter ) {
    setter(state=>({ ...state, focused: true }));
  }

  const onBlur = ( setter, checker ) => {
    setter(state=>({...state, touched: true, focused: false}));
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

  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter                                  
  //------------------------------------------------------------//
  let [nameElement, setNameElement] = useState();
  let [surnameElement, setSurnameElement] = useState();
  let [emailElement, setEmailElement] = useState();
  let [passwordElement, setPasswordElement] = useState();
  let [passwordCopyElement, setPasswordCopyElement] = useState();



  //------------------------------------------------------------//
  // Массивоподобный объект, хранящий данные для реализации 
  // смены фокуса при нажатии на кнопку Enter, а именно: id
  // элемента, сам элемент и его Tab позиция в форме.                                   
  //------------------------------------------------------------//
  const elements = {
    0: { id: 'fromReg__name', state: nameElement, pos: 0 }, 
    1: { id: 'fromReg__surname', state: surnameElement, pos: 1 },
    2: { id: 'fromReg__email', state: emailElement, pos: 2 },
    3: { id: 'fromReg__password', state: passwordElement, pos: 3 },
    4: { id: 'fromReg__password-copy', state: passwordCopyElement, pos: 4 },
  } 



  //------------------------------------------------------------//
  // Данный хук ищет только после первого рендера нужные элемены 
  // DOM дерева и сохраняет их в своответствующем состоянии                                 
  //------------------------------------------------------------//
  useEffect(() => {
    setNameElement(document.getElementById(elements[0].id));
    setSurnameElement(document.getElementById(elements[1].id));
    setEmailElement(document.getElementById(elements[2].id));
    setPasswordElement(document.getElementById(elements[3].id));
    setPasswordCopyElement(document.getElementById(elements[4].id));
  }, []);



  return (
    <div className='container3'>
      {form.isVisible && (
        <form className='Reg__modal' onSubmit={onSubmit}>
          <section className='Reg__section'>
          <InputText 
            id='fromReg__name'
            label='NAME'
            placeholder='Type your name'
            state={ name }
            callbacks={{
              onChange: onNameInput,
              onFocus: onFocus.bind(null, setName), 
              onBlur: onBlur.bind(null, setName, checkName),
              onPressedEnter: onPressedEnter(elements)
            }}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            id='fromReg__surname'
            label='SURNAME'
            placeholder='Type your surname'
            state={ surname }
            callbacks={{
              onChange: onSurnameInput,
              onFocus: onFocus.bind(null, setSurname), 
              onBlur: onBlur.bind(null, setSurname, checkSurname),
              onPressedEnter: onPressedEnter(elements)
            }}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            type='email'
            id='fromReg__email'
            label='E-MAIL'
            placeholder='Type your e-mail'
            state={ email }
            callbacks={{
              onChange: onEmailInput, 
              onFocus: onFocus.bind(null, setEmail),
              onBlur: onBlur.bind(null, setEmail, checkEmail),
              onPressedEnter: onPressedEnter(elements)
            }}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            type='password'
            id='fromReg__password'
            label='PASSWORD'
            placeholder='Type your password'
            state={ password }
            callbacks={{
              onChange: onPasswordInput, 
              onFocus: onFocus.bind(null, setPassword),
              onBlur: onBlur.bind(null, setPassword, checkPassword),
              onPressedEnter: onPressedEnter(elements)
            }}
          />
          </section>
          <section className='Reg__section'>
          <InputText 
            type='password'
            id='fromReg__password-copy'
            label='PASSWORD AGAIN'
            placeholder='Type your password again'
            state={ passwordCopy }
            callbacks={{
              onChange: onPasswordCopyInput,
              onFocus: onFocus.bind(null, setPasswordCopy), 
              onBlur: onBlur.bind(null, setPasswordCopy, checkPasswordCopy),
              onPressedEnter: onPressedEnter(elements)
            }}
          />
          </section>
          <button className='button2 xbutton1'>Register</button>
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

