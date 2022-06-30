import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Modal from '../Modal/Modal.jsx';
import InputText from '../InputText/InputText.jsx';

import { createBody, getStatuses, getTypes, encrypt, decrypt } from '../../data/data.js';

import { configSettings } from '../../store/slices/claimsSlice.js';
import { 
  claimsStatuses,
  errors, 
  messages, 
  methods,
  onPressedEnter, 
  publicPaths,
  rules, 
  sendRequestBodyfull,
} from '../../data/data.js';

import c from '../../assets/styles/common.scss';
import s from './Login.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// группы элементов, находящихся на странице, расположенной по
// адресу: '/' и отвечающих за аутентификацию пользователя.                              
//------------------------------------------------------------//
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
  // при нажатии клавиши Enter.                                  
  //------------------------------------------------------------//
  const [emailElement, setEmailElement] = useState();
  const [passwordElement, setPasswordElement] = useState();

  

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
  const [keepLogged, setKeepLogged] = useState({
    content: false
  })



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
  // Группа переменных, содержащих результат валидации 
  // содержания input элементов по наступлению события onChange.  
  // Нужна для того, чтобы определять отображать ли кнопку submit 
  // действующей или нет.                             
  //------------------------------------------------------------// 
  const isEmailOk = useMemo (() => !(
    email.content.length === 0 ||
    !rules.emailRegExp.test(email.content)
    ), [email]);
  
  const isPasswordOk = useMemo (() => !(
    password.content.length === 0 ||
    password.content.length < rules.passwordLengthMin ||
    password.content.length > rules.passwordLengthMax
    ), [password]);

  const isFormOk = useMemo (() => (
      isEmailOk &&
      isPasswordOk
      ), [email, password]);



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов                              
  //------------------------------------------------------------//
  function onEmailInput(e) {
    setEmail(state => ({ ...state, content: e.target.value }));
  }
  function onPasswordInput(e) {
    setPassword(state => ({ ...state, content: e.target.value }));
  }
  function onKeepLogged() {
    setKeepLogged(state => ({ ...state, content: !state.content }));
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
  async function onSubmit(e) {
    e.preventDefault();
    dispatch(configSettings({ status: claimsStatuses.loading }));

    try {
      const publicPath = publicPaths.auth;
      const method = methods.post;
      const bodyJSON = createBody(email.content, password.content);
      let token;
      
      setAllStatesDefault();

      let res = await sendRequestBodyfull(publicPath, method, bodyJSON);

      if (
        !res || 
        typeof res !== 'object' || 
        !res.status || 
        isNaN(+res.status)
      ) throw new Error(messages.wrongData);

      switch (res.status) {
        case 200: res = await res.json(); break;
        case 401: throw new Error(messages.noAuth);
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default); 
      }

      if (!res || typeof res !== 'object') throw new Error(messages.noData);

      if (!res.token) throw new Error(messages.noToken);
      else {
        const encryptedToken = encrypt(res.token);
        sessionStorage.setItem('token', encryptedToken);
        token = res.token;
      }  

      if (!res.role.name) throw new Error(messages.noRole);
      else sessionStorage.setItem('role', res.role.name);

      sessionStorage.setItem('offset', 0);
      sessionStorage.setItem('fullName', res.fullName ? res.fullName : 'Unknown');
      sessionStorage.setItem('keepLogged', keepLogged.content);

      if (keepLogged.content) {
        
        const encryptedEmail = encrypt(email.content);
        const encryptedPassword = encrypt(password.content); 

        sessionStorage.setItem('email', encryptedEmail);
        sessionStorage.setItem('password', encryptedPassword);
      }

      await getTypes(token);
      await getStatuses(token);

      dispatch(configSettings({ status: claimsStatuses.ok }));
      navigate('/base/claims');
    }
    catch (err) {
      dispatch(configSettings({ status: claimsStatuses.error, message: err.message }));
    }
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
  // Функция, устанавливающая фокус на нужный input элемент
  // после сокрытия модального окна
  //------------------------------------------------------------//
  function setFocus() {
    emailElement.focus();
    setEmail(state => ({ ...state, touched: false }));
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
    setEmail(state => ({ ...state, status: true, error: '' }));
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
  // Хук, реагирующий на монтирование. Ищет нужные элементы
  // DOM дерева и сохраняет их в своответствующем состоянии.                                 
  //------------------------------------------------------------//
  useEffect(() => {
    setEmailElement(document.getElementById(elements[0].id));
    setPasswordElement(document.getElementById(elements[1].id));
  }, []);



  //------------------------------------------------------------//
  // Хук, реагирующий на изменение локального состояния signal.
  // Устанавливает фокус на нужный input элемент по получению
  // сигнала.                                
  //------------------------------------------------------------//
  useEffect(() => {
    if (emailElement) {
      emailElement.focus();
      setEmail(state => ({ ...state, touched: false }));
    }
  }, [signal]);



  //--------------------------------------------------------------------

  return (
    <>
      <form className={ s.form }>
      <div className={ s.inputText1Wrapper }>
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
      <div className={ s.inputText1Wrapper }>
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
      <div className={ s.checkboxWrapper }>
        <input  type='checkbox' 
                id='Login__checkbox' 
                name='Login__checkbox' 
                className={ s.checkbox } 
                onChange={ onKeepLogged }
        />
        <label htmlFor='' className={ c.text2 }>Keep me logged in</label>
      </div>
      { isFormOk ? (<button className={ `${c.button2} ${c.xbutton1}` } onClick={ onSubmit }>Login</button>) : (<button className={ `${c.buttonInactiv} ${c.xbutton1}` }>Login</button>) }

      </form>
      <Modal afterHideModalFunctionsArray={ [setFocus] }/>
    </>
  );
}

export default Login;