import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Type from '../Type/Type.jsx';
import Status from '../Status/Status.jsx';

import { roles } from '../../data/data.js';

import './ClaimTile.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение в мобильном режими плитки  
// на странице, расположенной по адресу: '/base/claims'.             
//------------------------------------------------------------//
function ClaimTile({ item, type, status }) {

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
  const onBrowse = () => {
    navigate('/base/claim', {
      state: {
        id: item._id, 
        title: item.title, 
        description: item.description, 
        typeSlug: item.type.slug
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
    <section className='CT__container'>
      <header className='CT__header'>
        <p className='text10 CT__title'>{ item.title }</p>
      </header>
      <main className='CT__main'>
        <div className='CT__row'>
          <p className='text11'>Created</p>
          <p className='text5'>{ new Date(item.createdAt).toLocaleDateString('en-US') }</p>
        </div>
        <div className='CT__row'>
          <p className='text11'>Type</p>
          <Type typeId={ type.id }/>
        </div>
        <div className='CT__row'>
          <p className='text11'>Status</p>
          <Status statusId={ status.id }/>
        </div>
        { role === roles.admin && <button className='button3' onClick={ onBrowse }>Browse</button> }
      </main>
    </section>
  );
}

export default ClaimTile;