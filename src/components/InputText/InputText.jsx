import React from 'react';

import '../../assets/styles/common.scss';
import './InputText.scss';

function InputText({ id, alt, img, type, label, value, state, callbacks, placeholder }) {
  
  return (
    <>
      { label && <label htmlFor={id} className='text1 InputText__label'>{label}</label> }
      <div className='input_wrapper'>
        <input 
          type={ type ? type : 'text' }
          id={id}
          name={id}
          className='input InputText__input'
          placeholder={placeholder ?? ''}
          value={value}
          onChange={callbacks && callbacks.onChange}
          onBlur={callbacks && callbacks.onBlur}
          style={{width: img ? '87%' : '100%'}}
        />
        {img && (
          <div className='image_wrapper'>
            <img 
              src={img} 
              alt={alt??'image'}
              className='InputText__image' 
            />   
          </div>
        )}
      </div>
      <p>{state && state.touched && !state.status && state.error}</p>
    </>
  );
}

export default InputText;


//if (label) labelCode = (<label htmlFor={id} className='text1 InputText__label'>{label}</label>);

//----------------

{/* {labelCode} */}

//----------------

 // let labelCode;

 //----------------

   // if (img) {
  //   imageCode = (
  //     <div className='image_wrapper'>
  //       <img 
  //         src={img} 
  //         alt={alt??'image'}
  //         className='InputText__image' 
  //       />   
  //     </div>
  //   )  
  // }

  //----------------

  // let imageCode;

  //----------------