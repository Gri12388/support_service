import React from 'react';
//import { useSelector, useDispatch } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { configSettings, selectMessage, selectModes, selectStatus } from '../../store/slices/claimsSlice.js';

import { claimsModes, claimsStatuses } from '../../data/data.js';

import c from '../../assets/styles/common.scss';

import loadingImage from '../../assets/images/loading.png';

function Modal({ afterHideModalFunctionsArray } : { afterHideModalFunctionsArray : Array<()=>any> | null }) {
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с claimsSlice.js                                  
  //------------------------------------------------------------//
  let claimMode = useAppSelector(selectModes);
  let claimStatus = useAppSelector(selectStatus);
  let claimMessage = useAppSelector(selectMessage);
  const dispatch = useAppDispatch();



  //------------------------------------------------------------//
  // Функция скрывает модальное окно и вызывает функции из 
  //  afterHideModalFunctionsArray, если таковые имеются                                 
  //------------------------------------------------------------//
  function hideModal(e : React.MouseEvent) : void {
    const target : { dataset? : { groupid? : string }} = e.target as { dataset? : { groupid? : string }};
    if (!target.dataset || !target.dataset.groupid || typeof target.dataset.groupid !== 'string') return;
    else if (target.dataset.groupid !== 'Common__message' &&  claimStatus !== claimsStatuses.loading) {
      dispatch(configSettings({ status: claimsStatuses.ok, message: '' }));
      if (afterHideModalFunctionsArray && Array.isArray(afterHideModalFunctionsArray) && afterHideModalFunctionsArray.length > 0) afterHideModalFunctionsArray.forEach(item => item());
    }
  }



  //--------------------------------------------------------------------
  
  return (
    <>
      { claimMode === claimsModes.default && claimStatus === claimsStatuses.loading && (
        <div className={ c.modalArea }>
          <div className={ c.modalMessage }>
            <img src={ loadingImage } alt='loading' className={ c.loading } />
          </div>
        </div>
      )}
      { claimMode === claimsModes.default && claimStatus === claimsStatuses.error && (
        <div className={ c.modalArea } onClick={ hideModal }>
          <div className={ c.modalMessage } data-groupid='Modal__message'>
            <p className={ c.text3 } data-groupid='Modal__message'>{ claimMessage }</p>
            <div className={ `${c.button2} ${c.closeButton}` }>╳</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;