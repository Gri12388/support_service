import React, { useEffect, useMemo, useState } from 'react';
//import { useDispatch, useSelector } from 'react-redux';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { fetchClaims } from '../../store/slices/claimsSlice.js';
import { selectCommonState, setCommonState } from '../../store/slices/commonSlice.js';

import { pager, setToken } from '../../data/data.js';

import c from '../../assets/styles/common.scss';
import s from './Search.scss';

import sprite from '../../assets/images/sprite.svg';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// поисковика на странице, расположенной по адресу: 
// '/base/claims'                              
//------------------------------------------------------------//
function Search() {

  //------------------------------------------------------------//
  // Подготовка нужных инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const navigate : NavigateFunction = useNavigate();



  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useAppDispatch();
  const { column, search: commonSearch, sort } = useAppSelector(selectCommonState);
  


  //------------------------------------------------------------//
  // Создание локального состояния search.                                  
  //------------------------------------------------------------//
  const [search, setSearch] : [search : string, setSearch : React.Dispatch<React.SetStateAction<string>>]= useState(''); 
  


  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage. Извлечение
  // token из sessionStorage проходит в два этапа: сначала 
  // извлекается закодированный token, потом он раскодируется. 
  // Хук useMemo не используется так как значение  
  // закодированного token всегда должно быть актуальным, в том 
  // числе после получения нового token.                                
  //------------------------------------------------------------//
  const encryptedToken : string | null = sessionStorage.getItem('token');

  const token : string | null = useMemo(() => {
    if (!encryptedToken) return null;
    return setToken(encryptedToken);
  }, [encryptedToken])
  
  const keepLogged : boolean = useMemo(() => {
    return sessionStorage.getItem('keepLogged') === 'true';
  }, []);



  //------------------------------------------------------------//
  // Обработчик события onChange input элемента поиска.                                  
  //------------------------------------------------------------//
  function onChange(e : React.ChangeEvent<HTMLInputElement>) : void {
    setSearch(e.target.value);
  }



  //------------------------------------------------------------//
  // Обработчик иконки крестика. Стирает содержимое поиска из
  // локального состояния search.                                  
  //------------------------------------------------------------//
  function onCross() : void {
    setSearch('');
  }



  //------------------------------------------------------------//
  // Обработчик иконки лупы. Сохраняет содержание поисковика в 
  // общем состоянии search и отправляет запрос с искомым 
  // на сервер.                                   
  //------------------------------------------------------------//  
  function onLoupe() : void {
    if (!token && !keepLogged) {
      navigate('/');
      return;
    }
    dispatch(setCommonState({ search: search }));
    dispatch(fetchClaims({
      token: token!, 
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
  function onKeyDown(e: React.KeyboardEvent) : void {
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
      if (!token && !keepLogged) {
        navigate('/');
        return;
      }
      dispatch(setCommonState({search: ''}));
      dispatch(fetchClaims({
        token: token!, 
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
    <div className={ `${c.inputWrapper} ${s.inputWrapper}` }>
      <div  className={ c.imageWrapper } 
            style={{ display: search ? 'flex' : 'none' }}
            onClick={ onCross }
      >
        <svg className={ s.crossSvg }>
          <use href={ sprite + '#cross' }></use>
        </svg>
      </div>
      <input 
        type='text'
        className={ `${c.input} ${s.input}` }
        placeholder='Search'
        value={ search }
        onChange={ onChange }
        onKeyDown={ onKeyDown }
      />
      <div className={ c.imageWrapper } onClick={ onLoupe }>
        <svg className={ s.loupeSvg }>
          <use href={ sprite + '#loupe' }></use>
        </svg>
      </div>
    </div>
  );
}

export default Search;
