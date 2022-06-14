import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectTypes } from '../../store/slices/typesSlice.js';

import '../../assets/styles/common.scss';
import './Sel.scss';

import arrowDown from '../../assets/images/arrow-down.svg';


function Sel({id, label, value, groupId, state, callbacks, placeholder}) {
  
  let types = Object.values(JSON.parse(sessionStorage.getItem('types'))).filter(item => item.slug);

  let [isVisible, setIsVisible] = useState(false);
  let [color, setColor] = useState(value ? types[value].color : 'transparent');
  let [content, setContent] = useState(value ? types[value].type : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}`);
  let [display, setDisplay] = useState(value ? true : false);
  //debugger
  const toggleVisibility = () => setIsVisible(!isVisible);
  const onButtonClick = e => {
    e.preventDefault();
    toggleVisibility();
  }
  const chooseItem = e => {
    let temp = +e.currentTarget.dataset.id;
    setColor(types[temp].color);
    setContent(types[temp].type);
    setDisplay(true);
    toggleVisibility();
    callbacks.onChange(types[temp].id.toString());
  }
  const onOutClick = e => {
    let temp = e.target.dataset.group;
    if (temp !== groupId) setIsVisible(false);
  }
  const onKeyDown = e => {
    if (e.code === 'Enter' || e.key === 'Enter') {
      e.preventDefault();
    }
  }

  useEffect(() => {
    document.addEventListener('click', onOutClick);
    return () => document.removeEventListener('click', onOutClick);
  }, []);

  const options = types.map(item => {
    return (
      <div key={item.id} className='input_wrapper Sel__item' onClick={chooseItem} data-id={item.id} data-group={groupId}>
        <div className='Sel__select' data-group={groupId}>
          <div className='Sel__mark-area' data-group={groupId}>
            <div className='Sel__mark' style={{backgroundColor: item.color}} data-group={groupId}></div>
          </div>
          <p className='text3' data-group={groupId}>{item.type}</p>
        </div>
      </div>
    );
  })
  //console.log (state)
  return(
    <>
      {label && <label htmlFor={id} className='text1 InputText__label'>{label}</label>}
      <div  className={ state && state.touched && !state.status ? 'input_wrapper Sel__base Sel__input_wrapper Sel__error' : 'input_wrapper Sel__base Sel__input_wrapper'} 
            data-group={groupId}
      >
        <button className='Sel__select' 
                onClick={onButtonClick} 
                onBlur={callbacks.onBlur}
                data-group={groupId}
        >
          <div  className='Sel__mark-area' 
                onClick={toggleVisibility} 
                style={{display: value ? 'flex' : 'none'}} 
                data-group={groupId}
          >
            <div  className='Sel__mark' 
                  style={{backgroundColor: value ? color : 'transparent'}} 
                  data-group={groupId}
            ></div>
          </div>
          <p className='text3' data-group={groupId}>{value ? content : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}`}</p>
        </button>
        <div  className='Sel__side-area' 
              onClick={toggleVisibility} 
              data-group={groupId}
        >
          <img src={arrowDown} alt='arrow-down' data-group={groupId} />
        </div>
        <div  className='Sel__drop' 
              style={{display: isVisible ? 'block' : 'none'}} 
              data-group={groupId}
        >
          {options}
        </div>
      </div>
      <p className='text8'>{state && state.touched && !state.status && state.error}</p>
    </>
  );
}

export default Sel;