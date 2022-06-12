import React from 'react';

import '../../assets/styles/common.scss';
import './Search.scss';

import searchSprite from '../../assets/images/sprite.svg';

function Search() {
  return (
    <div className='input_wrapper Search__input_wrapper'>
      <input 
        type='text'
        className='input Search__input'
        placeholder='Search'
      />
      <div className='image_wrapper'>
        <svg class="Search__loupe_svg">
          <use href={searchSprite + `#loupe`}></use>
        </svg>
      </div>
    </div>
    
  );
}

export default Search;
