import React, { useEffect, useMemo, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../hooks';

import InputText from '../InputText/InputText';
import Modal from '../Modal/Modal';
import Sel from '../Sel/Sel';

import { configSettings } from '../../store/slices/claimsSlice';
import { 
  claims,
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
} from '../../data/data';

import c from '../../assets/styles/common.scss';
import s from './NewClaim.scss';

import type { IelementsObj, IinputElement, Iobj, IobjObj } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// уникальной части страницы, расположенной по адресу:
// '/base/new'.                             
//------------------------------------------------------------//
function NewClaim() : JSX.Element {

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useAppDispatch();
  const navigate : NavigateFunction = useNavigate();



  //------------------------------------------------------------//
  // Имя компонента.                                 
  //------------------------------------------------------------//
  const componentName = 'NewClaim';



  //------------------------------------------------------------//
  // Локальное состояние isError отвечает за распознание 
  // появления в коде сгенерированных ошибок.                                 
  //------------------------------------------------------------//
  const [isError, setIsError] : [isError : boolean, setIsError : React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  
  
  
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
  const encryptedToken : string | null = sessionStorage.getItem('token');

  let token : string | null = useMemo(() => {
    if (isError) return '';
    if (encryptedToken === null) {
      console.error(`${messages.noToken} at ${componentName} component`);
      setIsError(true);
      return '';
    }
    return setToken(encryptedToken);
  }, [encryptedToken]);

  const keepLogged : boolean = useMemo(() => {
    return sessionStorage.getItem('keepLogged') === 'true';
  }, []);

  const email : string | null = useMemo(() => {
    if (isError) return null;
    if (!token && keepLogged) return sessionStorage.getItem('email');
    else return null;
  }, [token, keepLogged]);

  const password : string | null = useMemo(() => {
    if (isError) return null;
    if (!token && keepLogged) return sessionStorage.getItem('password');
    else return null;
  }, [token, keepLogged]);

  const types : IobjObj | null = useMemo(() => {
    if (isError) return null;
    const temp = sessionStorage.getItem('types');
    if (temp === null) {
      console.error(`${messages.noTypes} at ${componentName} component`);
      setIsError(true); 
      return null; 
    }
    return JSON.parse(temp!); 
  }, [token]);

  const statuses : IobjObj | null = useMemo(() => {
    if (isError) return null;
    const temp = sessionStorage.getItem('statuses');
    if (temp === null) {
      console.error(`${messages.noStatuses} at ${componentName} component`);
      setIsError(true); 
      return null;
    }
    return JSON.parse(temp);
  }, [token]);
  
  
  
  //------------------------------------------------------------//
  // Данный блок предназначен для хранения input элементов DOM  
  // дерева, которые будут задействованы при использовании      
  // функции element.focus() для реализации перемещения фокуса  
  // при нажатии клавиши Enter.                                  
  //------------------------------------------------------------//
  const [titleElement, setTitleElement] : [titleElement : HTMLElement | null, setTitleElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [typeElement, setTypeElement] : [typeElement : HTMLElement | null, setTypeElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);
  const [descriptionElement, setDescriptionElement] : [descriptionElement : HTMLElement | null, setDescriptionElement : React.Dispatch<React.SetStateAction<HTMLElement | null>>] = useState(null as HTMLElement | null);



  //------------------------------------------------------------//
  // Создание локальных состояний input элементов.                               
  //------------------------------------------------------------//
  const [title, setTitle] : [title : IinputElement, setTitle : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: '',
    focused: true,
    status: false, 
    touched: false, 
  } as IinputElement);
  const [description, setDescription] : [description : IinputElement, setDescription : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: '',
    focused: false,
    status: false, 
    touched: false, 
  } as IinputElement);
  const [type, setType] : [type : IinputElement, setType : React.Dispatch<React.SetStateAction<IinputElement>>] = useState({
    content: '', 
    error: '',
    focused: false,
    status: false, 
    touched: false, 
  } as IinputElement);



  //------------------------------------------------------------//
  // Группа переменных, содержащих результат валидации 
  // содержания input элементов по наступлению события onChange.  
  // Нужна для того, чтобы определять отображать ли кнопку submit 
  // действующей или нет.                             
  //------------------------------------------------------------// 
  const isTitleOk : boolean = useMemo (() => !(
    title.content.length === 0 ||
    title.content.length > rules.titleLengthMax
    ), [title]);
  
  const isDescriptionOk : boolean = useMemo (() => !(
    description.content.length === 0
    ), [description]);
  
  const isTypeOk : boolean = useMemo (() => !(
    type.content.length === 0
    ), [type]);
  
  const isFormOk : boolean = useMemo (() => (
    isTitleOk &&
    isDescriptionOk && 
    isTypeOk
    ), [title, description, type]);



  //------------------------------------------------------------//
  // Массивоподобный объект, хранящий данные для реализации 
  // смены фокуса при нажатии на кнопку Enter, а именно: id
  // элемента, сам элемент и его Tab позиция в форме.                                  
  //------------------------------------------------------------//
  const elements : IelementsObj = {
    0: { id: 'fromNewClaim__title', state: titleElement, pos: 0 }, 
    1: { id: 'fromNewClaim__type', state: typeElement, pos: 1 },
    2: { id: 'fromNewClaim__description', state: descriptionElement, pos: 2 },
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



  //------------------------------------------------------------//
  // Хук, реагирующий на изменения локального состояния token. 
  // Проверяет, не просрочен ли token. Если просрочен, проверяет,
  // нужно ли автоматически получить новый token. Если не нужно,
  // переходит на страницу, расположенную по адресу '/', 
  // прекращая сессию.                                   
  //------------------------------------------------------------//
  useEffect(() => {
    if (isError) return;
    if ((token === null && !keepLogged)) {
      navigate('/');
    }
  }, [token]);


  
  //------------------------------------------------------------//
  // Хук, реагирующий на изменение локального состояния isError.
  // Если isError верен, то происходит переход на страницу, 
  // расположенную по адресу '/'.                                 
  //------------------------------------------------------------//
  useEffect(() => {
    if (isError) navigate('/');
  }, [isError]);



  //------------------------------------------------------------//
  // Группа функций-обработчиков события onChange соотвествующих
  // input элементов.                              
  //------------------------------------------------------------//
  function onTitleInput(e: React.ChangeEvent<HTMLInputElement>) : void {
    if (isError) return; 
    setTitle(state => ({ ...state, content: e.target.value }));
  }
  function onDescriptionInput(e: React.ChangeEvent<HTMLInputElement>) : void {
    if (isError) return; 
    setDescription(state => ({ ...state, content: e.target.value }));
  }
  function onTypeInput(id : string) : void {
    if (isError) return; 
    setType(state => ({ ...state, content: id, touched: true, status: true }));
  }

  

  //------------------------------------------------------------//
  // Функция, устанавливающая все состояния input элементов
  // в изначальное положение.                                 
  //------------------------------------------------------------//
  function setAllStatesDefault() : void {
    if (isError) return; 
    setTitle({
      content: '', 
      error: '',
      focused: true,
      status: false, 
      touched: false, 
    });
    setDescription({
      content: '', 
      error: '',
      focused: false,
      status: false, 
      touched: false, 
    });
    setType({
      content: '', 
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
  function createBody() : string | null {
    if (isError) return null; 
    
    const typeSlug : string | undefined = types![type.content].slug;
    if (typeSlug === undefined) throw new Error(messages.noSlug);
    
    const found : Iobj | undefined = Object.values(statuses!).find(item => item.status === claims.new);
    if (found === undefined) throw new Error(messages.noMatch);

    const statusSlug : string | undefined = found.slug;
    if (statusSlug === undefined) throw new Error(messages.noSlug);

    return JSON.stringify({
      title: title.content,
      description: description.content,
      type: typeSlug,
      status: statusSlug,
    });
  }



  //------------------------------------------------------------//
  // Функция-организатор: собирает и/или проверяет необходимые
  // компоненты для AJAX-запроса и отправляет его.                             
  //------------------------------------------------------------// 
  async function onSubmit(e : React.FormEvent) : Promise<void> {
    e.preventDefault(); 
    
    if (isError) return; 

    if (!token && !keepLogged) {
      console.error(`${messages.noToken} at ${componentName} component`);
      setIsError(true); 
      return;
    }

    let createdBody : string | null = null;
    try {
      createdBody = createBody();
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
      return;
    } 

    dispatch(configSettings({ status: claimsStatuses.loading }));

    try {
      if (!token) {
        if (!email) throw new Error(messages.nullEmail);
        if (!password) throw new Error(messages.nullPassword);
        token = (await reconnect(email, password)).newToken;
      }
  
      const publicPath : string = publicPaths.claim;
      const method : string = methods.post;
      const bodyJSON : string = createdBody!;
  
      setAllStatesDefault()
  
      const res : Response = await sendRequestBodyfull(publicPath, method, bodyJSON, token);
  
      switch (res.status) {
        case 200: dispatch(configSettings({ status: 'ok' }));
                  sessionStorage.setItem('offset', 'last');
                  navigate('/base/claims');
                  break;
        case 401: throw new Error(messages.noAuth);
        case 404: throw new Error(messages.noFound);
        default:  throw new Error(messages.default); 
      }
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      dispatch(configSettings({ status: claimsStatuses.error, message: err.message }));
    }  
  }



  //------------------------------------------------------------//
  // Обработчик события onFocus input элемента, к которму этот 
  // обработчик будет приставлен. Setter - setter локального
  // состояния.                            
  //------------------------------------------------------------// 
  function onFocus(setter : React.Dispatch<React.SetStateAction<IinputElement>>) : void {
    if (isError) return;
    setter((state: IinputElement) => ({ ...state, focused: true }));
  }



  //------------------------------------------------------------//
  // Обработчик события onBlur input элемента, к которму этот 
  // обработчик будет приставлен. Setter - setter локального
  // состояния, checker - функция, валидирующая локальное 
  // состояние.                         
  //------------------------------------------------------------// 
  function onBlur(setter: React.Dispatch<React.SetStateAction<IinputElement>>, checker: () => void) : void {
    if (isError) return;
    setter((state: IinputElement) : IinputElement => ({ ...state, touched: true, focused: false }));
    checker();
  }



  //------------------------------------------------------------//
  // Обработчик кнопки Cancel.                             
  //------------------------------------------------------------// 
  function onCancel(e : React.MouseEvent) : void {
    e.preventDefault();
    if (isError) return;
    navigate('/base/claims');
  };



  //------------------------------------------------------------//
  // Функция, устанавливающая фокус на нужный input элемент
  // после сокрытия модального окна.
  //------------------------------------------------------------//
  function setFocus() : void {
    if (isError) return;
    if (titleElement === null) {
      console.error(`${messages.noTitle} at ${componentName} component`);
      setIsError(true); 
      return;
    }
    titleElement.focus();
    setTitle((state: IinputElement) => ({ ...state, touched: false }));
  }



  //------------------------------------------------------------//
  // Группа функций, валидирующих содержание input элементов
  // по наступлению события onBlur. Нужна для того, чтобы 
  // отображать ошибки, если они есть, сразу после смены фокуса.                            
  //------------------------------------------------------------// 
  function checkTitle() : void {
    if (isError) return;
    if (title.content.length > rules.titleLengthMax) {
      return setTitle((state: IinputElement) => ({
        ...state, 
        status: false, 
        error: errors.titleErrors.longTitle
      }));
    }
    setTitle((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }
  function checkDescription() {
    if (isError) return;
    setDescription((state: IinputElement) => ({...state, status: true, error: ''}));
  }
  function checkType () {
    if (isError) return;
    setType((state: IinputElement) => ({ ...state, status: true, error: '' }));
  }



  //--------------------------------------------------------------------

  return (
    <>
      <form className={ c.container2 }>
        <div className={ c.subcontainer }>
          <p className={`${c.text4} ${s.title}`}>Creating new claim</p>
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
              groupId='fromNewClaim__sel1'
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
            { isFormOk ? (<button className={ `${c.button2} ${c.xbutton1} ${s.button}` } onClick={ onSubmit }>Create</button>) : (<button className={ `${c.buttonInactiv} ${c.xbutton1} ${s.button}` }>Create</button>) }
          </section>
        </div>
      </form>
      <Modal afterHideModalFunctionsArray={ [setFocus] }/>
    </>
  );
}

export default NewClaim;

