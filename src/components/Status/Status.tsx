import React from 'react';

import s from './Status.scss';

import type { Iobj } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение статуса заявки.          
//------------------------------------------------------------//
function Status({ statusId } : { statusId : number }) : JSX.Element {
  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage.                                  
  //------------------------------------------------------------// 
  const statuses : Iobj[] = Object.values(JSON.parse(sessionStorage.getItem('statuses')!));



  //--------------------------------------------------------------------
  
  return (
    <div className={ s.badge } style={{ backgroundColor: statuses[statusId].color }}>
      <p className={ s.text }>{ statuses[statusId].status }</p>
    </div>
  );
}

export default Status;