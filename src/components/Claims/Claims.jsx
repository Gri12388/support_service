import React, { useEffect, useMemo, useState  } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import ClaimRow from '../ClaimRow/ClaimRow.jsx';
import ClaimTile from '../ClaimTile/ClaimTile.jsx';
import Modal from '../Modal/Modal.jsx';
import Pager from '../Pager/Pager.jsx';

import { fetchClaims, selectClaims } from '../../store/slices/claimsSlice.js';
import { selectCommonState, setCommonState } from '../../store/slices/commonSlice.js';

import { columnOptions, pager, sortOptions } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Claims.scss';




//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// уникальной части страницы, расположенной по адресу:
// '/base/claims'.                             
//------------------------------------------------------------//
function Claims() {
  
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useDispatch();
  const claims = useSelector(selectClaims);
  const { search, sort, column } = useSelector(selectCommonState);
  


  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage.                                  
  //------------------------------------------------------------//
  const token = useMemo(() => {
    return sessionStorage.getItem('token');
  }, []);
  
  const offset = useMemo(() => {
    return +sessionStorage.getItem('offset');
  }, []);

  const types = useMemo(() => {
    return Object.values(JSON.parse(sessionStorage.getItem('types')));
  }, []);
  
  const statuses = useMemo(() => {
    return Object.values(JSON.parse(sessionStorage.getItem('statuses')));
  }, []);
  


  //------------------------------------------------------------//
  // Создание локального состояния windowWidth. Отвечает за 
  // вычисление размера окна устройства, необходимого для 
  // отображения заголовка и некоторого другого контента 
  // страницы.                                 
  //------------------------------------------------------------//
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
 

  //------------------------------------------------------------//
  // Функция, устанавливающая в локальное состояние windowWidth
  // действующий размер окна. Прикрепляется к элементу document
  // в качестве eventListener.                                 
  //------------------------------------------------------------//
  function onClaimsWindowWidthResize() {
    setWindowWidth(window.innerWidth);
  }



  //------------------------------------------------------------//
  // Обработчик радиокнопок. Сохраняет содержание радиокнопок в 
  // общем состоянии sort и отправляет запрос с требуемой  
  // сортировкой на сервер.                               
  //------------------------------------------------------------//
  function onSortRadioButton(e) {
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
  function onColumn(e) {
    let temp;
    // не сортировать по title
    if (e.target.id === 'Claims__title' && column === columnOptions.title) temp = '';
    
    // сортировать по title
    else if (e.target.id === 'Claims__title' && column !== columnOptions.title) temp = columnOptions.title;
    
    // не сортировать по type
    else if (e.target.id === 'Claims__type' && column === columnOptions.type) temp = '';
    
    // сортировать по type
    else if (e.target.id === 'Claims__type' && column !== columnOptions.type) temp = columnOptions.type;
    
    // не сортировать по status
    else if (e.target.id === 'Claims__status' && column === columnOptions.status) temp = '';
    
    // сортировать по status
    else if (e.target.id === 'Claims__status' && column !== columnOptions.status) temp = columnOptions.status;
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
  // Строки таблицы. Находим в массиве type элемент, указанный 
  // в массиве claims. То же самое делаем со status. Если 
  // claims не содержит ни типа, ни статуса, выбираем значения
  // по умолчанию. С учетом этого формируем строку.                             
  //------------------------------------------------------------//
  const rows = claims.map((item) => {
    let type, status;

    if (!item.type || !item.type.name) type = types[types.length - 1];
    else {
      type = types.find(elem => {
        let el = elem.type.toLowerCase();
        let it = item.type.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
      });
    }

    if (!item.status || !item.status.name) status = statuses[statuses.length - 1];
    else {
      status = statuses.find(elem => {
        let el = elem.status.toLowerCase();
        let it = item.status.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
      })
    }

    return (
      <section key={ item._id } className='Claims__row'>
        <ClaimRow item={ item } type={ type } status={ status }/>  
      </section>
    );
  });



  //------------------------------------------------------------//
  // Плитка. Находим в массиве type элемент, указанный 
  // в массиве claims. То же самое делаем со status. Если 
  // claims не содержит ни типа, ни статуса, выбираем значения
  // по умолчанию. С учетом этого формируем плитку.                             
  //------------------------------------------------------------//
  const tiles = claims.map((item) => {
    let type, status;

    if (!item.type || !item.type.name) type = types[types.length - 1];
    else {
      type = types.find(elem => {
        let el = elem.type.toLowerCase();
        let it = item.type.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
      });
    }

    if (!item.status || !item.status.name) status = statuses[statuses.length - 1];
    else {
      status = statuses.find(elem => {
        let el = elem.status.toLowerCase();
        let it = item.status.name.toLowerCase();
        let res = el.localeCompare(it);
        if (res === 0) return true;
        else return false;
      })
    }

    return (
      <ClaimTile key={ item._id } item={ item } type={ type } status={ status }/>  
    );
  });



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
  // Хук, реагирующий на монтирование. Загружает данные с 
  // сервера.                       
  //------------------------------------------------------------//
  useEffect(()=>{
    dispatch(fetchClaims({
      token: token, 
      offset: offset, 
      limit: 10, 
      search: search, 
      column: column, 
      sort: sort
    }));
  }, [])



  //--------------------------------------------------------------------

  return (
    <>
      <div className='container2'>
        <header className='Claims__header'>
          <section className='Claims__banner'>
            <p className={ windowWidth > 799 ? 'text4' : 'text9' }>Your claims</p>
            <Link 
              className='button2 Claims__button'
              to='/base/new'
            >
              { windowWidth > 799 ? '🞣 Create claim' : '🞣' }
            </Link>
          </section>
          <section className='Claims__radio' style={{  visibility: column ? 'visible' : 'hidden' }}>
            <div className='Claims__radiobutton'>
              <input  type='radio' 
                      id='Calims__asc' 
                      name='Claims__sort_radio'
                      value={ sortOptions.asc } 
                      onChange={ onSortRadioButton }
                      checked={ sort === sortOptions.asc }
              />
              <label htmlFor='Calims__asc' className='text3'>ascending sort</label>
            </div>
            <div className='Claims__radiobutton'>
              <input  type='radio' 
                      id='Calims__desc' 
                      name='Claims__sort_radio'
                      value={ sortOptions.desc }
                      onChange={ onSortRadioButton }
                      checked={ sort === sortOptions.desc }
              />
              <label htmlFor='Calims__desc' className='text3'>descending sort</label>
            </div>
          </section>
        </header>
        <main className='Claims__table'>
          <section className='Claims__table-head'>
            <p  className={ column && column === columnOptions.title ? 'text7 column1 chosen' : 'text7 column1'}
                id='Claims__title'
                onClick={ onColumn }
            >Title</p>
            <p  className='text7 column2'>Created</p>
            <p  className={ column && column === columnOptions.type ? 'text7 column3 chosen' : 'text7 column3'}
                id='Claims__type'
                onClick={ onColumn }
          >Type</p>
            <p  className={ column && column === columnOptions.status ? 'text7 column4 chosen' : 'text7 column4'}
                id='Claims__status'
                onClick={ onColumn }
            >Status</p>
            <p  className='text7 column5'>Actions</p>
          </section>
          { rows }
        </main>
        <main className='Claims__tiles'>
          { tiles }
        </main>

        <Pager />
      </div>
      <Modal />
    </>
  );
}

export default Claims;