import React from 'react';

import inputTextSprite from '../../assets/images/sprite.svg';

import '../../assets/styles/common.scss';
import './InputText.scss';

function InputText({ id, img, type, label, value, state, callbacks, placeholder }) {
  //------------------------------------------------------------//
  // Данный массив нужен для валидации поступившего типа
  // input элемента (аргумента type)                              
  //------------------------------------------------------------//
  let types = [ 'password', 'email' ];


  return (
    <>
      { label && <label htmlFor={id} className='text1 InputText__label'>{label}</label> }
      <div className={ state && state.touched && !state.status ? 'input_wrapper InputText__input_wrapper InputText__error' : 'input_wrapper InputText__input_wrapper'}>
        <input 
          type={ types.some(item => item === type) ? type : 'text' }
          id={ id }
          name={ id }
          className='input InputText__input'
          placeholder={ placeholder ?? '' }
          value={ value }
          onChange={ callbacks && callbacks.onChange }
          onBlur={ callbacks && callbacks.onBlur }
          onKeyDown={ callbacks && callbacks.onPressedEnter }
          style={{ width: img ? '87%' : '100%' }}
        />
        { img && (
          <div className='image_wrapper'>
            <svg className='InputText__icon_svg'>
              <use href={ inputTextSprite + `#${img}` }></use>
            </svg>   
          </div>
        )}
      </div>
      <p className='text8'>{ state && state.touched && !state.status && state.error }</p>
    </>
  );
}

export default InputText;

