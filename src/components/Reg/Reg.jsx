import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import InputText from '../InputText/InputText.jsx';

import { configSettings, selectMessage, selectModes, selectStatus } from '../../store/slices/claimsSlice.js';
import {  
  checkForm, 
  claimsModes,
  claimsStatuses,
  errors, 
  messages, 
  methods, 
  onPressedEnter, 
  publicPaths,
  rules, 
  sendRequestBodyfull
} from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Reg.scss';

import loadingImage from '../../assets/images/loading.png';




function Reg() {
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с claimsSlice.js                                  
  //------------------------------------------------------------//
  let claimMode = useSelector(selectModes);
  let claimStatus = useSelector(selectStatus);
  let claimMessage = useSelector(selectMessage);
  const dispatch = useDispatch(); 



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
  // Состояния input элементов                                
  //------------------------------------------------------------//
  let [name, setName] = useState({
    content: '',
    error: errors.nameErrors.noName,
    focused: true, 
    status: false, 
    touched: false, 
  });
  let [surname, setSurname] = useState({
    content: '', 
    error: errors.surnameErrors.noSurname,
    fucused: false,
    status: false, 
    touched: false, 
  });
  let [email, setEmail] = useState({
    content: '', 
    error: errors.emailErrors.noEmail,
    focused: false,
    status: false, 
    touched: false, 
  });
  let [password, setPassword] = useState({
    content: '', 
    error: errors.passwordErrors.noPassword,
    focused: false,
    status: false, 
    touched: false, 
  });
  let [passwordCopy, setPasswordCopy] = useState({
    content: '', 
    error: errors.passwordErrors.noPassword,
    focused: false,
    status: false, 
    touched: false, 
  });

  //------------------------------------------------------------//
  // Объединение состояний input элементов в массив для их 
  // более удобного обхода в некторых функциях                               
  //------------------------------------------------------------//
  const states = [
    {state: name, setState: setName},
    {state: surname, setState: setSurname},
    {state: email, setState: setEmail},
    {state: password, setState: setPassword},
    {state: passwordCopy, setState: setPasswordCopy},
  ];
  


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
  // Обработчик кнопки "Try again", появляющейся в 
  // информационном сообщении в случае неудачной попытки 
  // регистрации. Функция приводит форму в изначальное состояние.                              
  //------------------------------------------------------------//
  function onTryAgainButton() {
    dispatch(configSettings({ status: claimsStatuses.ok, message: '' }));
    nameElement.focus();
    setName({
      content: '',
      error: errors.nameErrors.noName,
      focused: true,
      status: false, 
      touched: false, 
    });
    setSurname({
      content: '',
      error: errors.surnameErrors.noSurname,
      focused: false,
      status: false, 
      touched: false, 
    });
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
    setPasswordCopy({
      content: '',
      error: errors.passwordErrors.noPassword,
      focused: false,
      status: false, 
      touched: false, 
    });
  }



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов                              
  //------------------------------------------------------------//
  function onNameInput(e) {
    setName(state => ({...state, content: e.target.value }));
  }
  function onSurnameInput(e) {
    setSurname(state => ({ ...state, content: e.target.value }));
  }
  function onEmailInput(e) {
    setEmail(state => ({ ...state, content: e.target.value }));
  };
  function onPasswordInput(e) {
    setPassword(state => ({ ...state, content: e.target.value }));
  }
  function onPasswordCopyInput(e) {
    setPasswordCopy(state=>({...state, content: e.target.value}));
  }
  


  //------------------------------------------------------------//
  // Функция формирует содержание body-компонента AJAX запроса                              
  //------------------------------------------------------------//  
  function createBody() {
    return JSON.stringify({
      fullName: name.content + ' ' + surname.content,
      email: email.content,
      password: password.content
    });
  }



  //------------------------------------------------------------//
  // Функция-организатор: собирает и/или проверяет необходимые
  // компоненты для AJAX-запроса и отправляет его.                             
  //------------------------------------------------------------// 
  function onSubmit(e) {
    e.preventDefault();

    let publicPath = publicPaths.reg;
    let method = methods.post;
    let bodyJSON = createBody();
    
    sendRequestBodyfull(publicPath, method, bodyJSON)
    .then(res => {
      switch (res.status) {
        case 200: dispatch(configSettings({ status: claimsStatuses.message, message: messages.regGood }));
                  break;
        case 409: throw new Error(messages.alreadyRegistered);
        default:  throw new Error(messages.regBad);
      }
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
    setter(state=>({...state, touched: true, focused: false}));
    checker();
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onBlur. Нужна для того, чтобы 
  // отображать ошибки, если они есть, сразу после смены фокуса.                            
  //------------------------------------------------------------// 
  function checkName() {
    if (name.content.length === 0) {
      return setName(state => ({
        ...state, 
        status: false, 
        error: errors.nameErrors.noName
      }));
    }
    if (name.content.length < rules.nameLengthMin) {
      return setName(state => ({
        ...state, 
        status: false, 
        error: errors.nameErrors.shortName
      }));
    }
    if (name.content.length > rules.nameLengthMax) {
      return setName(state => ({
        ...state, 
        status: false, 
        error: errors.nameErrors.longName
      }));
    }
    setName(state => ({ ...state, status: true, error: '' }));
  }
  function checkSurname() {
    if (surname.content.length === 0) {
      return setSurname( state=> ({
        ...state, 
        status: false, 
        error: errors.surnameErrors.noSurname
      }));
    }
    if (surname.content.length < rules.surnameLengthMin) {
      return setSurname(state => ({
        ...state, 
        status: false, 
        error: errors.surnameErrors.shortSurname
      }));
    }
    if (surname.content.length > rules.surnameLengthMax) {
      return setSurname(state => ({
        ...state, 
        status: false, 
        error: errors.surnameErrors.longSurname
      }));
    }
    setSurname(state => ({ ...state, status: true, error: '' }));
  }
  function checkEmail() {
    if (email.content.length === 0) {
      return setEmail(state => ({
        ...state, 
        status: false, 
        error: errors.emailErrors.noEmail
      }));
    }
    if (!rules.emailRegExp.test(email.content)) {
      return setEmail(state => ({
        ...state, 
        status: false, 
        error: errors.emailErrors.wrongEmail
      }));
    }
    setEmail(state => ({ ...state, status: true, error: '' }));
  }
  function checkPassword() {
    if (password.content.length === 0) {
      return setPassword(state => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.noPassword
      }));
    }
    if (password.content.length < rules.passwordLengthMin) {
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
  function checkPasswordCopy() {
    if (passwordCopy.content.length === 0) {
      return setPasswordCopy(state => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.noPassword
      }));
    }
    if (passwordCopy.content !== password.content) {
      return setPasswordCopy(state => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.noMatch
      }));
    }
    setPasswordCopy(state => ({ ...state, status: true, error: '' }));
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onChange. Нужна для того, чтобы 
  // определять отображать ли кнопку submit действующей или нет.                             
  //------------------------------------------------------------// 
  let isNameOk = useMemo (() => !(
    name.content.length === 0 ||
    name.content.length < rules.nameLengthMin ||
    name.content.length > rules.nameLengthMax
    ), [name]);

  let isSurnameOk = useMemo (() => !(
    surname.content.length === 0 ||
    surname.content.length < rules.surnameLengthMin ||
    surname.content.length > rules.surnameLengthMax
    ), [surname]);

  let isEmailOk = useMemo (() => !(
    email.content.length === 0 ||
    !rules.emailRegExp.test(email.content)
    ), [email]);
  
  let isPasswordOk = useMemo (() => !(
    password.content.length === 0 ||
    password.content.length < rules.passwordLengthMin ||
    password.content.length > rules.passwordLengthMax
    ), [password]);

  let isPasswordCopyOk = useMemo (() => !(
    passwordCopy.content.length === 0 ||
    passwordCopy.content !== password.content
    ), [passwordCopy]);

  let isFormOk = useMemo (() => (
    isNameOk &&
    isSurnameOk && 
    isEmailOk &&
    isPasswordOk &&
    isPasswordCopyOk
    ), [name, surname, email, password, passwordCopy]); 



  //------------------------------------------------------------//
  // Данный хук ищет нужные элемены DOM дерева только после 
  // первого рендера и сохраняет их в своответствующем состоянии                                 
  //------------------------------------------------------------//
  useEffect(() => {
    setNameElement(document.getElementById(elements[0].id));
    setSurnameElement(document.getElementById(elements[1].id));
    setEmailElement(document.getElementById(elements[2].id));
    setPasswordElement(document.getElementById(elements[3].id));
    setPasswordCopyElement(document.getElementById(elements[4].id));
  }, []);

  

  //--------------------------------------------------------------------

  return (
    <div className='container3'>
      {claimMode === claimsModes.modal && claimStatus === claimsStatuses.ok && (
        <form className='Reg__modal'>
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
          
          {isFormOk ? (<button className='button2 xbutton1' onClick={ onSubmit }>Register</button>) : (<button className='button-inactiv xbutton1'>Register</button>)}
        
          <div className='button2 close-button' id='Reg__button'>╳</div>
        </form>
      )}
      {claimMode === claimsModes.modal && claimStatus === claimsStatuses.loading && (
        <div className='Reg__modal1'>
          <img src={ loadingImage } alt='loading' className='loading' />
          <p className='text3'>Loading...</p>
        </div>  
      )}
      {claimMode === claimsModes.modal && (claimStatus === claimsStatuses.message || claimStatus === claimsStatuses.error) && (
        <div className='Reg__modal2'>
          <p className='text3'>{ claimMessage }</p>
          {claimStatus === claimsStatuses.error && (
            <button className='button4' onClick={ onTryAgainButton }>Try again?</button>
          )}
          <div className='button2 close-button' id='Reg__button'>╳</div>
        </div>
      )}
      
    </div>
  );
}

export default Reg;

//---------------------------------------------------
// if (!checkForm(states)) {
//   states.forEach(item => {
//     if (!item.state.status) item.setState(state=>({...state, touched: true}));
//   });
//   return;
// }