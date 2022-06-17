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

  function configInputWrapperView() {
    if (state && !state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper InputText__input_wrapper' 
      };
    };
    if (state && !state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper InputText__input_wrapper' 
      };
    };
    if (state && !state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: 'input_wrapper InputText__input_wrapper InputText__error' 
      };
    };
    if (state && state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper InputText__input_wrapper InputText__focused' 
      };
    };
    if (state && state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper InputText__input_wrapper InputText__focused' 
      };
    };
    if (state && state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: 'input_wrapper InputText__input_wrapper InputText__focused' 
      };
    }
    else return { 
      isWarningShown: false, 
      className: 'input_wrapper InputText__input_wrapper' 
    };
  }

  return (
    <>
      { label && <label htmlFor={id} className='text1 InputText__label'>{label}</label> }
      <div className={ configInputWrapperView().className }>
        <input 
          type={ types.some(item => item === type) ? type : 'text' }
          id={ id }
          name={ id }
          className='input InputText__input'
          placeholder={ placeholder ?? '' }
          value={ value }
          style={{ width: img ? '87%' : '100%' }}
          autoFocus={ state && state.focused }
          onChange={ callbacks && callbacks.onChange }
          onFocus={ callbacks && callbacks.onFocus }
          onBlur={ callbacks && callbacks.onBlur }
          onKeyDown={ callbacks && callbacks.onPressedEnter }
        />
        { img && (
          <div className='image_wrapper'>
            <svg className='InputText__icon_svg'>
              <use href={ inputTextSprite + `#${img}` }></use>
            </svg>   
          </div>
        )}
      </div>
      <p className='text8'>{ configInputWrapperView().isWarningShown && state.error }</p>
    </>
  );
}

export default InputText;

