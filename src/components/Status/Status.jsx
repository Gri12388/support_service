import React from 'react';
import { useSelector } from 'react-redux';

import { selectStatuses } from '../../store/slices/statusesSlice.js';

import '../../assets/styles/common.scss';
import './Status.scss';

function Status({ statusId }) {
  const statuses = useSelector(selectStatuses);

  return (
    <div className='Status__badge' style={{backgroundColor: statuses[statusId].color}}>
      <p className='Status__text'>{statuses[statusId].status}</p>
    </div>
  );
}

export default Status;