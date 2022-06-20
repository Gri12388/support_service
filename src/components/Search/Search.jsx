import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchClaims } from '../../store/slices/claimsSlice.js';
import { selectCommonState, setCommonState } from '../../store/slices/commonSlice.js';

import { pager } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Search.scss';

import sprite from '../../assets/images/sprite.svg';

function Search() {

  const dispatch = useDispatch();
  let commonSearch = useSelector(selectCommonState).search;
  let { sort, column } = useSelector(selectCommonState);
  
  let [search, setSearch] = useState('') 
  
  let token = sessionStorage.getItem('token');


  function onChange(e) {
    setSearch(e.target.value);
  }
  function onCross() {
    setSearch('');
  }
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
