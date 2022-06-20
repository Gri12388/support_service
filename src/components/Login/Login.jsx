import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Modal from '../Modal/Modal.jsx';
import InputText from '../InputText/InputText.jsx';

import { configSettings, selectModes, selectStatus, selectMessage } from '../../store/slices/claimsSlice.js';
import { 
  claimsStatuses,
  errors, 
  messages, 
  methods,
  onPressedEnter, 
  publicPaths,
  rules, 
  sendRequestBodyfull,
  sendRequestBodyless,
  statusColors, 
  typeColors, 
} from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Login.scss';

function Login({ signal }) {



  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const navigate = useNavigate();
  const dispatch = useDispatch();


  
  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter                                  
  //------------------------------------------------------------//
  let [emailElement, setEmailElement] = useState();
  let [passwordElement, setPasswordElement] = useState();

  

  //------------------------------------------------------------//
  // Состояния input элементов                                
  //------------------------------------------------------------//
  const [email, setEmail] = useState({
    content: '', 
    error: errors.emailErrors.noEmail,
    focused: true,
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



  //------------------------------------------------------------//
  // Массивоподобный объект, хранящий данные для реализации 
  // смены фокуса при нажатии на кнопку Enter, а именно: id
  // элемента, сам элемент и его Tab позиция в форме.                                  
  //------------------------------------------------------------//
  const elements = {
    0: { id: 'fromLogin__email', state: emailElement, pos: 0 }, 
    1: { id: 'fromLogin__password', state: passwordElement, pos: 1 },
  } 

  
  
  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов                              
  //------------------------------------------------------------//
  function onEmailInput(e) {
    setEmail(state=>({...state, content: e.target.value}));
  }
  function onPasswordInput(e) {
    setPassword(state=>({...state, content: e.target.value}));
  }



  //------------------------------------------------------------//
  // Функция формирует содержание body-компонента AJAX запроса                              
  //------------------------------------------------------------//  
  function createBody() {
    return JSON.stringify({
      email: email.content,
      password: password.content
    });
  }



  //------------------------------------------------------------//
  // Функция, нормализующая данные, полученные с сервера                                  
  //------------------------------------------------------------//
  function handleData(arr, str) {
    let name;
    let database;
    let length;
    let obj;

    switch(str) {
      case 'type':    name = 'type';
                      database = typeColors;
                      length = typeColors.length;
                      obj = { id: length, type: 'Other', color: '#ADADAD' };
                      break;
      case 'status':  name = 'status';
                      database = statusColors;
                      length = statusColors.length;
                      obj = {id: length, status: 'UNDEFINED', color: '#ADADAD'}
                      break;
      default: return '';
    }

    let tempArr = arr.map((item, index) => ({
      id: index,
      [name]: item.name,
      slug: item.slug,
      color: database[index % length] 
    }));

    tempArr.push(obj);

    let tempObj = {};

    tempArr.forEach(item => tempObj[item.id] = item);

    return JSON.stringify(tempArr);
  }



  //------------------------------------------------------------//
  // Функция, устанавливающая все состояния input элементов
  // в изначальное положение                                 
  //------------------------------------------------------------//
  function setAllStatesDefault() {
    setEmail({
      content: '',
      error: errors.emailErrors.noEmail,
      focused: false,
      status: false, 
      touched: false, 
    });
    setPassword({
      content: '',
      error: errors.passwordErrors.noPassword,
      focused: false,
      status: false, 
      touched: false, 
    });
  }



  //------------------------------------------------------------//
  // Функция-организатор: собирает и/или проверяет необходимые
  // компоненты для AJAX-запроса и отправляет его.                             
  //------------------------------------------------------------// 
  function onSubmit(e) {
    e.preventDefault();

    let publicPath = publicPaths.auth;
    let method = methods.post;
    let bodyJSON = createBody();
    
    setAllStatesDefault();

    sendRequestBodyfull(publicPath, method, bodyJSON)
    .then(res => {
      switch (res.status) {
        case 200: return res.json();
        case 401: throw new Error(messages.noAuth);
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default); 
      }
    })
    .then(res => {
      if (res === null || typeof res !== 'object') throw new Error(messages.noData);
      
      if (!res.token) throw new Error(messages.noToken);
      else sessionStorage.setItem('token', res.token);  

      if (!res.role.name) throw new Error(messages.noRole);
      else sessionStorage.setItem('role', res.role.name);
      
      sessionStorage.setItem('offset', 0);
      sessionStorage.setItem('fullName', res.fullName ? res.fullName : 'Unknown');

      let publicPath = publicPaths.types;
      let method = methods.get;
      let token = sessionStorage.getItem('token');
      
      return sendRequestBodyless(publicPath, method, token);
    })
    .then(res => {
      switch (res.status) {
        case 200: return res.json();
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default);
      }
    }) 
    .then(res => {
      if (!Array.isArray(res)) throw new Error(messages.wrongData);
  
      sessionStorage.setItem('types', handleData(res, 'type'));

      let publicPath = publicPaths.status;
      let method = methods.get;
      let token = sessionStorage.getItem('token');

      return sendRequestBodyless(publicPath, method, token);
    })
    .then(res => {
      switch (res.status) {
        case 200: return res.json();
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default);
      }
    })
    .then(res => {
      if (!Array.isArray(res)) throw new Error(messages.wrongData);

      sessionStorage.setItem('statuses', handleData(res, 'status'));

      dispatch(configSettings({ status: claimsStatuses.ok }));
      debugger
      navigate('/base/claims');
    })
    .catch(err => {
      dispatch(configSettings({ status: claimsStatuses.error, message: err.message }));
    });
    
    dispatch(configSettings({ status: claimsStatuses.loading }));
  }

  



  //------------------------------------------------------------//
  // Обработчик события onFocus input элемента                            
  //------------------------------------------------------------// 
  function onFocus(setter) {
    setter(state=>({ ...state, focused: true }));
  }



  //------------------------------------------------------------//
  // Обработчик события onBlur input элемента                            
  //------------------------------------------------------------// 
  function onBlur(setter, checker) {
    setter(state=>({ ...state, touched: true, focused: false }));
    checker();
  }





  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onBlur. Нужна для того, чтобы 
  // отображать ошибки, если они есть, сразу после смены фокуса.                            
  //------------------------------------------------------------// 
  function checkEmail() {
    if (email.content.length !== 0 && !rules.emailRegExp.test(email.content)) {
      return setEmail(state => ({
        ...state, 
        status: false, 
        error: errors.emailErrors.wrongEmail
      }));
    }
    setEmail(state => ({...state, status: true, error: '' }));
  }
  function checkPassword() {
    if (email.content.length > 0 && password.content.length < rules.passwordLengthMin) {
      return setPassword(state => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.shortPassword
      }));
    }
    if (password.content.length > rules.passwordLengthMax) {
      return setPassword(state => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.longPassword
      }));
    }
    setPassword(state => ({ ...state, status: true, error: '' }));
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onChange. Нужна для того, чтобы 
  // определять отображать ли кнопку submit действующей или нет.                             
  //------------------------------------------------------------// 
  let isEmailOk = useMemo (() => !(
    email.content.length === 0 ||
    !rules.emailRegExp.test(email.content)
    ), [email]);
  
  let isPasswordOk = useMemo (() => !(
    password.content.length === 0 ||
    password.content.length < rules.passwordLengthMin ||
    password.content.length > rules.passwordLengthMax
    ), [password]);

    let isFormOk = useMemo (() => (
      isEmailOk &&
      isPasswordOk
      ), [email, password]);



  //------------------------------------------------------------//
  // Хук ищущий только после первого рендера нужные элемены 
  // DOM дерева и сохраняющий их в своответствующем состоянии                                 
  //------------------------------------------------------------//
  useEffect(() => {
    setEmailElement(document.getElementById(elements[0].id));
    setPasswordElement(document.getElementById(elements[1].id));
  }, []);



  //------------------------------------------------------------//
  // Хук, устанавливающий фокус на нужный input элемент по
  // получению сигнала                                
  //------------------------------------------------------------//
  useEffect(() => {
    if (emailElement) {
      emailElement.focus();
      setEmail(state => ({ ...state, touched: false }));
    }
  }, [signal]);



  //------------------------------------------------------------//
  // Функция, устанавливающая фокус на нужный input элемент
  // после сокрытия модального окна
  //------------------------------------------------------------//
  function setFocus() {
    emailElement.focus();
    setEmail(state => ({ ...state, touched: false }));
  }


  
  //--------------------------------------------------------------------

  return (
    <>
      <form className='Login__form'>
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
            onFocus: onFocus.bind(null, setEmail), 
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
            onFocus: onFocus.bind(null, setPassword), 
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
      {isFormOk ? (<button className='button2 xbutton1' onClick={ onSubmit }>Login</button>) : (<button className='button-inactiv xbutton1'>Login</button>)}

      </form>
      <Modal afterHideModalFunctionsArray={ [setFocus] }/>
    </>
  );
}

export default Login;

//----------------------------------------------------
    // let isValid = states.every(item => item.state.status);
    // if (!isValid) {
    //   states.forEach(item => {
    //     if (!item.state.status) item.setState(state=>({...state, touched: true}));
    //   });
    //   return;
    // }

//------------------------------------------------------

// let typesArray = res.map((item, index) => ({
//   id: index,
//   type: item.name,
//   slug: item.slug,
//   color: typeColors[index % typeColors.length] 
// }));

// typesArray.push({ id: typeColors.length, type: 'Other', color: '#ADADAD' });

// let typesObject = {};

// typesArray.forEach(item => typesObject[item.id] = item);

//---------------------------------------------------------------

// let statusesArray = res.map((item, index) => ({
//   id: index,
//   status: (item.name).toUpperCase(),
//   slug: item.slug,
//   color: statusColors[index % statusColors.length] 
// }));

// statusesArray.push({id: statusColors.length, status: 'UNDEFINED', color: '#ADADAD'});

// let statusesObject = {};
// statusesArray.forEach(item => statusesObject[item.id] = item);

//---------------------------------------------------------------

// if (password.content.length === 0) {
//   return setPassword(state => ({
//     ...state, 
//     status: false, 
//     error: errors.passwordErrors.noPassword
//   }));
// }

//----------------------------------------------------------------

// if (email.content.length === 0) {
//   return setEmail(state => ({
//     ...state, 
//     status: false, 
//     error: errors.emailErrors.noEmail
//   }));
// }

//------------------------------------------------------------

// const onKeyDown = e => {
//   if (e.code === 'Enter' || e.key === 'Enter') {
//     e.preventDefault();
//   }
// }

//------------------------------------------------------------

//------------------------------------------------------------//
  // Объединение состояний input элементов в массив для их 
  // более удобного обхода в некторых функциях                               
  //------------------------------------------------------------//
  // const states = [
  //   {state: email, setState: setEmail},
  //   {state: password, setState: setPassword},
  // ];