import React, { useEffect, useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';

import InputText from '../InputText/InputText';

import { configSettings, selectMessage, selectModes, selectStatus } from '../../store/slices/claimsSlice';
import {  
  claimsModes,
  claimsStatuses,
  errors, 
  messages, 
  methods, 
  onPressedEnter, 
  publicPaths,
  rules, 
  sendRequestBodyfull
} from '../../data/data';

import c from '../../assets/styles/common.scss';
import s from './Reg.scss';

import loadingImage from '../../assets/images/loading.png';

import type { IelementsObj, IinputElement } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// группы элементов, находящихся на странице, расположенной по
// адресу: '/' и отвечающих за регистрацию пользователя.                              
//------------------------------------------------------------//
function Reg() : JSX.Element {
  
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с claimsSlice                                  
  //------------------------------------------------------------//
  const claimMode = useAppSelector(selectModes);
  const claimStatus = useAppSelector(selectStatus);
  const claimMessage = useAppSelector(selectMessage);
  const dispatch = useAppDispatch(); 



  //------------------------------------------------------------//
  // Имя компонента.                                 
  //------------------------------------------------------------//
  const componentName : string = 'Reg';



  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter                                  
  //------------------------------------------------------------//
  const [nameElement, setNameElement] : [nameElement : HTMLElement | null, setNameElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [surnameElement, setSurnameElement] : [surnameElement : HTMLElement | null, setSurnameElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [emailElement, setEmailElement] : [emailElement : HTMLElement | null, setEmailElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [passwordElement, setPasswordElement] : [passwordElement : HTMLElement | null, setPasswordElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [passwordCopyElement, setPasswordCopyElement] : [passwordCopyElement : HTMLElement | null, setPasswordCopyElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  


  //------------------------------------------------------------//
  // Локальные состояния input элементов                                
  //------------------------------------------------------------//
  const [name, setName] : [name : IinputElement, setName : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '',
    error: errors.nameErrors.noName,
    focused: true, 
    status: false, 
    touched: false, 
  } as IinputElement);

  const [surname, setSurname] : [surname : IinputElement, setSurname : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: errors.surnameErrors.noSurname,
    focused: false,
    status: false, 
    touched: false, 
  } as IinputElement);

  const [email, setEmail] : [email : IinputElement, setEmail : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: errors.emailErrors.noEmail,
    focused: false,
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

  const [passwordCopy, setPasswordCopy] : [passwordCopy : IinputElement, setPasswordCopy : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: errors.passwordErrors.noPassword,
    focused: false,
    status: false, 
    touched: false, 
  } as IinputElement);



  //------------------------------------------------------------//
  // Массивоподобный объект, хранящий данные для реализации 
  // смены фокуса при нажатии на кнопку Enter, а именно: id
  // элемента, сам элемент и его Tab позиция в форме.                                   
  //------------------------------------------------------------//
  const elements : IelementsObj = {
    0: { id: 'fromReg__name', state: nameElement, pos: 0 }, 
    1: { id: 'fromReg__surname', state: surnameElement, pos: 1 },
    2: { id: 'fromReg__email', state: emailElement, pos: 2 },
    3: { id: 'fromReg__password', state: passwordElement, pos: 3 },
    4: { id: 'fromReg__password-copy', state: passwordCopyElement, pos: 4 },
  } 


  
  //------------------------------------------------------------//
  // Функция, устанавливающая все состояния input элементов
  // в изначальное положение                                 
  //------------------------------------------------------------//
  function setAllStatesDefault() : void {
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
  // Обработчик кнопки "Try again", появляющейся в 
  // информационном сообщении в случае неудачной попытки 
  // регистрации. Функция приводит форму в изначальное состояние.                              
  //------------------------------------------------------------//
  function onTryAgainButton() : void {
    dispatch(configSettings({ status: claimsStatuses.ok, message: '' }));
    if (nameElement) nameElement.focus();
    setAllStatesDefault();
  }



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов                              
  //------------------------------------------------------------//
  function onNameInput(e: React.ChangeEvent<HTMLInputElement>) {
    setName((state : IinputElement) => ({...state, content: e.target.value }));
  }
  function onSurnameInput(e: React.ChangeEvent<HTMLInputElement>) {
    setSurname((state : IinputElement) => ({ ...state, content: e.target.value }));
  }
  function onEmailInput(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail((state : IinputElement) => ({ ...state, content: e.target.value }));
  }
  function onPasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword((state : IinputElement) => ({ ...state, content: e.target.value }));
  }
  function onPasswordCopyInput(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordCopy((state : IinputElement) => ({...state, content: e.target.value}));
  }
  


  //------------------------------------------------------------//
  // Функция формирует содержание body-компонента AJAX запроса                              
  //------------------------------------------------------------//  
  function createBody() : string {
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
  function onSubmit(e: React.FormEvent) : void {
    e.preventDefault();

    const publicPath : string = publicPaths.reg;
    const method : string = methods.post;
    const bodyJSON : string = createBody();
    
    sendRequestBodyfull(publicPath, method, bodyJSON)
    .then((res : Response) => {
      switch (res.status) {
        case 200: dispatch(configSettings({ status: claimsStatuses.message, message: messages.regGood }));
                  break;
        case 409: throw new Error(messages.alreadyRegistered);
        default:  throw new Error(messages.regBad);
      }
    })
    .catch((err : any) => {
      console.error(`${err.message} at ${componentName} component`);
      dispatch(configSettings({ status: claimsStatuses.error, message: err.message }));
    });

    dispatch(configSettings({ status: claimsStatuses.loading }));
  }



  //------------------------------------------------------------//
  // Обработчик события onFocus input элемента                            
  //------------------------------------------------------------//   
  function onFocus(setter: React.Dispatch<React.SetStateAction<IinputElement>>) : void {
    setter((state: IinputElement)=>({ ...state, focused: true }));
  }



  //------------------------------------------------------------//
  // Обработчик события onBlur input элемента                            
  //------------------------------------------------------------//   
  function onBlur(setter: React.Dispatch<React.SetStateAction<IinputElement>>, checker: () => void) : void {
    setter((state: IinputElement) => ({...state, touched: true, focused: false}));
    checker();
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onBlur. Нужна для того, чтобы 
  // отображать ошибки, если они есть, сразу после смены фокуса.                            
  //------------------------------------------------------------// 
  function checkName() : void {
    if (name.content.length === 0) {
      return setName((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.nameErrors.noName
      }));
    }
    if (name.content.length < rules.nameLengthMin) {
      return setName((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.nameErrors.shortName
      }));
    }
    if (name.content.length > rules.nameLengthMax) {
      return setName((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.nameErrors.longName
      }));
    }
    setName((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }

  function checkSurname() : void {
    if (surname.content.length === 0) {
      return setSurname((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.surnameErrors.noSurname
      }));
    }
    if (surname.content.length < rules.surnameLengthMin) {
      return setSurname((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.surnameErrors.shortSurname
      }));
    }
    if (surname.content.length > rules.surnameLengthMax) {
      return setSurname((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.surnameErrors.longSurname
      }));
    }
    setSurname((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }

  function checkEmail() : void {
    if (email.content.length === 0) {
      return setEmail((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.emailErrors.noEmail
      }));
    }
    if (!rules.emailRegExp.test(email.content)) {
      return setEmail((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.emailErrors.wrongEmail
      }));
    }
    setEmail((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }

  function checkPassword() : void {
    if (password.content.length === 0) {
      return setPassword((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.noPassword
      }));
    }
    if (password.content.length < rules.passwordLengthMin) {
      return setPassword((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.shortPassword
      }));
    }
    if (password.content.length > rules.passwordLengthMax) {
      return setPassword((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.longPassword
      }));
    }
    setPassword((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }

  function checkPasswordCopy() : void {
    if (passwordCopy.content.length === 0) {
      return setPasswordCopy((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.noPassword
      }));
    }
    if (passwordCopy.content !== password.content) {
      return setPasswordCopy((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.passwordErrors.noMatch
      }));
    }
    setPasswordCopy((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onChange. Нужна для того, чтобы 
  // определять отображать ли кнопку submit действующей или нет.                             
  //------------------------------------------------------------// 
  const isNameOk : boolean = useMemo (() => !(
    name.content.length === 0 ||
    name.content.length < rules.nameLengthMin ||
    name.content.length > rules.nameLengthMax
    ), [name]);

  const isSurnameOk : boolean = useMemo (() => !(
    surname.content.length === 0 ||
    surname.content.length < rules.surnameLengthMin ||
    surname.content.length > rules.surnameLengthMax
    ), [surname]);

  const isEmailOk : boolean = useMemo (() => !(
    email.content.length === 0 ||
    !rules.emailRegExp.test(email.content)
    ), [email]);
  
  const isPasswordOk : boolean = useMemo (() => !(
    password.content.length === 0 ||
    password.content.length < rules.passwordLengthMin ||
    password.content.length > rules.passwordLengthMax
    ), [password]);

  const isPasswordCopyOk : boolean = useMemo (() => !(
    passwordCopy.content.length === 0 ||
    passwordCopy.content !== password.content
    ), [passwordCopy]);

  const isFormOk : boolean = useMemo (() => (
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
    <div className={ c.container3 }>
      { claimMode === claimsModes.modal && claimStatus === claimsStatuses.ok && (
        <form className={ s.modal }>
          <section className={ s.section }>
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
          <section className={ s.section }>
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
          <section className={ s.section }>
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
          <section className={ s.section }>
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
          <section className={ s.section }>
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
          
          { isFormOk ? (<button className={ `${c.button2} ${c.xbutton1}` } onClick={ onSubmit }>Register</button>) : (<button className={ `${c.buttonInactiv} ${c.xbutton1}` }>Register</button>)}
        
          <div className={ `${c.button2} ${c.closeButton}` } id='Reg__button'>╳</div>
        </form>
      )}
      { claimMode === claimsModes.modal && claimStatus === claimsStatuses.loading && (
        <div className={ s.modal1 }>
          <img src={ loadingImage } alt='loading' className={ c.loading } />
          <p className={ c.text3 }>Loading...</p>
        </div>  
      )}
      { claimMode === claimsModes.modal && (claimStatus === claimsStatuses.message || claimStatus === claimsStatuses.error) && (
        <div className={ s.modal2 }>
          <p className={ c.text3 }>{ claimMessage }</p>
          { claimStatus === claimsStatuses.error && (
            <button className={ c.button4 } onClick={ onTryAgainButton }>Try again?</button>
          )}
          <div className={ `${c.button2} ${c.closeButton}` } id='Reg__button'>╳</div>
        </div>
      )}

    </div>
  );
}

export default Reg;