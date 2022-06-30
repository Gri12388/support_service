import React, { useState, useMemo, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Search from '../Search/Search.jsx';
import Slider from '../Slider/Slider.jsx';

import c from '../../assets/styles/common.scss';
import s from './Base.scss';

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
  // Проверка того, имеется ли в sessionStorage что-либо. От 
  // наличия или отсутствия в sessionStorage данных будет 
  // зависеть дальнейшее развитие событий: рендеринг или 
  // переход на обусловленную страницу.                                  
  //------------------------------------------------------------//
  const isSessionBad = useMemo(() => {
    return !sessionStorage.key(0);
  }, []);


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
    navigate('/');
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
    <svg className={ s.asideSvg } key={item.id}>
      <use href={ baseSprite + `#${ item.name }` }></use>
    </svg>
  ));



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Если sessionStorage пуст
  // то происходит переход на страницу, расположенную по 
  // адресу '/'.                                 
  //------------------------------------------------------------//
  useEffect(() => {
    if (isSessionBad) navigate('/');
  }, []);



  //------------------------------------------------------------//
  // Условие, при котором ничего не надо рендерить, так как 
  // вслед за ним произойдет переход на другую страницу.                                
  //------------------------------------------------------------//
  if (isSessionBad) return;

  //--------------------------------------------------------------------

  return (
    <div className={ `${c.container1} ${s.container}` }>
      <aside className={ s.aside }>
        <img src={ baseLogo } alt='logotype' className={ s.logo } />
        { baseIcons }
      </aside>
      <section className={ s.section }>
        <div className={ s.headerWrapper }>
          <div className={ `${s.burger} ${c.interactiv}` } onClick={ burgerHandler }>
            <div className={sliderConfig.isVisible ? s.burgerLine1Cross : s.burgerLine1 } />
            <div className={sliderConfig.isVisible ? s.burgerLine2Cross : s.burgerLine2 } />
            <div className={sliderConfig.isVisible ? s.burgerLine3Cross : s.burgerLine3 } />
          </div>
          <header className={ s.header }>
            { location.pathname === '/base/claims' ? <Search /> : null }
            <svg className={ s.bellOffSvg }>
              <use href={ baseSprite + `#bellOff` }></use>
            </svg>
            <img src={ baseUser } alt='user' className={ s.user } />
            <span className={ sessionStorage.key(0) ? s.fullName : s.fullNameUnauthenticated }>
              { sessionStorage.key(0) ? sessionStorage.getItem('fullName') : 'Not authenticated'}
            </span>
            <Link to='/'>
              <svg className={ s.quitSvg }>
                <use href={ baseSprite + `#quit` }></use>
              </svg>
            </Link>
          </header>
        </div>
        <main className={ s.main }>
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