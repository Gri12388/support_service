import React from 'react';

import c from '../../assets/styles/common.scss';
import s from './Type.scss';

import type { Iobj } from '../../commonTypes';

//------------------------------------------------------------//
// Компонент отвечает за отображение типа заявки.          
//------------------------------------------------------------//
function Type({ typeId } : { typeId : number }) : JSX.Element {
  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage.                                  
  //------------------------------------------------------------// 
  const types : Iobj[] = Object.values(JSON.parse(sessionStorage.getItem('types')!));



  //--------------------------------------------------------------------
  
  return (
    <div className={ s.wrapper }>
      <div className={ s.mark } style={{ backgroundColor: types[typeId].color }}></div>
      <p className={ c.text5 }>{ types[typeId].type }</p>
    </div>
  );
}

export default Type;