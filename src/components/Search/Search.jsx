import React from 'react';

import '../../assets/styles/common.scss';
import './Search.scss';

import searchImg from '../../assets/images/loupe.svg';

function Search() {
  return (
    <div className='input_wrapper Search__input_wrapper'>
      <input 
        type='text'
        className='input Search__input'
        placeholder='Search'
      />
      <div className='image_wrapper'>
        <img 
          src={searchImg} 
          alt='loupe'
          className='Search__image' 
        />   
      </div>
    </div>
    
  );
}

export default Search;
