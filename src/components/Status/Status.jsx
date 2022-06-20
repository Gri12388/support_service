import React from 'react';

import '../../assets/styles/common.scss';
import './Status.scss';

function Status({ statusId }) {
  const statuses = Object.values(JSON.parse(sessionStorage.getItem('statuses')));

  return (
    <div className='Status__badge' style={{ backgroundColor: statuses[statusId].color }}>
      <p className='Status__text'>{ statuses[statusId].status }</p>
    </div>
  );
}

export default Status;