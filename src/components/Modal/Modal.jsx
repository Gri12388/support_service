import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { configSettings, selectMessage, selectModes, selectStatus } from '../../store/slices/claimsSlice.js';

import { claimsModes, claimsStatuses } from '../../data/data.js';

import '../../assets/styles/common.scss';

import loadingImage from '../../assets/images/loading.png';

function Modal({ afterHideModalFunctionsArray }) {
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с claimsSlice.js                                  
  //------------------------------------------------------------//
  let claimMode = useSelector(selectModes);
  let claimStatus = useSelector(selectStatus);
  let claimMessage = useSelector(selectMessage);
  const dispatch = useDispatch();



  //------------------------------------------------------------//
  // Функция скрывает модальное окно и вызывает функции из 
  //  afterHideModalFunctionsArray, если таковые имеются                                 
  //------------------------------------------------------------//
  function hideModal(e) {
    if (e.target.dataset.groupid !== 'Common__message' &&  claimStatus !== claimsStatuses.loading) {
      dispatch(configSettings({ status: claimsStatuses.ok, message: '' }));
      if (afterHideModalFunctionsArray && Array.isArray(afterHideModalFunctionsArray) && afterHideModalFunctionsArray.length > 0) afterHideModalFunctionsArray.forEach(item => item());
    }
  }



  //--------------------------------------------------------------------
  
  return (
    <>
      { claimMode === claimsModes.default && claimStatus === claimsStatuses.loading && (
        <div className='modal-area'>
          <div className='modal-message'>
            <img src={ loadingImage } alt='loading' className='loading' />
          </div>
        </div>
      )}
      { claimMode === claimsModes.default && claimStatus === claimsStatuses.error && (
        <div className='modal-area' onClick={ hideModal }>
          <div className='modal-message' datagroupid='Modal__message'>
            <p className='text3' datagroupid='Modal__message'>{ claimMessage }</p>
            <div className='button2 close-button'>╳</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;