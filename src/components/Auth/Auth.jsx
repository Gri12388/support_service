import React, { useState } from 'react';

import Login from '../Login/Login.jsx';
import Reg from '../Reg/Reg.jsx';
import { errors } from '../../data/data.js';

import mainLogo from '../../assets/images/logo.svg';
import footerLogo from '../../assets/images/logo-invert.svg';
import poster from '../../assets/images/poster.png';
import loadingImage from '../../assets/images/loading.png';

import '../../assets/styles/common.scss';
import './Auth.scss';

function Auth() {
  const [email, setEmail] = useState({content: '', status: false, touched: false, error: errors.emailErrors.noEmail});
  const [password, setPassword] = useState({content: '', status: false, touched: false, error: errors.passwordErrors.noPassword});

  let isModalBlocked = false;
  const setIsModalBlocked = () => isModalBlocked = !isModalBlocked;

  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState({isLoading: false, isBlocked: false, message: ''});

  // const showLoading = () => setLoading(state=>({...state, isLoading: true, isBlocked: true}));
  const hideLoading = e => {
    if (!loading.isBlocked && (e.target.id === 'Auth__modal-area1' || e.target.id === 'Auth__close-button')) {
      setLoading({isLoading: false, isBlocked: false, message: ''});
      setEmail({content: '', status: false, touched: false, error: errors.emailErrors.noEmail});
      setPassword({content: '', status: false, touched: false, error: errors.passwordErrors.noPassword});
    }
  } 
  const showModal = () => setIsVisible(true);
  const hideModal = (e) => {
    if (!isModalBlocked && (e.target.id === 'Auth__modal-area' || e.target.id === 'Reg__button')) setIsVisible(false);
  };

  if (sessionStorage.key(0)) sessionStorage.clear();

  return (
    <div className='container1'>
      <main className='Auth__main'>
        <section className='Auth__img-section'>
          <img src={poster} alt="poster" className='Auth__poster'/>
        </section>
        <section className='Auth__auth-section'>
          <img src={mainLogo} alt="logotype" className='Auth__main-logo' />
          <Login setLoading={setLoading} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>
          <p className='text2 Auth__text'>
            Not a member?
            <span className='text2 interactiv Auth__text-marked' onClick={showModal}>
              &nbsp;Request registration
            </span>
          </p>
        </section>
      </main>
      <footer className='Auth__footer'>
        <img src={footerLogo} alt="logotype" className='Auth__footer-logo' />
      </footer>
      {isVisible && (
        <div 
          className='Auth__modal-area'
          id='Auth__modal-area' 
          onClick={hideModal}
        >
          <Reg toggleBlockModal={setIsModalBlocked}/>
        </div>
      )}
      {loading.isLoading && (
        <div className='Auth__modal-area' id='Auth__modal-area1' onClick={hideLoading}>
          <section className='Auth__message'>
            {!loading.message && (
              <img src={loadingImage} alt='loading' className='loading' />
            )}
            {loading.message && (
              <>
                <p className='text3'>{loading.message}</p> 
                <div className='button2 close-button' id='Auth__close-button'>╳</div>
              </>
            )}

          </section>
        </div>
      )}
    </div>
  );
}

export default Auth;

//-----------------------------

//  {/* <div 
//         className={isVisible ? 'Auth__modal-area' : 'Auth__modal-area_hidden'}
//         id='Auth__modal-area' 
//         //className='Auth__modal-area' 
//         onClick={hideModal}
//       >
//         <Reg />
//       </div> */}

//-----------------------------

// useEffect(() => {
  //   const body = document.getElementsByTagName('body');
  //   if (isVisible) {
  //     body[0].style.overflow = 'hidden';
  //     body[0].style.paddingRight = '15px';
  //   }
  //   else {
  //     body[0].style.overflow = 'unset';
  //     body[0].style.paddingRight = 'unset';
  //     let temp = document.querySelectorAll('.Reg__section .InputText__input').forEach(item => item.value = '');
  //   }
  // }, [isVisible]);