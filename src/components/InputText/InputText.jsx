import React from 'react';

import '../../assets/styles/common.scss';
import './InputText.scss';

function InputText({
  id,
  type,
  label,
  placeholder,
  value,
  img,
  alt,
  callback
}) {

  let imageCode;
  let labelCode;

  if (label) labelCode = (<label htmlFor={id} className='text1 InputText__label'>{label}</label>);

  if (img) {
    imageCode = (
      <div className='image_wrapper'>
        <img 
          src={img} 
          alt={alt??'image'}
          className='InputText__image' 
        />   
      </div>
    )  
  }

  return (
    <>
      {labelCode}
      <div className='input_wrapper'>
        <input 
          type={type ? type : 'text' }
          id={id}
          name={id}
          className='input InputText__input'
          placeholder={placeholder??''}
          value={value}
          onChange={callback}
          style={{width: img ? '87%' : '100%'}}
         />
         {imageCode}
      </div>
    </>
  );
}

export default InputText;