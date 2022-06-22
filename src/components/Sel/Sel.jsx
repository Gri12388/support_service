import React, { useEffect, useMemo, useState } from 'react';

import '../../assets/styles/common.scss';
import './Sel.scss';

import sprite from '../../assets/images/sprite.svg';



function Sel({ id, label, value, groupId, state, callbacks, placeholder }) {
  
  let types = useMemo (() => {
    const result = {};
    Object.values(JSON.parse(sessionStorage.getItem('types')))
    .filter(item => item.slug)
    .forEach(item => result[item.id] = item);
    return result;
  }, []);

  let typesLength = useMemo(() => {
    return Object.values(types).length;
  },[]);

  
  let [isVisible, setIsVisible] = useState(false);
  let [color, setColor] = useState(value ? types[value].color : 'transparent');
  let [content, setContent] = useState(value ? types[value].type : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}`);
  let [pointed, setPointed] = useState(null);
  let [display, setDisplay] = useState(value ? true : false);
  let [selElement, setSelElement] = useState();

  useEffect(() => {
    setSelElement(document.getElementById(id));
  }, []);



  function toggleVisibility() {
    setIsVisible(!isVisible);
    console.log('click')
  }
  function onButtonClick(e) {
    e.preventDefault();
    toggleVisibility();  
  }
  function chooseItem(e) {
    setPointed(null);
    let temp = +e.currentTarget.dataset.id;
    setColor(types[temp].color);
    setContent(types[temp].type);
    setDisplay(true);
    toggleVisibility();
    callbacks.onChange(types[temp].id.toString());
  }
  function onKeyDown(e) {
    e.preventDefault();
    let temp = pointed;
    if (state.content && (e.code === 'Enter' || e.key === 'Enter')) callbacks && callbacks.onPressedEnter && callbacks.onPressedEnter(e);
    else if (!state.content && (e.code === 'Enter' || e.key === 'Enter')) toggleVisibility();
    else if (isVisible && temp === null && (e.code === 'ArrowUp' || e.key === 'ArrowUp')) {
      setIsVisible(false);
    }
    else if (isVisible && temp === null && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      temp = 0;
    }
    else if (isVisible && temp === 0 && (e.code === 'ArrowUp' || e.key === 'ArrowUp')) {
      temp = null;
      setIsVisible(false);
    }
    else if (isVisible && temp === typesLength - 1 && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
    }
    else if (isVisible && (e.code === 'ArrowUp' || e.key === 'ArrowUp')) {
      temp--;
    }
    else if (isVisible && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      temp++;
    }
    else if (!isVisible && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      setIsVisible(true);
    }
    setPointed(temp);
  } 


  function onOutClick(e) {
    let temp = e.target.dataset.group;
    if (temp !== groupId) setIsVisible(false);
  }
  useEffect(() => {
    document.addEventListener('click', onOutClick);
    return () => document.removeEventListener('click', onOutClick);
  }, []);


  function configInputWrapperView() {
    if (state && !state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper' 
      };
    };
    if (state && !state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper' 
      };
    };
    if (state && !state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__error' 
      };
    };
    if (state && state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__focused' 
      };
    };
    if (state && state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__focused' 
      };
    };
    if (state && state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__focused' 
      };
    }
    else return { 
      isWarningShown: false, 
      className: 'input_wrapper Sel__base Sel__input_wrapper' 
    };
  }

  function configureItemView(id) {
    if (pointed === id) return 'input_wrapper Sel__item Sel__item-pointed';
    else return 'input_wrapper Sel__item';
  }

  function onMouseEnter(e) {
    setPointed(+e.target.dataset.id);
  }

  // function onMouseleave() {
  //   selElement.focus();
  // }

  const options = Object.values(types).map(item => {
    return (
      <div  key={ item.id } 
            className={ configureItemView(item.id) } 
            onClick={ chooseItem } 
            onMouseEnter={ onMouseEnter }
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
      <button  className={ configInputWrapperView().className } 
            id={ id }
            onClick={ onButtonClick } 
            onFocus={ callbacks && callbacks.onFocus }
            onBlur={ callbacks.onBlur }
            onKeyDown={ onKeyDown }
            //onClick={ toggleVisibility }
            data-group={groupId}
      >
        <div className='Sel__select'
                // id={ id } 
                // onClick={ onButtonClick } 
                // onFocus={ callbacks && callbacks.onFocus }
                // onBlur={ callbacks.onBlur }
                // onKeyDown={ onKeyDown }
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
              data-group={ groupId }
          >
            { value ? content : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}` }
          </p>
        </div>
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
              // onMouseLeave={ onMouseleave }
              data-group={ groupId }
        >
          {options}
        </div>
      </button>
      <p className='text8'>{ configInputWrapperView().isWarningShown && state.error }</p>
    </>
  );
}

export default Sel;