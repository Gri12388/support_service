import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Search from '../Search/Search.jsx';
import Slider from '../Slider/Slider.jsx';

import '../../assets/styles/common.scss';
import './Base.scss';

import baseUser from '../../assets/images/user.png';

import baseLogo from '../../assets/images/logo-invert.svg';
import baseSprite from '../../assets/images/sprite.svg';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// страницы, служащей основой для компонентов Claims, 
// NewClaim и OldClaim.                            
//------------------------------------------------------------//
function Base() {

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const location = useLocation();
  const navigate = useNavigate();



  //------------------------------------------------------------//
  // Создание локального состояния sliderConfig, регулирующего
  // отображение компонента Slider.                                  
  //------------------------------------------------------------//
  const [sliderConfig, setSliderConfig] = useState({ isVisible: false });



  //------------------------------------------------------------//
  // Массив объектов, состоящих из id и названия. Используется
  // при создании набора иконок, отображаемых на боковой панели.                                  
  //------------------------------------------------------------//
  const baseIconsData = [
    { id: 0, name: 'home' },
    { id: 1, name: 'globe' },
    { id: 2, name: 'archive' },
    { id: 3, name: 'piechart' },
    { id: 4, name: 'dollar' },
    { id: 5, name: 'database' },
    { id: 6, name: 'location' },
  ];



  //------------------------------------------------------------//
  // Функция, отображающая слайдер.                                  
  //------------------------------------------------------------//
  function showSlider() {
    setSliderConfig(state => ({ ...state, isVisible: true }));
  }



  //------------------------------------------------------------//
  // Функция, скрывающая слайдер.                                  
  //------------------------------------------------------------//
  function hideSlider() {
    setSliderConfig(state => ({ ...state, isVisible: false }));
  }



  //------------------------------------------------------------//
  // Обработчик иконки выхода. Переносит пользователя на
  // страницу '/'.                                  
  //------------------------------------------------------------//
  function quitSession() {
    navigate('/', {replace: true});
  }



  //------------------------------------------------------------//
  // Обработчик иконки бургера. Скрывает/показывает слайдер.                                  
  //------------------------------------------------------------//
  function burgerHandler() {
    if (sliderConfig.isVisible) hideSlider();
    else showSlider();
  }



  //------------------------------------------------------------//
  // Иконка боковой панели.                                  
  //------------------------------------------------------------//
  const baseIcons = baseIconsData.map(item => (
    <svg className='Base__aside_svg' key={item.id}>
      <use href={ baseSprite + `#${ item.name }` }></use>
    </svg>
  ));



  //--------------------------------------------------------------------

  return (
    <div className='container1 Base__container'>
      <aside className='Base__aside'>
        <img src={ baseLogo } alt='logotype' className='Base__logo' />
        { baseIcons }
      </aside>
      <section className='Base__section'>
        <div className='Base__header_wrapper'>
          <div className='Base__burger interactiv' onClick={ burgerHandler }>
            <div className={sliderConfig.isVisible ? 'Base__burger-line1_cross' : 'Base__burger-line1'} />
            <div className={sliderConfig.isVisible ? 'Base__burger-line2_cross' : 'Base__burger-line2'} />
            <div className={sliderConfig.isVisible ? 'Base__burger-line3_cross' : 'Base__burger-line3'} />
          </div>
          <header className='Base__header'>
            { location.pathname === '/base/claims' ? <Search /> : null }
            <svg className='Base__bell-off_svg'>
              <use href={ baseSprite + `#bellOff` }></use>
            </svg>
            <img src={ baseUser } alt='user' className='Base__user'/>
            <span className={sessionStorage.key(0) ? 'Base__full-name' : 'Base__full-name_unauthenticated'} >
              { sessionStorage.key(0) ? sessionStorage.getItem('fullName') : 'Not authenticated'}
            </span>
            <svg className='Base__quit_svg' onClick={ quitSession }>
              <use href={ baseSprite + `#quit` }></use>
            </svg>
          </header>
        </div>
        <main className='Base__main'>
          <Outlet />
        </main>
      </section>
      <Slider sliderConfig={ sliderConfig } 
              functions={{ setSliderConfig: setSliderConfig }}
      />
    </div>
  );
}

export default Base;