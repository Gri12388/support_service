import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import InputText from '../InputText/InputText.jsx';
import Modal from '../Modal/Modal.jsx';
import Sel from '../Sel/Sel.jsx';

import { configSettings } from '../../store/slices/claimsSlice.js';
import { 
  claimsStatuses,
  errors, 
  messages, 
  methods, 
  onPressedEnter,
  publicPaths, 
  reconnect,
  rules, 
  sendRequestBodyfull,
  setToken
} from '../../data/data.js';

import c from '../../assets/styles/common.scss';
import s from './OldClaim.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// уникальной части страницы, расположенной по адресу:
// '/base/claim'.                             
//------------------------------------------------------------//
function OldClaim() {
  
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();



  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage. Извлечение
  // token из sessionStorage проходит в два этапа: сначала 
  // извлекается закодированный token, потом он раскодируется. 
  // Хук useMemo не используется так как значение  
  // закодированного token всегда должно быть актуальным, в том 
  // числе после получения нового token. Значение token по ходу 
  // исполнения функции может поменяться, потому используется 
  // let.                                 
  //------------------------------------------------------------//
  const encryptedToken = sessionStorage.getItem('token');

  let token = useMemo(() => {
    return setToken(encryptedToken);
  }, [encryptedToken]);

  const keepLogged = useMemo(() => {
    return sessionStorage.getItem('keepLogged') === 'true';
  }, []);

  const email = useMemo(() => {
    if (!token && keepLogged) return sessionStorage.getItem('email');
    else return null;
  }, [token, keepLogged]);

  const password = useMemo(() => {
    if (!token && keepLogged) return sessionStorage.getItem('password');
    else return null;
  }, [token, keepLogged]);

  const types = useMemo(() => {
    return JSON.parse(sessionStorage.getItem('types')); 
  }, [token]);

  const statuses = useMemo(() => {
    return JSON.parse(sessionStorage.getItem('statuses'));
  }, [token]);



  //------------------------------------------------------------//
  // Устанавливаем ID типа, полученного в location.state. 
  // Нужен для установки изначального локального состояния type.                                   
  //------------------------------------------------------------// 
  const typeID = useMemo(() => {
    let temp = types.find(item => item.slug === location.state.typeSlug).id;
    let other = types.find(item => item.type === 'Other').id;
    return temp === other ? '' : temp.toString();
  }, []);



  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter.                                  
  //------------------------------------------------------------//
  let [titleElement, setTitleElement] = useState();
  let [typeElement, setTypeElement] = useState();
  let [descriptionElement, setDescriptionElement] = useState();



  //------------------------------------------------------------//
  // Создание локальных состояний input элементов.                                
  //------------------------------------------------------------//
  const [title, setTitle] = useState({
    content: location.state.title, 
    error: '',
    focused: true,
    status: false, 
    touched: false, 
  });
  const [description, setDescription] = useState({
    content: location.state.description, 
    error: '',
    focused: false,
    status: false, 
    touched: false, 
  });
  const [type, setType] = useState({
    content: typeID, 
    error: '',
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
    0: { id: 'fromOldClaim__title', state: titleElement, pos: 0 }, 
    1: { id: 'fromOldClaim__type', state: typeElement, pos: 1 },
    2: { id: 'fromOldClaim__description', state: descriptionElement, pos: 2 },
  } 



  //------------------------------------------------------------//
  // Группа переменных, содержащих результат валидации 
  // содержания input элементов по наступлению события onChange.  
  // Нужна для того, чтобы определять отображать ли кнопку submit 
  // действующей или нет.                             
  //------------------------------------------------------------// 
  const isTitleOk = useMemo (() => !(
    title.content.length === 0 ||
    title.content.length > rules.titleLengthMax
    ), [title]);
  
  const isDescriptionOk = useMemo (() => !(
    description.content.length === 0
    ), [description]);
  
  const isTypeOk = useMemo (() => !(
    type.content.length === 0
    ), [type]);
  
  const isFormOk = useMemo (() => (
    isTitleOk &&
    isDescriptionOk && 
    isTypeOk
    ), [title, description, type]);



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов.                              
  //------------------------------------------------------------//
  function onTitleInput(e) {
    setTitle(state => ({ ...state, content: e.target.value }));
  }
  function onDescriptionInput(e) {
    setDescription(state => ({ ...state, content: e.target.value }));
  }
  function onTypeInput(id) {
    setType(state => ({ ...state, content: id, touched: true, status: true }));
  }

  

  //------------------------------------------------------------//
  // Функция, устанавливающая все состояния input элементов
  // в изначальное положение.                                 
  //------------------------------------------------------------//
  function setAllStatesDefault() {
    setTitle({
      content: location.state.title,  
      error: '',
      focused: true,
      status: false, 
      touched: false, 
    });
    setDescription({
      content: location.state.description,
      error: '',
      focused: false,
      status: false, 
      touched: false, 
    });
    setType({
      content: typeID, 
      error: '',
      focused: false,
      status: false, 
      touched: false, 
    });
  }



  //------------------------------------------------------------//
  // Функция, формирующая содержание body-компонента AJAX 
  // запроса.                              
  //------------------------------------------------------------//  
  function createBody(act) {
    return JSON.stringify({
      title: title.content,
      description: description.content,
      type: types[type.content].slug,
      status: Object.values(statuses).find(item => item.status === act).slug,
    });
  }



  //------------------------------------------------------------//
  // Функция-организатор: собирает и/или проверяет необходимые
  // компоненты для AJAX-запроса и отправляет его.                             
  //------------------------------------------------------------// 
  async function submit(act) {
    
    if (!token && !keepLogged) {
      navigate('/');
      return;
    }
    
    dispatch(configSettings({ status: claimsStatuses.loading }));

    try {
      if (!token) {
        token = (await reconnect(email, password)).newToken;
      }
      
      let publicPath = publicPaths.claim + `/${location.state.id}`;
      let method = methods.put;
      let bodyJSON = createBody(act);
  
      setAllStatesDefault();

      let res = await sendRequestBodyfull(publicPath, method, bodyJSON, token);

      if (
        !res || 
        typeof res !== 'object' || 
        !res.status || 
        isNaN(+res.status)
      ) throw new Error(messages.wrongData);

      switch (res.status) {
        case 200: dispatch(configSettings({ status: 'ok' }));
                  navigate('/base/claims');
                  break;
        case 401: throw new Error(messages.noAuth);
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default); 
      }
    }
    catch(err) {
      dispatch(configSettings({ status: claimsStatuses.error, message: err.message }));
    }
  }



  //------------------------------------------------------------//
  // Обработчик события onFocus input элемента, к которму этот 
  // обработчик будет приставлен. Setter - setter локального
  // состояния.                            
  //------------------------------------------------------------// 
  function onFocus(setter) {
    setter(state=>({ ...state, focused: true }));
  }



  //------------------------------------------------------------//
  // Обработчик события onBlur input элемента, к которму этот 
  // обработчик будет приставлен. Setter - setter локального
  // состояния, checker - функция, валидирующая локальное 
  // состояние.                         
  //------------------------------------------------------------// 
  function onBlur(setter, checker) {
    setter(state=>({ ...state, touched: true, focused: false }));
    checker();
  }



  //------------------------------------------------------------//
  // Обработчики кнопок 'Cancel', 'Done' и 'Decline'.                             
  //------------------------------------------------------------// 
  function onCancel(e) {
    e.preventDefault();
    navigate('/base/claims');
  };

  function onDone(e) {
    e.preventDefault();
    submit('Done');
  }

  function onDecline(e) {
    e.preventDefault();
    submit('Declined');
  }



  //------------------------------------------------------------//
  // Функция, устанавливающая фокус на нужный input элемент
  // после сокрытия модального окна.
  //------------------------------------------------------------//
  function setFocus() {
    titleElement.focus();
    setTitleElement(state => ({ ...state, touched: false }));
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onBlur. Нужна для того, чтобы 
  // отображать ошибки, если они есть, сразу после смены фокуса.                            
  //------------------------------------------------------------// 
  function checkTitle() {
    if (title.content.length > rules.titleLengthMax) {
      return setTitle(state => ({
        ...state, 
        status: false, 
        error: errors.titleErrors.longTitle
      }));
    }
    setTitle(state => ({ ...state, status: true, error: '' }));
  }
  function checkDescription() {
    setDescription(state=>({...state, status: true, error: ''}));
  }
  function checkType () {
    setType(state => ({ ...state, status: true, error: '' }));
  }



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Ищет нежные элементы 
  // DOM дерева и сохраняющий их в своответствующем локальном 
  // состоянии.                                 
  //------------------------------------------------------------//  
  useEffect(() => {
    setTitleElement(document.getElementById(elements[0].id));
    setTypeElement(document.getElementById(elements[1].id));
    setDescriptionElement(document.getElementById(elements[2].id));
  }, []);



  //--------------------------------------------------------------------

  return(
    <>
      <form className={ c.container2 }>
        <div className={ c.subcontainer }>
          <p className={ `${c.text4} ${s.title}` }>Incoming claim</p>
          <section className={ s.input }>
            <InputText 
              id={ elements[0].id }
              label='TITLE'
              placeholder='Type claim title'
              value={ title.content }
              state={ title }
              callbacks={{
                onChange: onTitleInput, 
                onFocus: onFocus.bind(null, setTitle), 
                onBlur: onBlur.bind(null, setTitle, checkTitle),
                onPressedEnter: onPressedEnter(elements)
              }}
            />
          </section>
          <section className={ s.input }>
            <Sel 
              id={ elements[1].id }
              label='TYPE'
              groupId={ 'fromOldClaim__sel1' }
              placeholder='Select type'
              value={ type.content }
              state={ type }
              callbacks={{
                onChange: onTypeInput, 
                onFocus: onFocus.bind(null, setType), 
                onBlur: onBlur.bind(null, setType, checkType),
                onPressedEnter: onPressedEnter(elements)
              }}
            />
          </section>
          <section className={ s.input }>
            <InputText 
              id={ elements[2].id }
              label='DESCRIPTION'
              placeholder='Type claim description'
              value={ description.content }
              state={ description }
              callbacks={{
                onChange: onDescriptionInput, 
                onFocus: onFocus.bind(null, setDescription), 
                onBlur: onBlur.bind(null, setDescription, checkDescription),
                onPressedEnter: onPressedEnter(elements)
              }}
            />
          </section>
          <section className={ s.buttons }>
            <button className={ `${c.button3} ${s.button}` } onClick={ onCancel }>Cancel</button>
            { isFormOk ? (<button className={ `${c.button2} ${c.xbutton1} ${s.button}` } onClick={ onDone }>Done</button>) : (<button className={ `${c.buttonInactiv} ${c.xbutton1} ${s.button}` }>Done</button>) }
            { isFormOk ? (<button className={ `${c.button1} ${c.xbutton1} ${s.button}` } onClick={ onDecline }>Decline</button>) : (<button className={ `${c.buttonInactiv} ${c.xbutton1} ${s.button}` }>Decline</button>) }
          </section>
        </div>
      </form>
      <Modal afterHideModalFunctionsArray={ [setFocus] }/>
    </>
  ); 
}

export default OldClaim;