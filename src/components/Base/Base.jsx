import React from 'react';

import Search from '../Search/Search.jsx';

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
import baseUser from '../../assets/images/user.png';
import baseQuit from '../../assets/images/quit.svg';

function Base() {
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
        <header className='Base__header'>
          <Search />
          <img src={baseBell} alt="bell" className='Base__bell'/>
          <img src={baseUser} alt="user" className='Base__user'/>
          <span className='Base__full-name'>Ivan Ivanov</span>
          <img src={baseQuit} alt="quit" className='Base__quit'/>
        </header>
        <main></main>
      </section>
    </div>
  );
}

export default Base;