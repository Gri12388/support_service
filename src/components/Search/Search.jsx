import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCommonState, setCommonState } from '../../store/slices/commonSlice.js';
import { fetchClaims } from '../../store/slices/claimsSlice.js';

import { pager } from '../../data/data.js';

import '../../assets/styles/common.scss';
import './Search.scss';

import searchSprite from '../../assets/images/sprite.svg';

function Search() {

  let [search, setSearch] = useState('') 
  let commonSearch = useSelector(selectCommonState).search;
  let token = sessionStorage.getItem('token');
  let { sort, column } = useSelector(selectCommonState);

  const dispatch = useDispatch();

  const onChange = e => setSearch(e.target.value);
  const onCross = () => setSearch('');
  const onLoupe = () => {
    dispatch(setCommonState({search: search}));
    dispatch(fetchClaims({token: token, offset: 0, limit: pager.base, search: search, column: column, sort: sort}));
  }

  useEffect(() => {
    if (search === '' && search !== commonSearch) {
      dispatch(setCommonState({search: ''}));
      dispatch(fetchClaims({token: token, offset: 0, limit: pager.base, search: search, column: column, sort: sort}));
    }
  }, [search]);

  


  console.log(search)

  return (
    <div className='input_wrapper Search__input_wrapper'>
      <div  className='image_wrapper' 
            style={{ display: search ? 'flex' : 'none' }}
            onClick={ onCross }
      >
        <svg className='Search__cross_svg'>
          <use href={ searchSprite + '#cross' }></use>
        </svg>
      </div>
      <input 
        type='text'
        className='input Search__input'
        placeholder='Search'
        value={search}
        onChange={onChange}
      />
      <div className='image_wrapper' onClick={ onLoupe }>
        <svg className='Search__loupe_svg'>
          <use href={ searchSprite + '#loupe' }></use>
        </svg>
      </div>
    </div>
    
  );
}

export default Search;
