import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import InputText from '../InputText/InputText.jsx';
import Modal from '../Modal/Modal.jsx';
import Sel from '../Sel/Sel.jsx';

import { configSettings } from '../../store/slices/claimsSlice.js';
import { 
  claims,
  errors, 
  messages, 
  methods, 
  onPressedEnter,
  publicPaths, 
  rules, 
  sendRequestBodyfull
} from '../../data/data.js';

import '../../assets/styles/common.scss';
import './NewClaim.scss';

function NewClaim() {
  
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();



  //------------------------------------------------------------//
  // Получение необходимых данных из sessionStorage                                  
  //------------------------------------------------------------// 
  const types = useMemo(() => {
    return JSON.parse(sessionStorage.getItem('types')); 
  }, []);
  const statuses = useMemo(() => {
    return JSON.parse(sessionStorage.getItem('statuses'));
  }, []);
  const token = useMemo(() => {
    return sessionStorage.getItem('token');
  }, []);



  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter                                  
  //------------------------------------------------------------//
  let [titleElement, setTitleElement] = useState();
  let [typeElement, setTypeElement] = useState();
  let [descriptionElement, setDescriptionElement] = useState();



  //------------------------------------------------------------//
  // Состояния input элементов                                
  //------------------------------------------------------------//
  const [title, setTitle] = useState({
    content: '', 
    error: errors.titleErrors.noTitle,
    focused: true,
    status: false, 
    touched: false, 
  });
  const [description, setDescription] = useState({
    content: '', 
    error: errors.descriptionError.noDescription,
    focused: false,
    status: false, 
    touched: false, 
  });
  const [type, setType] = useState({
    content: '', 
    error: errors.typeError.noType,
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
    0: { id: 'fromNewClaim__title', state: titleElement, pos: 0 }, 
    1: { id: 'fromNewClaim__type', state: typeElement, pos: 1 },
    2: { id: 'fromNewClaim__description', state: descriptionElement, pos: 2 },
  } 



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов                              
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
  // в изначальное положение                                 
  //------------------------------------------------------------//
  function setAllStatesDefault() {
    setTitle({
      content: '', 
      error: errors.titleErrors.noTitle,
      focused: true,
      status: false, 
      touched: false, 
    });
    setDescription({
      content: '', 
      error: errors.descriptionError.noDescription,
      focused: false,
      status: false, 
      touched: false, 
    });
    setType({
      content: '', 
      error: errors.typeError.noType,
      focused: false,
      status: false, 
      touched: false, 
    });
  }



  //------------------------------------------------------------//
  // Функция формирует содержание body-компонента AJAX запроса                              
  //------------------------------------------------------------//  
  function createBody() {
    return JSON.stringify({
      title: title.content,
      description: description.content,
      type: types[type.content].slug,
      status: Object.values(statuses).find(item => item.status === claims.new).slug,
    });
  }



  //------------------------------------------------------------//
  // Функция-организатор: собирает и/или проверяет необходимые
  // компоненты для AJAX-запроса и отправляет его.                             
  //------------------------------------------------------------// 
  function onSubmit(e) {
    e.preventDefault();

    let publicPath = publicPaths.claim;
    let method = methods.post;;
    let bodyJSON = createBody();

    setAllStatesDefault()

    sendRequestBodyfull(publicPath, method, bodyJSON, token)
    .then(res => {
      if (
        !res || 
        typeof res !== 'object' || 
        !res.status || 
        isNaN(+res.status)
      ) throw new Error(messages.wrongData);

      switch (res.status) {
        case 200: dispatch(configSettings({ status: 'ok' }));
                  sessionStorage.setItem('offset', 'last');
                  navigate('/base/claims');
                  break;
        case 401: throw new Error(messages.noAuth);
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default); 
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
    setter(state=>({ ...state, touched: true, focused: false }));
    checker();
  }



  //------------------------------------------------------------//
  // Обработчик кнопки Cancel.                             
  //------------------------------------------------------------// 
  function onCancel(e) {
    e.preventDefault();
    navigate('/base/claims');
  };



  //------------------------------------------------------------//
  // Функция, устанавливающая фокус на нужный input элемент
  // после сокрытия модального окна
  //------------------------------------------------------------//
  function setFocus() {
    titleElement.focus();
    setEmail(state => ({ ...state, touched: false }));
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
  // Группа переменных, содержащих результат валидации 
  // содержания input элементов по наступлению события onChange.  
  // Нужна для того, чтобы определять отображать ли кнопку submit 
  // действующей или нет.                             
  //------------------------------------------------------------// 
  let isTitleOk = useMemo (() => !(
    title.content.length === 0 ||
    title.content.length > rules.titleLengthMax
    ), [title]);
  
  let isDescriptionOk = useMemo (() => !(
    description.content.length === 0
    ), [description]);
  
  let isTypeOk = useMemo (() => !(
    type.content.length === 0
    ), [type]);
  
  let isFormOk = useMemo (() => (
    isTitleOk &&
    isDescriptionOk && 
    isTypeOk
    ), [title, description, type]);



  //------------------------------------------------------------//
  // Хук, ищущий только после первого рендера нужные элемены 
  // DOM дерева и сохраняющий их в своответствующем состоянии                                 
  //------------------------------------------------------------//  
    useEffect(() => {
      setTitleElement(document.getElementById(elements[0].id));
      setTypeElement(document.getElementById(elements[1].id));
      setDescriptionElement(document.getElementById(elements[2].id));
    }, []);



  //--------------------------------------------------------------------

  return(
    <>
      <form className='container2'>
        <div className='subcontainer'>
          <p className='text4 NewClaim__title'>Creating new claim</p>
          <section className='NewClaim__input'>
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
          <section className='NewClaim__input'>
            <Sel 
              id={ elements[1].id }
              label='TYPE'
              groupId={ 'fromNewClaim__sel1' }
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
          <section className='NewClaim__input'>
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
          <section className='NewClaim__buttons'>
            <button className='button3 NewClaim__button' onClick={ onCancel }>Cancel</button>
            { isFormOk ? (<button className='button2 xbutton1 NewClaim__button' onClick={ onSubmit }>Create</button>) : (<button className='button-inactiv xbutton1 NewClaim__button'>Create</button>) }
          </section>
        </div>
      </form>
      <Modal afterHideModalFunctionsArray={ [setFocus] }/>
    </>
  ); 
}

export default NewClaim;

