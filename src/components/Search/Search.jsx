import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchClaims } from '../../store/slices/claimsSlice.js';
import { selectCommonState, setCommonState } from '../../store/slices/commonSlice.js';

import { pager } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Search.scss';

import sprite from '../../assets/images/sprite.svg';

//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// поисковика на странице, расположенной по адресу: 
// '/base/claims'                              
//------------------------------------------------------------//
function Search() {

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useDispatch();
  const { column, search: commonSearch, sort } = useSelector(selectCommonState);
  


  //------------------------------------------------------------//
  // Создание локального состояния search.                                  
  //------------------------------------------------------------//
  const [search, setSearch] = useState('') 
  


  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage.                                  
  //------------------------------------------------------------//
  const token = useMemo(() => {
    return sessionStorage.getItem('token');
  }, []);



  //------------------------------------------------------------//
  // Обработчик события onChange input элемента поиска.                                  
  //------------------------------------------------------------//
  function onChange(e) {
    setSearch(e.target.value);
  }



  //------------------------------------------------------------//
  // Обработчик иконки крестика. Стирает содержимое поиска из
  // локального состояния search.                                  
  //------------------------------------------------------------//
  function onCross() {
    setSearch('');
  }



  //------------------------------------------------------------//
  // Обработчик иконки лупы. Сохраняет содержание поисковика в 
  // общем состоянии search и отправляет запрос с искомым 
  // на сервер.                                   
  //------------------------------------------------------------//  
  function onLoupe() {
    dispatch(setCommonState({ search: search }));
    dispatch(fetchClaims({
      token: token, 
      offset: 0, 
      limit: pager.base, 
      search: search, 
      column: column, 
      sort: sort
    }));
  }



  //------------------------------------------------------------//
  // Обработчик кнопки Enter. Если она нажата, и локальное 
  // состояние search не является пустой строкой, вызывается
  // функция onLoupe.                                
  //------------------------------------------------------------// 
  function onKeyDown(e) {
    if (search && (e.code === 'Enter' || e.key === 'Enter')) {
      onLoupe();
    }
  }



  //------------------------------------------------------------//
  // Хук, реагирующий на изменение локального состояния search.
  // Если search становится пустой строкой, а общее состояние
  // search не является пустой строкой, то общее стстояние 
  // search заменяется на пустую строку, и направляется запрос
  // на сервер для предоставления имеющихся там сообщений.                                  
  //------------------------------------------------------------// 
  useEffect(() => {
    if (search === '' && search !== commonSearch) {
      dispatch(setCommonState({search: ''}));
      dispatch(fetchClaims({
        token: token, 
        offset: 0, 
        limit: pager.base, 
        search: search, 
        column: column, 
        sort: sort
      }));
    }
  }, [search]);



  //--------------------------------------------------------------------

  return (
    <div className='input_wrapper Search__input_wrapper'>
      <div  className='image_wrapper' 
            style={{ display: search ? 'flex' : 'none' }}
            onClick={ onCross }
      >
        <svg className='Search__cross_svg'>
          <use href={ sprite + '#cross' }></use>
        </svg>
      </div>
      <input 
        type='text'
        className='input Search__input'
        placeholder='Search'
        value={ search }
        onChange={ onChange }
        onKeyDown={ onKeyDown }
      />
      <div className='image_wrapper' onClick={ onLoupe }>
        <svg className='Search__loupe_svg'>
          <use href={ sprite + '#loupe' }></use>
        </svg>
      </div>
    </div>
  );
}

export default Search;
