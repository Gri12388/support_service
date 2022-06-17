import React, { useState, useEffect } from 'react';

import '../../assets/styles/common.scss';
import './Sel.scss';

import sprite from '../../assets/images/sprite.svg';



function Sel({ id, label, value, groupId, state, callbacks, placeholder }) {
  
  let types = Object.values(JSON.parse(sessionStorage.getItem('types'))).filter(item => item.slug);
  
  let [isVisible, setIsVisible] = useState(false);
  let [color, setColor] = useState(value ? types[value].color : 'transparent');
  let [content, setContent] = useState(value ? types[value].type : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}`);
  let [display, setDisplay] = useState(value ? true : false);
  //debugger
  function toggleVisibility() {
    setIsVisible(isVisible => !isVisible);
  }
  function onButtonClick(e) {
    e.preventDefault();
  }
  function chooseItem(e) {
    let temp = +e.currentTarget.dataset.id;
    setColor(types[temp].color);
    setContent(types[temp].type);
    setDisplay(true);
    toggleVisibility();
    callbacks.onChange(types[temp].id.toString());
  }
  function onKeyDown(e) {
    if (e.code === 'Enter' || e.key === 'Enter') {
      if (content) {

      }
      else {
        e.preventDefault();
        toggleVisibility();
      }
      
    }
  } 
  function onOutClick(e) {
    let temp = e.target.dataset.group;
    if (temp !== groupId) setIsVisible(false);
  }
  useEffect(() => {
    document.addEventListener('click', onOutClick);
    return () => document.removeEventListener('click', onOutClick);
  }, []);

  const options = types.map(item => {
    return (
      <div  key={ item.id } 
            className='input_wrapper Sel__item' 
            onClick={ chooseItem } 
            data-id={ item.id } 
            data-group={ groupId }
      >
        <div  className='Sel__select' 
              data-group={ groupId }
        >
          <div  className='Sel__mark-area' 
                data-group={ groupId }
          >
            <div  className='Sel__mark' 
                  style={{ backgroundColor: item.color }} 
                  data-group={ groupId }
            >
            </div>
          </div>
          <p  className='text3' 
              data-group={ groupId }
          >
            { item.type }
          </p>
        </div>
      </div>
    );
  })
  //console.log (state)
  return(
    <>
      {label && <label htmlFor={ id } className='text1 InputText__label'>{ label }</label>}
      <div  className={ state && state.touched && !state.status ? 'input_wrapper Sel__base Sel__input_wrapper Sel__error' : 'input_wrapper Sel__base Sel__input_wrapper'} 
            onClick={ toggleVisibility }
            data-group={groupId}
      >
        <button className='Sel__select'
                id={ id } 
                onClick={ onButtonClick } 
                onBlur={ callbacks.onBlur }
                onKeyDown={ onKeyDown }
                data-group={ groupId }
        >
          <div  className='Sel__mark-area' 
                style={{ display: value ? 'flex' : 'none' }} 
                data-group={ groupId }
          >
            <div  className='Sel__mark' 
                  style={{ backgroundColor: value ? color : 'transparent' }} 
                  data-group={ groupId }
            ></div>
          </div>
          <p  className='text3' 
              data-group={groupId}
          >
            {value ? content : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}`}
          </p>
        </button>
        <div  className='Sel__side-area' 
              data-group={ groupId }
        >
          <svg  className={ isVisible ? 'Sel__icon-rotated_svg' : 'Sel__icon_svg' } 
                data-group={ groupId }
          >
            <use  href={ sprite + '#chevron' } 
                  data-group={ groupId }
            ></use>
          </svg>
          
        </div>
        <div  className='Sel__drop' 
              style={{ display: isVisible ? 'block' : 'none' }} 
              data-group={ groupId }
        >
          {options}
        </div>
      </div>
      <p className='text8'>{ state && state.touched && !state.status && state.error }</p>
    </>
  );
}

export default Sel;