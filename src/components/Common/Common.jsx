import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { configSettings, selectMessage, selectModes, selectStatus } from '../../store/slices/claimsSlice.js';

import { claimsModes, claimsStatuses } from '../../data/data.js';


import '../../assets/styles/common.scss';

import loadingImage from '../../assets/images/loading.png';

function Common() {

  const location = useLocation();
  const dispatch = useDispatch();
  let claimMode = useSelector(selectModes);
  let claimStatus = useSelector(selectStatus);
  let claimMessage = useSelector(selectMessage);

  function hideModal(e) {
    if (e.target.dataset.groupid !== 'Common__message' &&  claimStatus !== claimsStatuses.loading) {
      dispatch(configSettings({ status: claimsStatuses.ok, message: '' }));
    }
  }

  return (
    <>
      {location.pathname === '/' && <Navigate to={'/auth'} replace={true}/>}
      <Outlet />
      { claimMode === claimsModes.default && claimStatus === claimsStatuses.loading && (
        <div className='modal-area'>
          <div className='modal-message'>
            <img src={ loadingImage } alt='loading' className='loading' />
          </div>
        </div>
      )}
      { claimMode === claimsModes.default && claimStatus === claimsStatuses.error && (
        <div className='modal-area' onClick={ hideModal }>
          <div className='modal-message' datagroupid='Common__message'>
            <p className='text3' datagroupid='Common__message'>{ claimMessage }</p>
            <div className='button2 close-button'>╳</div>
          </div>
        </div>
      )}
    </>
  );
}

export default Common;