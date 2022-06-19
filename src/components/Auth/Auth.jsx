import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { configSettings, reset, selectModes, selectStatus } from '../../store/slices/claimsSlice.js';
import { resetPagerState } from '../../store/slices/pagerSlice.js';

import Login from '../Login/Login.jsx';
import Reg from '../Reg/Reg.jsx';

import { claimsModes, claimsStatuses } from '../../data/data.js';

import mainLogo from '../../assets/images/logo.svg';
import footerLogo from '../../assets/images/logo-invert.svg';
import poster from '../../assets/images/poster.png';


import '../../assets/styles/common.scss';
import './Auth.scss';

function Auth() {

  const dispatch = useDispatch();
  let claimMode = useSelector(selectModes);
  let claimStatus = useSelector(selectStatus);
  
  function showModal() {
    dispatch(configSettings({ mode: claimsModes.modal }));
  }
  
  function hideModal(e) {
    if (claimStatus !== claimsStatuses.loading && (e.target.id === 'Auth__modal-area' || e.target.id === 'Reg__button')) {
      dispatch(configSettings({ mode: claimsModes.default }));
    }
  }

  useEffect(() => {
    if (sessionStorage.key(0)) {
      sessionStorage.clear();
      dispatch(reset());
      dispatch(resetPagerState());
    }
  });
  

  return (
    <div className='container1'>
      <main className='Auth__main'>
        <section className='Auth__img-section'>
          <img src={poster} alt="poster" className='Auth__poster'/>
        </section>
        <section className='Auth__auth-section'>
          <img src={mainLogo} alt="logotype" className='Auth__main-logo' />
          <Login />
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
      {claimMode === claimsModes.modal && (
        <div 
          className='Auth__modal-area'
          id='Auth__modal-area' 
          onClick={hideModal}
        >
          <Reg />
        </div>
      )}
      
    </div>
  );
}

export default Auth;

// {loading.isLoading && (
//   <div className='Auth__modal-area' id='Auth__modal-area1' onClick={hideLoading}>
//     <section className='Auth__message'>
//       {!loading.message && (
//         <img src={loadingImage} alt='loading' className='loading' />
//       )}
//       {loading.message && (
//         <>
//           <p className='text3'>{loading.message}</p> 
//           <div className='button2 close-button' id='Auth__close-button'>╳</div>
//         </>
//       )}

//     </section>
//   </div>
// )}

//--------------------------------------------------------

  // const state = useSelector(selectPagerState);

  // let isModalBlocked = false;
  // const setIsModalBlocked = () => isModalBlocked = !isModalBlocked;

  // const [loading, setLoading] = useState({isLoading: false, isBlocked: false, message: ''});

  // const hideLoading = e => {
  //   if (!loading.isBlocked && (e.target.id === 'Auth__modal-area1' || e.target.id === 'Auth__close-button')) {
  //     setLoading({isLoading: false, isBlocked: false, message: ''});
  //     setEmail({content: '', status: false, touched: false, error: errors.emailErrors.noEmail});
  //     setPassword({content: '', status: false, touched: false, error: errors.passwordErrors.noPassword});
  //   }
  // } 