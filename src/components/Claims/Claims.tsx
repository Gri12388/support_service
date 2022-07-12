import React, { useEffect, useMemo, useState  } from 'react';
import { Link, NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';

import ClaimRow from '../ClaimRow/ClaimRow';
import ClaimTile from '../ClaimTile/ClaimTile';
import Modal from '../Modal/Modal';
import Pager from '../Pager/Pager';

import { fetchClaims, selectClaims } from '../../store/slices/claimsSlice';
import { selectCommonState, setCommonState } from '../../store/slices/commonSlice';

import { columnOptions, messages, pager, setToken, sortOptions } from '../../data/data';

import c from '../../assets/styles/common.scss';
import s from './Claims.scss';

import type { Iclaim, Iobj } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// уникальной части страницы, расположенной по адресу:
// '/base/claims'.                             
//------------------------------------------------------------//
function Claims() : JSX.Element | null {

  //------------------------------------------------------------//
  // Подготовка нужных инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useAppDispatch();
  const navigate : NavigateFunction = useNavigate();



  //------------------------------------------------------------//
  // Имя компонента.                                 
  //------------------------------------------------------------//
  const componentName = 'Claims';


  
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
  // числе после получения нового token.                                
  //------------------------------------------------------------//
  const encryptedToken : string | null = sessionStorage.getItem('token');

  const token : string | null = useMemo(() : string | null => {
    if (isError) return '';
    if (encryptedToken === null) {
      console.error(`${messages.noToken} at ${componentName} component`);
      setIsError(true);
      return '';
    }
    return setToken(encryptedToken);
  }, [encryptedToken]);

  const keepLogged : boolean = useMemo(() : boolean => {
    return sessionStorage.getItem('keepLogged') === 'true';
  }, []);
  
  const offset : number = useMemo(() : number => {
    if (isError) return 0; 
    const temp = sessionStorage.getItem('offset');
    if (temp === null) {
      console.error(`${messages.noOffset} at ${componentName} component`);
      setIsError(true);
      return 0;
    }
    return +temp;
  }, []);

  const types : Iobj[] | null = useMemo(() : Iobj[] | null => {
    if (isError) return null; 
    const temp = sessionStorage.getItem('types');
    if (temp === null) {
      console.error(`${messages.noTypes} at ${componentName} component`);
      setIsError(true);  
      return null;
    }
    return Object.values(JSON.parse(temp));
  }, [token]);
  
  const statuses : Iobj[] | null = useMemo(() : Iobj[] | null => {
    if (isError) return null; 
    const temp = sessionStorage.getItem('statuses');
    if (temp === null) {
      console.error(`${messages.noStatuses} at ${componentName} component`);
      setIsError(true); 
      return null;
    }
    return Object.values(JSON.parse(temp));
  }, [token]);

  

  //------------------------------------------------------------//
  // Продолжаем подготовку инструментов для взаимодействия с 
  // другими страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const claims : Iclaim[] = useAppSelector(selectClaims);
  const { search, sort, column } : { search: string, sort: string, column: string } = useAppSelector(selectCommonState);
  


  //------------------------------------------------------------//
  // Создание локального состояния windowWidth, которое 
  // отвечает за вычисление размера окна устройства, необходимого  
  // для отображения заголовка и некоторого другого контента 
  // страницы.                                
  //------------------------------------------------------------//
  const [windowWidth, setWindowWidth] : [windowWidth : number, setWindowWidth : React.Dispatch<React.SetStateAction<number>>] = useState(window.innerWidth);



   //------------------------------------------------------------//
  // Переменные, которые будут отображать ряд и плитку на 
  // странице.                                 
  //------------------------------------------------------------//

    const rows : JSX.Element[] | null = useMemo(() => {
      if (isError) return null;
      try {
        return setRows();
      }
      catch (err : any) {
        console.error(`${err.message} at ${componentName} component`);
        setIsError(true);
        return null;
      }
    }, [types, statuses, claims]);

    const tiles : JSX.Element[] | null = useMemo(() => {
      if (isError) return null;
      try {
        return setTiles();
      }
      catch (err : any) {
        console.error(`${err.message} at ${componentName} component`);
        setIsError(true);
        return null;
      }
    }, [types, statuses, claims]);



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Устанавливает функцию
  // onClaimsWindowWidthResize в качестве eventListener.                      
  //------------------------------------------------------------//
  useEffect(()=> {
    window.addEventListener('resize', onClaimsWindowWidthResize);
    return () => {
      window.removeEventListener('resize', onClaimsWindowWidthResize);
    }
  }, []);
  


  //------------------------------------------------------------//
  // Проверяем, не просрочен ли token. Если просрочен, проверяем,
  // нужно ли автоматически получить новый token. Если не нужно,
  // переходим на страницу, расположенную по адресу '/', 
  // прекращая сессию. В ином случае выполняем запрос.                                  
  //------------------------------------------------------------//
  useEffect(() => {
    if (isError) return;
    if ((token === null && !keepLogged)) {
      navigate('/');
    }
    else {
      try {
        dispatch(fetchClaims({
          token: token, 
          offset: offset!, 
          limit: 10, 
          search: search, 
          column: column, 
          sort: sort
        }));
      }
      catch (err : any) {
        console.error(`${err.message} at ${componentName} component`);
        navigate('/');
      }
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
  // Функция, устанавливающая в локальное состояние windowWidth
  // действующий размер окна. Прикрепляется к элементу document
  // в качестве eventListener.                                 
  //------------------------------------------------------------//
  function onClaimsWindowWidthResize() : void {
    if (isError) return;
    setWindowWidth(window.innerWidth);
  }



  //------------------------------------------------------------//
  // Обработчик радиокнопок. Сохраняет содержание радиокнопок в 
  // общем состоянии sort и отправляет запрос с требуемой  
  // сортировкой на сервер.                               
  //------------------------------------------------------------//
  function onSortRadioButton(e : React.ChangeEvent<HTMLInputElement>) : void {
    if (isError) return;
    dispatch(setCommonState({ sort: e.target.value }));
    try {
      dispatch(fetchClaims({ 
        token: token, 
        offset: offset, 
        limit: pager.base, 
        search: search, 
        column: column, 
        sort: e.target.value 
      }));
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
    }
  }



  //------------------------------------------------------------//
  // Обработчик заголовков таблицы. Определяет и сохраняет  
  // колонку сортировки в общем состоянии column и отправляет   
  // запрос с требуемой сортировкой на сервер.                               
  //------------------------------------------------------------//
  function onColumn(e : React.MouseEvent) : void {
    if (isError) return;
    const target : { id? : string } = e.target as { id? : string };
    let temp : string;
    // не сортировать по title
    if (target.id === 'Claims__title' && column === columnOptions.title) temp = '';
    
    // сортировать по title
    else if (target.id === 'Claims__title' && column !== columnOptions.title) temp = columnOptions.title;
    
    // не сортировать по type
    else if (target.id === 'Claims__type' && column === columnOptions.type) temp = '';
    
    // сортировать по type
    else if (target.id === 'Claims__type' && column !== columnOptions.type) temp = columnOptions.type;
    
    // не сортировать по status
    else if (target.id === 'Claims__status' && column === columnOptions.status) temp = '';
    
    // сортировать по status
    else if (target.id === 'Claims__status' && column !== columnOptions.status) temp = columnOptions.status;
    else return;
    dispatch(setCommonState({ column: temp }));
    try {
      dispatch(fetchClaims({
        token: token, 
        offset: offset, 
        limit: pager.base, 
        search: search, 
        column: temp, 
        sort: sort
      }));
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
    }
  }



  //------------------------------------------------------------//
  // Функция. Находит в массиве type элемент, указанный 
  // в массиве claims. То же самое делает со status. Если 
  // claims не содержит ни типа, ни статуса, выбирает значения
  // по умолчанию. С учетом этого формирует строку.                             
  //------------------------------------------------------------//
  function setRows() : JSX.Element[] | null {
    if (isError) return null;
    try {
      const rows : JSX.Element[] = claims.map((item : Iclaim) => {
        let type : Iobj | undefined, status : Iobj | undefined;
  
        if (!item.type || !item.type.name) type = types![types!.length - 1];
        else {
          type = types!.find((elem : Iobj) => {
            if (!elem.type) return false;
            const el : string = elem.type.toLowerCase();
            const it : string = item.type!.name.toLowerCase();
            const res : number = el.localeCompare(it);
            if (res === 0) return true;
            else return false;
          });
          if (!type) throw new Error(messages.noMatch);
        }
    
        if (!item.status || !item.status.name) status = statuses![statuses!.length - 1];
        else {
          status = statuses!.find(elem => {
            if (!elem.status) return false;
            const el : string = elem.status.toLowerCase();
            const it : string = item.status!.name.toLowerCase();
            const res : number = el.localeCompare(it);
            if (res === 0) return true;
            else return false;
          });
          if (!status) throw new Error(messages.noMatch);
        }
        return (
          <section key={ item._id } className={ s.row }>
            <ClaimRow item={ item } type={ type } status={ status }/>  
          </section>
        );
      });
      return rows;
    }
    catch (err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
      return null;
    }
  }
  
  
  
  //------------------------------------------------------------//
  // Функция. Находит в массиве type элемент, указанный 
  // в массиве claims. То же самое делает со status. Если 
  // claims не содержит ни типа, ни статуса, выбирает значения
  // по умолчанию. С учетом этого формирует плитку.                             
  //------------------------------------------------------------//
  function setTiles() : JSX.Element[] | null {
    if (isError) return null;
    try {
      const tiles : JSX.Element[] = claims.map((item : Iclaim) => {
        let type : Iobj | undefined, status : Iobj | undefined;
  
        if (!item.type || !item.type.name) type = types![types!.length - 1];
        else {
          type = types!.find((elem : Iobj) => {
            if (!elem.type) return false;
            const el : string = elem.type.toLowerCase();
            const it : string = item.type!.name.toLowerCase();
            const res : number = el.localeCompare(it);
            if (res === 0) return true;
            else return false;
          });
          if (!type) throw new Error(messages.noMatch);
        }
  
        if (!item.status || !item.status.name) status = statuses![statuses!.length - 1];
        else {
          status = statuses!.find((elem : Iobj) => {
            if (!elem.status) return false;
            const el : string = elem.status.toLowerCase();
            const it : string = item.status!.name.toLowerCase();
            const res : number = el.localeCompare(it);
            if (res === 0) return true;
            else return false;
          });
          if (!status) throw new Error(messages.noMatch);
        }
  
        return (
          <ClaimTile key={ item._id } item={ item } type={ type } status={ status }/>  
        );
      });
      return tiles;
    }
    catch (err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
      return null;
    }
  }
  




  if (isError) return null;

  //--------------------------------------------------------------------

  return (
    <>
      <div className={ c.container2 }>
        <header className={ s.header }>
          <section className={ s.banner }>
            <p className={ windowWidth > 799 ? c.text4 : c.text9 }>Your claims</p>
            <Link 
              className={ `${c.button2} ${s.button}` }
              to='/base/new'
            >
              { windowWidth > 799 ? '🞣 Create claim' : '🞣' }
            </Link>
          </section>
          <section className={ s.radio } style={{ visibility: column ? 'visible' : 'hidden' }}>
            <div className={ s.radiobutton }>
              <input  type='radio' 
                      id='Calims__asc' 
                      name='Claims__sort_radio'
                      value={ sortOptions.asc } 
                      onChange={ onSortRadioButton }
                      checked={ sort === sortOptions.asc }
              />
              <label htmlFor='Calims__asc' className={ c.text3 }>ascending sort</label>
            </div>
            <div className={ s.radiobutton }>
              <input  type='radio' 
                      id='Calims__desc' 
                      name='Claims__sort_radio'
                      value={ sortOptions.desc }
                      onChange={ onSortRadioButton }
                      checked={ sort === sortOptions.desc }
              />
              <label htmlFor='Calims__desc' className={ c.text3 }>descending sort</label>
            </div>
          </section>
        </header>
        <main className={ s.table }>
          <section className={ s.tableHead }>
            <p  className={ column && column === columnOptions.title ? `${c.text7} ${c.column1} ${c.chosen}` : `${c.text7} ${c.column1}` }
                id='Claims__title'
                onClick={ onColumn }
            >Title</p>
            <p  className={ `${c.text7} ${c.column2}` }>Created</p>
            <p  className={ column && column === columnOptions.type ? `${c.text7} ${c.column1} ${c.chosen}` : `${c.text7} ${c.column3}` }
                id='Claims__type'
                onClick={ onColumn }
          >Type</p>
            <p  className={ column && column === columnOptions.status ? `${c.text7} ${c.column1} ${c.chosen}` : `${c.text7} ${c.column4}` }
                id='Claims__status'
                onClick={ onColumn }
            >Status</p>
            <p  className={ `${c.text7} ${c.column5}` }>Actions</p>
          </section>
          { rows }
        </main>
        <main className={ s.tiles }>
          { tiles }
        </main>

        <Pager />
      </div>
      <Modal afterHideModalFunctionsArray={ null } />
    </>
  );
}

export default Claims;