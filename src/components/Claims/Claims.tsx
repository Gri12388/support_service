import React, { useEffect, useMemo, useState  } from 'react';
import { Link, Location, NavigateFunction, useLocation, useNavigate } from 'react-router-dom';
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
function Claims() : JSX.Element {

  //------------------------------------------------------------//
  // Подготовка нужных инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useAppDispatch();
  const location : Location = useLocation();
  const navigate : NavigateFunction = useNavigate();


  
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
    if (encryptedToken === null) return null;
    return setToken(encryptedToken);
  }, [encryptedToken]);

  const keepLogged : boolean = useMemo(() : boolean => {
    return sessionStorage.getItem('keepLogged') === 'true';
  }, []);
  
  const offset : number | null = useMemo(() : number | null => {
    const temp = sessionStorage.getItem('offset');
    if (temp === null) return null;
    return +temp;
  }, []);

  const types : Iobj[] | null = useMemo(() : Iobj[] | null => {
    const temp = sessionStorage.getItem('types');
    if (temp === null) return null;
    return Object.values(JSON.parse(temp));
  }, [token]);
  
  const statuses : Iobj[] | null = useMemo(() : Iobj[] | null => {
    const temp = sessionStorage.getItem('statuses');
    if (temp === null) return null;
    return Object.values(JSON.parse(temp));
  }, [token]);

  

  //------------------------------------------------------------//
  // Продолжаем подготовка инструментов для взаимодействия с 
  // другими страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const claims : Iclaim[] = useAppSelector(selectClaims);
  const { search, sort, column } : { search: string, sort: string, column: string } = useAppSelector(selectCommonState);
  


  //------------------------------------------------------------//
  // Создание локальных состояний windowWidth и isError. Первое 
  // отвечает за вычисление размера окна устройства, необходимого  
  // для отображения заголовка и некоторого другого контента 
  // страницы. Второе отвечает за распознание появления в коде 
  // сгенерированных ошибок.                                 
  //------------------------------------------------------------//
  const [windowWidth, setWindowWidth] : [windowWidth : number, setWindowWidth : React.Dispatch<React.SetStateAction<number>>] = useState(window.innerWidth);
  const [isError, setIsError] : [isError : boolean, setIsError : React.Dispatch<React.SetStateAction<boolean>>] = useState(false);



   //------------------------------------------------------------//
  // Переменные, которые будут отображать ряд и плитку на 
  // странице.                                 
  //------------------------------------------------------------//

    const rows : JSX.Element[] | null = useMemo(() => {
      try {
        return setRows();
      }
      catch (err : any) {
        console.error(err.message);
        setIsError(true);
        return null;
      }
    }, [types, statuses, claims]);

    const tiles : JSX.Element[] | null = useMemo(() => {
      try {
        return setTiles();
      }
      catch (err : any) {
        console.error(err.message);
        setIsError(true);
        return null;
      }
    }, [types, statuses, claims]);



  //------------------------------------------------------------//
  // Функция, устанавливающая в локальное состояние windowWidth
  // действующий размер окна. Прикрепляется к элементу document
  // в качестве eventListener.                                 
  //------------------------------------------------------------//
  function onClaimsWindowWidthResize() : void {
    setWindowWidth(window.innerWidth);
  }



  //------------------------------------------------------------//
  // Обработчик радиокнопок. Сохраняет содержание радиокнопок в 
  // общем состоянии sort и отправляет запрос с требуемой  
  // сортировкой на сервер.                               
  //------------------------------------------------------------//
  function onSortRadioButton(e : React.ChangeEvent<HTMLInputElement>) : void {
    if (offset === null) return;
    dispatch(setCommonState({ sort: e.target.value }));
    dispatch(fetchClaims({ 
      token: token, 
      offset: offset, 
      limit: pager.base, 
      search: search, 
      column: column, 
      sort: e.target.value 
    }));
  }



  //------------------------------------------------------------//
  // Обработчик заголовков таблицы. Определяет и сохраняет  
  // колонку сортировки в общем состоянии column и отправляет   
  // запрос с требуемой сортировкой на сервер.                               
  //------------------------------------------------------------//
  function onColumn(e : React.MouseEvent) : void {
    if (offset === null) return;
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
    dispatch(fetchClaims({
      token: token, 
      offset: offset, 
      limit: pager.base, 
      search: search, 
      column: temp, 
      sort: sort
    }));
  }



  //------------------------------------------------------------//
  // Функция. Находит в массиве type элемент, указанный 
  // в массиве claims. То же самое делает со status. Если 
  // claims не содержит ни типа, ни статуса, выбирает значения
  // по умолчанию. С учетом этого формирует строку.                             
  //------------------------------------------------------------//
  function setRows() : JSX.Element[] | null {
    if (types === null || statuses === null) return null;
    const rows : JSX.Element[] = claims.map((item : Iclaim) => {
      let type : Iobj | undefined, status : Iobj | undefined;

      if (!item.type || !item.type.name) type = types[types.length - 1];
      else {
        type = types.find((elem : Iobj) => {
          if (!elem.type) throw new Error(messages.noFoundType);
          const el : string = elem.type.toLowerCase();
          const it : string = item.type!.name.toLowerCase();
          const res : number = el.localeCompare(it);
          if (res === 0) return true;
          else return false;
        });
        if (!type) throw new Error(messages.noFoundType);
      }
  
      if (!item.status || !item.status.name) status = statuses[statuses.length - 1];
      else {
        status = statuses.find(elem => {
          if (!elem.status) throw new Error(messages.noFoundStatus);
          const el : string = elem.status.toLowerCase();
          const it : string = item.status!.name.toLowerCase();
          const res : number = el.localeCompare(it);
          if (res === 0) return true;
          else return false;
        });
        if (!status) throw new Error(messages.noFoundStatus);
      }
      return (
        <section key={ item._id } className={ s.row }>
          <ClaimRow item={ item } type={ type } status={ status }/>  
        </section>
      );
    });
    return rows;
  }
  
  
  
  //------------------------------------------------------------//
  // Функция. Находит в массиве type элемент, указанный 
  // в массиве claims. То же самое делает со status. Если 
  // claims не содержит ни типа, ни статуса, выбирает значения
  // по умолчанию. С учетом этого формирует плитку.                             
  //------------------------------------------------------------//
  function setTiles() : JSX.Element[] | null {
    if (types === null || statuses === null) return null;
    const tiles : JSX.Element[] = claims.map((item : Iclaim) => {
      let type : Iobj | undefined, status : Iobj | undefined;

      if (!item.type || !item.type.name) type = types[types.length - 1];
      else {
        type = types.find((elem : Iobj) => {
          if (!elem.type) throw new Error(messages.noFoundType);
          const el : string = elem.type.toLowerCase();
          const it : string = item.type!.name.toLowerCase();
          const res : number = el.localeCompare(it);
          if (res === 0) return true;
          else return false;
        });
        if (!type) throw new Error(messages.noFoundType);
      }

      if (!item.status || !item.status.name) status = statuses[statuses.length - 1];
      else {
        status = statuses.find((elem : Iobj) => {
          if (!elem.status) throw new Error(messages.noFoundStatus);
          const el : string = elem.status.toLowerCase();
          const it : string = item.status!.name.toLowerCase();
          const res : number = el.localeCompare(it);
          if (res === 0) return true;
          else return false;
        });
        if (!status) throw new Error(messages.noFoundStatus);
      }

      return (
        <ClaimTile key={ item._id } item={ item } type={ type } status={ status }/>  
      );
    });
    return tiles;
  }
  
  

  //------------------------------------------------------------//
  // Функция, проверяющая наличие значения null у ключевых 
  // переменных.                                 
  //------------------------------------------------------------//
  function checkIsNull() : boolean {
    if (
      (token === null && !keepLogged) ||
      offset === null ||
      types === null ||
      statuses === null ||
      rows === null ||
      tiles === null
      ) return true;
    else return false;
  }


  
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
  // прекращая сессию. В ином случае выполняем запрос. Также
  // переход на страницу, расположенную по адресу '/', проводится
  // если значением ключевых переменных является null.                                   
  //------------------------------------------------------------//
  useEffect(() => {
    if (checkIsNull()) {
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
        console.error(err.message);
        navigate('/');
      }
    }
  }, [token, isError]);



if (checkIsNull()) return <></>

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