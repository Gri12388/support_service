import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from "react-router-dom";

import { selectStatus } from '../../store/slices/claimsSlice.js';

import Search from '../Search/Search.jsx';
import Claims from '../Claims/Claims.jsx';


import './Base.scss';

import baseArchive from '../../assets/images/globe.svg';
import baseDatabase from '../../assets/images/database.svg';
import baseDollar from '../../assets/images/dollar.svg';
import baseGlobe from '../../assets/images/globe.svg';
import baseHome from '../../assets/images/home.svg';
import baseLogo from '../../assets/images/logo-invert.svg';
import baseNavigation from '../../assets/images/navigation.svg';
import basePieChart from '../../assets/images/pie-chart.svg';
import baseBell from '../../assets/images/bell.svg';
import baseBell1 from '../../assets/images/bell1.svg';
import baseUser from '../../assets/images/user.png';
import baseQuit from '../../assets/images/quit.svg';
import loadingImage from '../../assets/images/loading.png';

function Base() {

  let status = useSelector(selectStatus);

  let [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const onBaseWindowWidthResize = () => setWindowWidth(window.innerWidth);

  useEffect(()=> {
    window.addEventListener('resize', onBaseWindowWidthResize);
    return () => {
      window.removeEventListener('resize', onBaseWindowWidthResize);
    }
  }, []);

  const location = useLocation();
  const search = location.pathname === '/base/claims' ? <Search /> : null;

  return (
    <div className='container1 Base__container'>
      <aside className='Base__aside'>
        <img src={baseLogo} alt="logotype" className='Base__logo' />
        <img src={baseHome} alt="home" className='interactiv Base__pic' />
        <img src={baseGlobe} alt="globe" className='interactiv Base__pic' />
        <img src={baseArchive} alt="globe" className='interactiv Base__pic' />
        <img src={basePieChart} alt="globe" className='interactiv Base__pic' />
        <img src={baseDollar} alt="globe" className='interactiv Base__pic' />
        <img src={baseDatabase} alt="globe" className='interactiv Base__pic' />
        <img src={baseNavigation} alt="globe" className='interactiv Base__pic' />
      </aside>
      <section className='Base__section'>
        <div className='Base__header_wrapper'>
          <div className='Base__burger'>
            <div className='Base__burger_line' />
            <div className='Base__burger_line' />
            <div className='Base__burger_line' />
          </div>
          <header className='Base__header'>
            {search}
            <img src={windowWidth > 799 ? baseBell : baseBell1} alt="bell" className='Base__bell'/>
            <img src={baseUser} alt="user" className='Base__user'/>
            <span className='Base__full-name'>Ivan Ivanov</span>
            <img src={baseQuit} alt="quit" className='Base__quit'/>
          </header>
        </div>
        <main>
          {/* <Claims /> */}
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
    </div>
  );
}

export default Base;