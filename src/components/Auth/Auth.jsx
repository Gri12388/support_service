import React, { useState, useEffect } from 'react';

import Login from '../Login/Login.jsx';
import Reg from '../Reg/Reg.jsx';

import mainLogo from '../../assets/images/logo.svg';
import footerLogo from '../../assets/images/logo-invert.svg';
import poster from '../../assets/images/poster.png';

import './Auth.scss';

function Auth() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const body = document.getElementsByTagName('body');
    if (isVisible) {
      body[0].style.overflow = 'hidden';
      body[0].style.paddingRight = '15px';
    }
    else {
      body[0].style.overflow = 'unset';
      body[0].style.paddingRight = 'unset';
      let temp = document.querySelectorAll('.Reg__section .InputText__input').forEach(item => item.value = '');
    }
  }, [isVisible]);

  const showModal = () => setIsVisible(true);
  const hideModal = (e) => {
    if (e.target.id === 'Auth__modal-area' || e.target.id === 'Reg__button') setIsVisible(false);
  };

  return (
    <div className='container1'>
      <main className='Auth__main'>
        <section className='Auth__img-section'>
          <img src={poster} alt="poster" className='Auth__poster'/>
        </section>
        <section className='Auth__auth-section'>
          <img src={mainLogo} alt="logotype" className='Auth__main-logo' />
          <Login callback={showModal}/>
        </section>
      </main>
      <footer className='Auth__footer'>
        <img src={footerLogo} alt="logotype" className='Auth__footer-logo' />
      </footer>
      <div 
        className={isVisible ? 'Auth__modal-area' : 'Auth__modal-area_hidden'}
        id='Auth__modal-area' 
        //className='Auth__modal-area' 
        onClick={hideModal}
      >
        <Reg />
      </div>
    </div>
  );
}

export default Auth;