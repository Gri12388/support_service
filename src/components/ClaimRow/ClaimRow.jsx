import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Status from '../Status/Status.jsx';
import Type from '../Type/Type.jsx';

import { roles } from '../../data/data.js';

import c from '../../assets/styles/common.scss';
import s from './ClaimRow.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение строки в таблице на 
// странице, расположенной по адресу: '/base/claims'.             
//------------------------------------------------------------//
function ClaimRow({ item, type, status }) {
  
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const navigate = useNavigate();
  
  
  //------------------------------------------------------------//
  // Извлечение из sessionStorage статуса пользователя.                                  
  //------------------------------------------------------------// 
  const role = useMemo(() => sessionStorage.getItem('role'), []);


  
  //------------------------------------------------------------//
  // Обработчик ссылки 'Browse'. Перенаправляет пользователя 
  // на страницу, расположенную по адресу: '/base/claim' и 
  // передает в location.state данные элемента таблицы, которому
  // соответствует ссылка 'Browse'.                        
  //------------------------------------------------------------//
  function onBrowse () {
    navigate('/base/claim', {
      state: {
        id: item._id, 
        title: item.title, 
        description: item.description, 
        typeSlug: item.type && item.type.slug ? item.type.slug : null
      }
    });
  }



  //------------------------------------------------------------//
  // Условный пустой рендеринг.                        
  //------------------------------------------------------------//
  if (
    type === null || 
    type === undefined || 
    status === null || 
    status === undefined || 
    type.id === null || 
    type.id === undefined || 
    status.id === null || 
    status.id === undefined
  ) return;
  


  //--------------------------------------------------------------------
  
  return (
    <>
      <div className={ c.column1 }>
        <p className={ c.text3 }>{ item.title }</p>
      </div>
      <div className={ c.column2 }>
        <p className={ c.text3 }>{ new Date(item.createdAt).toLocaleDateString('en-US') }</p>
      </div>
      <div className={ c.column3 }>
        <Type typeId={ type.id }/> 
      </div>
      <div className={ c.column4 }>
        <Status statusId={ status.id }/>
      </div>
      <div className={ c.column5 }>
        { role === roles.admin && <p className={ c.text3Link } onClick={ onBrowse }>Browse</p> }
      </div>
    </>
  )
}

export default ClaimRow;