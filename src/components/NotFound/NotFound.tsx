import React from 'react';

import c from '../../assets/styles/common.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение ненайденной страницы.        
//------------------------------------------------------------//
function NotFound() : JSX.Element {
  return (
    <p className={ c.text3 }>There&apos;s nothing here!</p>
  );
}

export default NotFound;