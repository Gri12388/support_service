import React, { useEffect, useMemo, useState } from 'react';
//import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../../hooks';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import Modal from '../Modal/Modal.jsx';
import InputText from '../InputText/InputText.jsx';

import { createBody, getStatuses, getTypes, encrypt, decrypt } from '../../data/data.js';

import { configSettings } from '../../store/slices/claimsSlice.js';
import { 
  checkLoginResponse,
  claimsStatuses,
  EresponseTypes,
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

import type { 
  IelementsObj,
  IinputElement,
  IloginResponse,
  IselElement,
  Isignal,
 } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// группы элементов, находящихся на странице, расположенной по
// адресу: '/' и отвечающих за аутентификацию пользователя.                              
//------------------------------------------------------------//
function Login({ signal } : Isignal) {

  

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const navigate : NavigateFunction = useNavigate();
  const dispatch = useAppDispatch();


  
  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter.                                  
  //------------------------------------------------------------//
  const [emailElement, setEmailElement] : [emailElement : HTMLElement | null, setEmailElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [passwordElement, setPasswordElement] : [passwordElement : HTMLElement | null, setPasswordElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);

  

  //------------------------------------------------------------//
  // Состояния input элементов                                
  //------------------------------------------------------------//
  const [email, setEmail] : [email : IinputElement, setEmail : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: errors.emailErrors.noEmail,
    focused: true,
    status: false, 
    touched: false, 
  } as IinputElement);
  const [password, setPassword] : [password : IinputElement, setPassword : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: errors.passwordErrors.noPassword,
    focused: false,
    status: false, 
    touched: false, 
  } as IinputElement);
  const [keepLogged, setKeepLogged] : [keepLogged : IselElement, setKeepLogged : React.Dispatch<React.SetStateAction<IselElement>>] = useState({
    content: false
  } as IselElement);



  //------------------------------------------------------------//
  // Массивоподобный объект, хранящий данные для реализации 
  // смены фокуса при нажатии на кнопку Enter, а именно: id
  // элемента, сам элемент и его Tab позиция в форме.                                  
  //------------------------------------------------------------//
  const elements: IelementsObj = {
    0: { id: 'fromLogin__email', state: emailElement, pos: 0 }, 
    1: { id: 'fromLogin__password', state: passwordElement, pos: 1 },
  } 

  
  
  //------------------------------------------------------------//
  // Группа переменных, содержащих результат валидации 
  // содержания input элементов по наступлению события onChange.  
  // Нужна для того, чтобы определять отображать ли кнопку submit 
  // действующей или нет.                             
  //------------------------------------------------------------// 
  const isEmailOk : boolean = useMemo (() => !(
    email.content.length === 0 ||
    !rules.emailRegExp.test(email.content)
    ), [email]);
  
  const isPasswordOk : boolean = useMemo (() => !(
    password.content.length === 0 ||
    password.content.length < rules.passwordLengthMin ||
    password.content.length > rules.passwordLengthMax
    ), [password]);

  const isFormOk : boolean = useMemo (() => (
      isEmailOk &&
      isPasswordOk
      ), [email, password]);



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов                              
  //------------------------------------------------------------//
  function onEmailInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail((state : IinputElement) => ({ ...state, content: e.target.value }));
  }
  function onPasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword((state : IinputElement) => ({ ...state, content: e.target.value }));
  }
  function onKeepLogged() {
    setKeepLogged((state : IselElement) => ({ ...state, content: !state.content }));
  }



  //------------------------------------------------------------//
  // Функция, устанавливающая все состояния input элементов
  // в изначальное положение                                 
  //------------------------------------------------------------//
  function setAllStatesDefault() : void {
    setEmail({
      content: '',
      error: errors.emailErrors.noEmail,
      focused: false,
      status: false, 
      touched: false, 
    } as IinputElement);
    setPassword({
      content: '',
      error: errors.passwordErrors.noPassword,
      focused: false,
      status: false, 
      touched: false, 
    } as IinputElement);
  }



  //------------------------------------------------------------//
  // Функция-организатор: собирает и/или проверяет необходимые
  // компоненты для AJAX-запроса и отправляет его.                             
  //------------------------------------------------------------// 
  async function onSubmit(e: React.FormEvent) : Promise<void> {
    e.preventDefault();
    dispatch(configSettings({ status: claimsStatuses.loading }));

    try {
      const publicPath: string = publicPaths.auth;
      const method: string = methods.post;
      const bodyJSON: string = createBody(email.content, password.content);
      let token : string;
      
      setAllStatesDefault();

      const res : Response = await sendRequestBodyfull(publicPath, method, bodyJSON);
      let resultUnchecked : any;

      switch (res.status) {
        case 200: resultUnchecked = await res.json(); break;
        case 401: throw new Error(messages.noAuth);
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default); 
      }

      if (!checkLoginResponse(resultUnchecked)) throw new Error(messages.wrongData);
      
      const result : IloginResponse = {} as IloginResponse;
      result.token = resultUnchecked.token.toString();

      const encryptedToken = encrypt(result.token);
      sessionStorage.setItem('token', encryptedToken);
      token = result.token;

      if (resultUnchecked.fullName) result.fullName = resultUnchecked.fullName.toString();
      else result.fullName = 'Unknown';

      if (!resultUnchecked.role.name) throw new Error(messages.noRole);
      result.role.name = resultUnchecked.role.name;
      sessionStorage.setItem('role', result.role.name);

      sessionStorage.setItem('offset', '0');
      sessionStorage.setItem('fullName', result.fullName!);
      sessionStorage.setItem('keepLogged', keepLogged.content.toString());

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
    catch (err: any) {
      dispatch(configSettings({ status: claimsStatuses.error, message: err.message }));
    }
  }

  

  //------------------------------------------------------------//
  // Обработчик события onFocus input элемента                            
  //------------------------------------------------------------// 
  function onFocus(setter: React.Dispatch<React.SetStateAction<IinputElement>>) : void {
    setter((state: IinputElement) : IinputElement => ({ ...state, focused: true }));
  }



  //------------------------------------------------------------//
  // Обработчик события onBlur input элемента                            
  //------------------------------------------------------------// 
  function onBlur(setter: React.Dispatch<React.SetStateAction<IinputElement>>, checker: () => void) : void {
    setter((state: IinputElement) : IinputElement => ({ ...state, touched: true, focused: false }));
    checker();
  }



  //------------------------------------------------------------//
  // Функция, устанавливающая фокус на нужный input элемент
  // после сокрытия модального окна
  //------------------------------------------------------------//
  function setFocus() : void {
    if (emailElement) emailElement.focus();
    setEmail((state: IinputElement) : IinputElement => ({ ...state, touched: false }));
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onBlur. Нужна для того, чтобы 
  // отображать ошибки, если они есть, сразу после смены фокуса.                            
  //------------------------------------------------------------// 
  function checkEmail() : void {
    if (email.content.length !== 0 && !rules.emailRegExp.test(email.content)) {
      return setEmail((state: IinputElement) : IinputElement => ({
        ...state, 
        status: false, 
        error: errors.emailErrors.wrongEmail
      }));
    }
    setEmail((state: IinputElement) : IinputElement => ({ ...state, status: true, error: '' }));
  }

  function checkPassword() : void {
    if (email.content.length > 0 && password.content.length < rules.passwordLengthMin) {
      return setPassword((state: IinputElement) : IinputElement => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.shortPassword
      }));
    }
    if (password.content.length > rules.passwordLengthMax) {
      return setPassword((state: IinputElement) : IinputElement => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.longPassword
      }));
    }
    setPassword((state: IinputElement) : IinputElement => ({ ...state, status: true, error: '' }));
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
      setEmail((state: IinputElement) : IinputElement => ({ ...state, touched: false }));
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