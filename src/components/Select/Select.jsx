import React from 'react';

import '../../assets/styles/common.scss';
import './Select.scss';

function Select({
  id,
  label,
  array,
  callback,
  placeholder,
}) {
  let labelCode;
  let options;

  if (label) labelCode = (<label htmlFor={id} className='text1 InputText__label'>{label}</label>);
  
  options = array.map(item => (
    <option key={item.id} value={item.value}>{item.content}</option>
  ));

  return (
    <>
      {labelCode}
      <div className='input_wrapper'>
        <select 
          id={id}
          name={id}
          className='input'
          placeholder={placeholder??''}
          onChange={callback}
        >
          <option value='' selected></option>
          {options}
        </select>
      </div>
    </>
  );
}

export default Select;