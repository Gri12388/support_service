import React from 'react';

import inputTextSprite from '../../assets/images/sprite.svg';

import c from '../../assets/styles/common.scss';
import s from './InputText.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// группы элементов, обслуживающих элемент 'Input'.                          
//------------------------------------------------------------//
function InputText({ id, img, type, label, value, state, callbacks, placeholder }) {
  
  //------------------------------------------------------------//
  // Массив, предназначенный для валидации поступившего типа
  // input элемента (аргумента type)                              
  //------------------------------------------------------------//
  const types = [ 'password', 'email' ];



  //------------------------------------------------------------//
  // Функция, анализирующая конфигурацию состояния state, 
  // относящегося к данному input и определяет как отображать
  // компонент                            
  //------------------------------------------------------------//
  function configInputWrapperView() {
    if (state && !state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.inputWrapper}`
      };
    };
    if (state && !state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.inputWrapper}`
      };
    };
    if (state && !state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: `${c.inputWrapper} ${s.inputWrapper} ${s.error}` 
      };
    };
    if (state && state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.inputWrapper} ${s.focused}`  
      };
    };
    if (state && state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.inputWrapper} ${s.focused}` 
      };
    };
    if (state && state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: `${c.inputWrapper} ${s.inputWrapper} ${s.focused}` 
      };
    }
    else return { 
      isWarningShown: false, 
      className: `${c.inputWrapper} ${s.inputWrapper}` 
    };
  }



  //--------------------------------------------------------------------

  return (
    <>
      { label && <label htmlFor={id} className={ `${c.text1} ${s.label}` }>{label}</label> }
      <div className={ configInputWrapperView().className }>
        <input 
          type={ types.some(item => item === type) ? type : 'text' }
          id={ id }
          name={ id }
          className={ `${c.input} ${s.input}` }
          placeholder={ placeholder ?? '' }
          value={ value }
          style={{ width: img ? '87%' : '100%' }}
          autoComplete='off'
          autoFocus={ state && state.focused }
          onChange={ callbacks && callbacks.onChange }
          onFocus={ callbacks && callbacks.onFocus }
          onBlur={ callbacks && callbacks.onBlur }
          onKeyDown={ callbacks && callbacks.onPressedEnter }
        />
        { img && (
          <div className={ c.imageWrapper }>
            <svg className={ s.iconSvg }>
              <use href={ inputTextSprite + `#${img}` }></use>
            </svg>   
          </div>
        )}
      </div>
      <p className={ c.text8 }>{ configInputWrapperView().isWarningShown && state.error }</p>
    </>
  );
}

export default InputText;