import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectTypes } from '../../store/slices/typesSlice.js';

import '../../assets/styles/common.scss';
import './Sel.scss';

import arrowDown from '../../assets/images/arrow-down.svg';

function Sel({
  id,
  label,
  groupId,
  callback,
  placeholder,
}) {
  let types = useSelector(selectTypes);

  let [isVisible, setIsVisible] = useState(true);
  let [color, setColor] = useState('transparent');
  let [content, setContent] = useState(placeholder ?? '');
  let [display, setDisplay] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const onButtonClick = (e) => {
    e.preventDefault();
    toggleVisibility();
  }
  const chooseItem = (e) => {
    let temp = +e.currentTarget.dataset.id;
    setColor(types[temp].color);
    setContent(types[temp].type);
    setDisplay(true);
    toggleVisibility();
    callback({target: {value: types[temp].type}});
  }
  const onOutClick = (e) => {
    let temp = e.target.dataset.group;
    if (temp !== groupId) setIsVisible(false);
    debugger
  }

  useEffect(() => document.addEventListener('click', onOutClick), []);

  let labelCode;
  if (label) labelCode = (<label htmlFor={id} className='text1 InputText__label'>{label}</label>);

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

  return(
    <>
      {labelCode}
      <div className='input_wrapper Sel__base' data-id='1' data-group={groupId}>
        <button className='Sel__select' onClick={onButtonClick} data-group={groupId}>
          <div className='Sel__mark-area' onClick={toggleVisibility} style={{display: display ? 'flex' : 'none'}} data-group={groupId}>
            <div className='Sel__mark' style={{backgroundColor: color}} data-group={groupId}></div>
          </div>
          <p className='text3' data-group={groupId}>{content}</p>
        </button>
        <div className='Sel__side-area' onClick={toggleVisibility} data-group={groupId}>
          <img src={arrowDown} alt='arrow-down' data-group={groupId} />
        </div>
        <div className='Sel__drop' style={{display: isVisible ? 'block' : 'none'}} data-group={groupId}>
          {options}
        </div>
      </div>
    </>
  );
}

export default Sel;