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
  return (
    <>
      <label htmlFor={id} className='text1 InputText__label'>{label}</label>
      <div className='InputText__input_wrapper'>
        <input 
          type={type ? type : 'text' }
          id={id}
          name={id}
          className='InputText__input'
          placeholder={placeholder??''}
          value={value}
          onChange={callback}
         />
         <div className='InputText__image_wrapper'>
          <img 
            src={img} 
            alt={alt??'image'}
            className='InputText__image' 
          />   
         </div>
      </div>
    </>
  );
}

export default InputText;