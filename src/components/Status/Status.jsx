import React from 'react';

import c from '../../assets/styles/common.scss';
import s from './Status.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение статуса заявки.          
//------------------------------------------------------------//
function Status({ statusId }) {
  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage.                                  
  //------------------------------------------------------------// 
  const statuses = Object.values(JSON.parse(sessionStorage.getItem('statuses')));



  //--------------------------------------------------------------------
  
  return (
    <div className={ s.badge } style={{ backgroundColor: statuses[statusId].color }}>
      <p className={ s.text }>{ statuses[statusId].status }</p>
    </div>
  );
}

export default Status;