import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from "react-router-dom";

import { selectStatus } from '../../store/slices/claimsSlice.js';

import Search from '../Search/Search.jsx';
import Slider from '../Slider/Slider.jsx';

import '../../assets/styles/common.scss';
import './Base.scss';


import baseUser from '../../assets/images/user.png';
import loadingImage from '../../assets/images/loading.png';

import baseLogo from '../../assets/images/logo-invert.svg';
import baseSprite from '../../assets/images/sprite.svg';

function Base() {

  let status = useSelector(selectStatus);

  let [windowWidth, setWindowWidth] = useState(window.innerWidth);

  let [sliderConfig, setSliderConfig] = useState({isVisible: false});

  const onBaseWindowWidthResize = () => setWindowWidth(window.innerWidth);

  useEffect(()=> {
    window.addEventListener('resize', onBaseWindowWidthResize);
    return () => {
      window.removeEventListener('resize', onBaseWindowWidthResize);
    }
  }, []);

  const showSlider = () => setSliderConfig(state=>({...state, isVisible: true}));
  const hideSlider = () => setSliderConfig(state=>({...state, isVisible: false}));
  const burgerHandler = () => {
    if (sliderConfig.isVisible) hideSlider();
    else showSlider();
  }

  const location = useLocation();

  const baseIconsData = [
    {id: 0, name: 'home'},
    {id: 1, name: 'globe'},
    {id: 2, name: 'archive'},
    {id: 3, name: 'piechart'},
    {id: 4, name: 'dollar'},
    {id: 5, name: 'database'},
    {id: 6, name: 'location'},
  ];

  const baseIcons = baseIconsData.map(item => (
    <svg class="Base__aside_svg" key={item.id}>
      <use href={baseSprite + `#${item.name}`}></use>
    </svg>
  ));

  return (
    <div className='container1 Base__container'>
      <aside className='Base__aside'>
        <img src={baseLogo} alt="logotype" className='Base__logo' />
        {baseIcons}
      </aside>
      <section className='Base__section'>
        <div className='Base__header_wrapper'>
          <div className='Base__burger interactiv' onClick={burgerHandler}>
            <div className={sliderConfig.isVisible ? 'Base__burger-line1_cross' : 'Base__burger-line1'} />
            <div className={sliderConfig.isVisible ? 'Base__burger-line2_cross' : 'Base__burger-line2'} />
            <div className={sliderConfig.isVisible ? 'Base__burger-line3_cross' : 'Base__burger-line3'} />
          </div>
          <header className='Base__header'>
            {location.pathname === '/base/claims' ? <Search /> : null}
            <svg class="Base__bell-off_svg">
              <use href={baseSprite + `#bellOff`}></use>
            </svg>
            <img src={baseUser} alt="user" className='Base__user'/>
            <span className='Base__full-name'>Ivan Ivanov</span>
            <svg class="Base__quit_svg">
              <use href={baseSprite + `#quit`}></use>
            </svg>
          </header>
        </div>
        <main className='Base__main'>
          <Outlet />
        </main>
      </section>
      {status === 'loading' && (
        <div className='modal-area'>
          <div className='modal-message'>
            <img src={loadingImage} alt='loading' className='loading' />
          </div>
        </div>
      )}
      <Slider sliderConfig={sliderConfig} 
              functions={{setSliderConfig: setSliderConfig}}
      />
    </div>
  );
}

export default Base;

//---------------

// {/* <img src={baseHome} alt="home" className='interactiv Base__pic' />
//         <img src={baseGlobe} alt="globe" className='interactiv Base__pic' />
//         <img src={baseArchive} alt="globe" className='interactiv Base__pic' />
//         <img src={basePieChart} alt="globe" className='interactiv Base__pic' />
//         <img src={baseDollar} alt="globe" className='interactiv Base__pic' />
//         <img src={baseDatabase} alt="globe" className='interactiv Base__pic' />
//         <img src={baseNavigation} alt="globe" className='interactiv Base__pic' /> */}

//-----------------------------

// {/* <img src={windowWidth > 799 ? baseBell : baseBell1} alt="bell" className='Base__bell'/> */}