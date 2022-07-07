import React, { useMemo } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import Type from '../Type/Type';
import Status from '../Status/Status';

import { roles } from '../../data/data';

import c from '../../assets/styles/common.scss';
import s from './ClaimTile.scss';

import type { Iclaim, Iobj } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение в мобильном режими плитки  
// на странице, расположенной по адресу: '/base/claims'.             
//------------------------------------------------------------//
function ClaimTile({ item, type, status } : { item : Iclaim, type : Iobj, status : Iobj }) : JSX.Element {

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const navigate : NavigateFunction = useNavigate();



  //------------------------------------------------------------//
  // Извлечение из sessionStorage статуса пользователя.                                  
  //------------------------------------------------------------// 
  const role : string | null = useMemo(() => sessionStorage.getItem('role'), []);

  

  //------------------------------------------------------------//
  // Обработчик ссылки 'Browse'. Перенаправляет пользователя 
  // на страницу, расположенную по адресу: '/base/claim' и 
  // передает в location.state данные элемента таблицы, которому
  // соответствует ссылка 'Browse'.                        
  //------------------------------------------------------------//
  const onBrowse = () : void => {
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
    ) return <></>;



    //--------------------------------------------------------------------

  return (
    <section className={ s.container }>
      <header className={ s.header }>
        <p className={ `${c.text10} ${s.title}` }>{ item.title }</p>
      </header>
      <main className={ s.main }>
        <div className={ s.row }>
          <p className={ c.text11 }>Created</p>
          <p className={ c.text5 }>{ new Date(item.createdAt).toLocaleDateString('en-US') }</p>
        </div>
        <div className={ s.row }>
          <p className={ c.text11 }>Type</p>
          <Type typeId={ type.id }/>
        </div>
        <div className={ s.row }>
          <p className={ c.text11 }>Status</p>
          <Status statusId={ status.id }/>
        </div>
        { role === roles.admin && <button className={ c.button3 } onClick={ onBrowse }>Browse</button> }
      </main>
    </section>
  );
}

export default ClaimTile;