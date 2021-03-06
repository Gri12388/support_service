import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { configSettings, reset, selectModes, selectStatus } from '../../store/slices/claimsSlice';
import { resetPagerState } from '../../store/slices/pagerSlice';

import Login from '../Login/Login';
import Reg from '../Reg/Reg';

import { claimsModes, claimsStatuses } from '../../data/data';

import mainLogo from '../../assets/images/logo.svg';
import footerLogo from '../../assets/images/logo-invert.svg';
import poster from '../../assets/images/poster.png';

import c from '../../assets/styles/common.scss';
import s from './Auth.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// страницы, служащей основой для компонентов регистрации и
// аунтификации.                            
//------------------------------------------------------------//
function Auth() : JSX.Element {

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//

  const claimMode = useAppSelector(selectModes);
  const claimStatus = useAppSelector(selectStatus);
  const dispatch = useAppDispatch();
  


  //------------------------------------------------------------//
  // Установка локального состояния, которое передается в Login 
  // компонент для того, чтобы после сокрытия модального окна Reg  
  // компонента фокус был выставлен на нужный input элемент
  //  Login компонента.
  //------------------------------------------------------------// 
  const [signal, setSignal] : [signal: boolean, setSignal: React.Dispatch<React.SetStateAction<boolean>>] = useState(false);



  //------------------------------------------------------------//
  // Функция, показывающая модальное окно.
  //------------------------------------------------------------// 
  function showModal() : void {
    dispatch(configSettings({ mode: claimsModes.modal }));
  }
  


  //------------------------------------------------------------//
  // Функция, скрывающая модальное окно и отсылающая сигнал
  // в Login компонент.
  //------------------------------------------------------------// 
  function hideModal(e : React.MouseEvent) : void {
    const target : { id?: string } = e.target as { id?: string };
    if (claimStatus !== claimsStatuses.loading && (target.id === 'Auth__modal-area' || target.id === 'Reg__button')) {
      dispatch(configSettings({ mode: claimsModes.default }));
      setSignal(state => !state);
    }
  }



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Очищает sessionStorage, 
  // чтобы при каждом выходе пользователя на данную страницу 
  // его сессия с сервером прекращалась.
  //------------------------------------------------------------// 
  useEffect(() => {
    if (sessionStorage.key(0)) {
      sessionStorage.clear();
      dispatch(reset());
      dispatch(resetPagerState());
    }
  }, []);
  


  //------------------------------------------------------------

  return (
    <div className={ c.container1 }>
      <main className={ s.main }>
        <section className={ s.imgSection }>
          <img src={ poster } alt='poster' className={ s.poster }/>
        </section>
        <section className={ s.authSection }>
          <img src={ mainLogo } alt='logotype' className={ s.mainLogo } />
          <Login signal={ signal }/>
          <p className={ `${c.text2} ${s.text}` }>
            Not a member?
            <span className={ `${c.text2} ${c.interactiv} ${s.textMarked}` } onClick={ showModal }>
              &nbsp;Request registration
            </span>
          </p>
        </section>
      </main>
      <footer className={ s.footer }>
        <img src={ footerLogo } alt='logotype' className={ s.footerLogo } />
      </footer>
      {claimMode === claimsModes.modal && (
        <div 
          className={ s.modalArea }
          id='Auth__modal-area' 
          onClick={ hideModal }
        >
          <Reg />
        </div>
      )}
      
    </div>
  );
}

export default Auth;