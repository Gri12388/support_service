import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectCommonState, setCommonState } from '../../store/slices/commonSlice.js';

import '../../assets/styles/common.scss';
import './Search.scss';

import searchSprite from '../../assets/images/sprite.svg';

function Search() {

  let search = useSelector(selectCommonState).search;

  const dispatch = useDispatch();

  const onChange = e => {
    dispatch(setCommonState({search: e.target.value}));
  } 

  const onCross = e => {
    dispatch(setCommonState({search: ''}));
  }

  console.log(search)

  return (
    <div className='input_wrapper Search__input_wrapper'>
      <div  className='image_wrapper' 
            style={{display: search ? 'flex' : 'none'}}
            onClick={onCross}
      >
        <svg className='Search__cross_svg'>
          <use href={searchSprite + `#cross`}></use>
        </svg>
      </div>
      <input 
        type='text'
        className='input Search__input'
        placeholder='Search'
        value={search}
        onChange={onChange}
      />
      <div className='image_wrapper'>
        <svg className='Search__loupe_svg'>
          <use href={searchSprite + `#loupe`}></use>
        </svg>
      </div>
    </div>
    
  );
}

export default Search;
