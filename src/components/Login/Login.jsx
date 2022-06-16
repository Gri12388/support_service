import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";

import InputText from '../InputText/InputText.jsx';

import { rules, errors, messages, typeColors, statusColors, onPressedEnter } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Login.scss';


function Login({ setLoading, email, setEmail, password, setPassword }) {
  
  const navigate = useNavigate();

  const dispatch = useDispatch();

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

  }




  async function sendRequest(body) {
    let promise = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}, 
      body: body,
    });

    switch(promise.status) {
      case 200: break;
      case 401: setLoading(state=>({...state, isBlocked: false, message: messages.noAuth}));
                return;
      default:  setLoading(state=>({...state, isBlocked: false, message: messages.default}));
                return;
    }
    
    let data = await promise.json();

    sessionStorage.setItem('fullName', data.fullName);
    sessionStorage.setItem('role', data.role.name);
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('offset', 0);

    //--- Загружаем типы ---//

    let promiseTypes = await fetch('http://localhost:3001/types', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.token}`
      },
    });

    switch(promiseTypes.status) {
      case 200: break;
      default:  setLoading(state=>({...state, isBlocked: false, message: messages.default}));
                return;
    }

    let types = await promiseTypes.json();

    if (!Array.isArray(types)) {
      setLoading(state=>({...state, isBlocked: false, message: messages.default}));
      return;
    }

    let typesArray = types.map((item, index) => ({
      id: index,
      type: item.name,
      slug: item.slug,
      color: typeColors[index % typeColors.length] 
    }));

    typesArray.push({id: typeColors.length, type: 'Other', color: '#ADADAD'});

    let typesObject = {};

    typesArray.forEach(item => typesObject[item.id] = item);

    sessionStorage.setItem('types', JSON.stringify(typesObject));

    //--- Загружаем статусы ---//

    let promiseStatuses = await fetch('http://localhost:3001/status', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${data.token}`
      },
    });

    switch(promiseStatuses.status) {
      case 200: break;
      default:  setLoading(state=>({...state, isBlocked: false, message: messages.default}));
                return;
    }

    let statuses = await promiseStatuses.json();

    if (!Array.isArray(statuses)) {
      setLoading(state=>({...state, isBlocked: false, message: messages.default}));
      return;
    }

    let statusesArray = statuses.map((item, index) => ({
      id: index,
      status: (item.name).toUpperCase(),
      slug: item.slug,
      color: statusColors[index % statusColors.length] 
    }));

    statusesArray.push({id: statusColors.length, status: 'UNDEFINED', color: '#ADADAD'});

    let statusesObject = {};

    statusesArray.forEach(item => statusesObject[item.id] = item);

    sessionStorage.setItem('statuses', JSON.stringify(statusesObject));

    //--- Выходим из загрузки и переходим на целевую страницу ---//

    setLoading({isLoading: false, isBlocked: false, message: ''});
    navigate('/base/claims');
  }

  const onBlur = (setter, checker) => {
    setter(state=>({...state, touched: true}));
    checker();
  }

  const onKeyDown = e => {
    if (e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
    }
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



  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter                                  
  //------------------------------------------------------------//
  let [loginElement, setLoginElement] = useState();
  let [passwordElement, setPasswordElement] = useState();



  //------------------------------------------------------------//
  // Массивоподобный объект, хранящий данные для реализации 
  // смены фокуса при нажатии на кнопку Enter, а именно: id
  // элемента, сам элемент и его Tab позиция в форме.                                  
  //------------------------------------------------------------//
  const elements = {
    0: { id: 'fromLogin__email', state: loginElement, pos: 0 }, 
    1: { id: 'fromLogin__password', state: passwordElement, pos: 1 },
  } 



  //------------------------------------------------------------//
  // Данный хук ищет только после первого рендера нужные элемены 
  // DOM дерева и сохраняет их в своответствующем состоянии                                 
  //------------------------------------------------------------//
  useEffect(() => {
    setLoginElement(document.getElementById(elements[0].id));
    setPasswordElement(document.getElementById(elements[1].id));
  }, []);

  

  return (
    <form className='Login__form' onSubmit={onSubmit} onKeyDown={onKeyDown}>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id={ elements[0].id }
          type='email'
          label='E-MAIL'
          placeholder='Type your e-mail'
          value={ email.content }
          img='mail'
          state={ email }
          callbacks={{  
            onChange: onEmailInput, 
            onBlur: onBlur.bind(null, setEmail, checkEmail),
            onPressedEnter: onPressedEnter(elements)
          }}
        />
      </div>
      <div className='Login__InputText1_wrapper'>
        <InputText
          id={ elements[1].id }
          type='password'
          label='PASSWORD'
          placeholder='Type your password'
          value={ password.content }
          img='lock'
          state={ password }
          callbacks={{
            onChange: onPasswordInput, 
            onBlur: onBlur.bind(null, setPassword, checkPassword),
            onPressedEnter: onPressedEnter(elements)
          }}
        />
      </div>
      <div className='Login__checkbox_wrapper'>
        <input  type='checkbox' 
                id='Login__checkbox' 
                name='Login__checkbox' 
                className='Login__checkbox' 
        />
        <label htmlFor='' className='text2'>Keep me logged in</label>
      </div>
      <button className='button2 xbutton1'>Login</button>
    </form>
  );
}

export default Login;
