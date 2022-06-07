import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { pager } from '../../data/data.js';
import { selectTotalClaimsNumber } from '../../store/slices/claimsSlaice.js';

import './Pager.scss';

function Pager() {

  

  const totalClaimsNumber = useSelector(selectTotalClaimsNumber);
  let [pageNumber, setPageNumber] = useState(10);
  // totalClaimsNumber / pager.base

  
  let temp = {
    last: pageNumber,
    start: 2,
    stop: null,
    pointer: 1,
    displayLeft: false,
    displayRight: false,
  }

  if (pageNumber === 0 || pageNumber === 1) return;
  else if (pageNumber > 1 && pageNumber <= pager.stop + 1) temp.stop = pageNumber - 1;
  else {
    temp.stop = pager.stop; 
    temp.displayRight = true;
  }

  let [pageBar, setPageBar] = useState(temp);

  const controlRight = temp => {
    if (temp.displayRight && temp.pointer === temp.stop) {
      temp.start++;
      temp.stop++;
      if (!temp.displayLeft) {
        temp.displayLeft = true;
        temp.start++;
      }
      if (temp.stop === temp.last - 1) {
        temp.displayRight = false;
        temp.start--;
      }
    }
  }

  const controlLeft = temp => {
    if (temp.displayLeft && temp.pointer === temp.start) {
      temp.start--;
      temp.stop--;
      if (!temp.displayRight) {
        temp.displayRight = true;
        temp.stop--;
      }
      if (temp.start === 2) {
        temp.displayLeft = false;
        temp.stop++;
      }
    }
  }

  const incrementPointer = () => {
    let temp = {...pageBar};
    if (temp.pointer < temp.last) temp.pointer++;
    controlRight(temp);
    setPageBar(temp);
  }

  const decrementPointer = () => {
    let temp = {...pageBar};
    if (temp.pointer > 1) temp.pointer--;
    controlLeft(temp);
    setPageBar(temp);
  }

  const choosePage = e => {
    let temp = {...pageBar};
    temp.pointer = +e.target.id;
    controlLeft(temp);
    controlRight(temp);
    setPageBar(temp);
  } 

  const choosePageLight = e => setPageBar(state=>({...state, pointer: +e.target.id}));
  

  const pages = [];
  for (let i = pageBar.start; i <= pageBar.stop; i++) {
    pages.push(
      <div key={i} id={i} className={pageBar.pointer === i ? 'Pager__item Pager__pointer' : 'Pager__item'} onClick={choosePage}>{i}</div>
    );
  }

  return (
    <section className='Pager__bar_wrapper'>
      <div className='Pager__bar'>
        <div className='Pager__item' onClick={decrementPointer}>&lt;</div>
        <div  id={1} 
              className={pageBar.pointer === 1 ? 'Pager__item Pager__pointer' : 'Pager__item'} 
              onClick={choosePageLight}
        >{1}</div>
        {pageBar.displayLeft && <div className='Pager__item1'>...</div>}
        {pages}
        {pageBar.displayRight && <div className='Pager__item1'>...</div>}
        <div  id={pageNumber} 
              className={pageBar.pointer === pageNumber ? 'Pager__item Pager__pointer' : 'Pager__item'} 
              onClick={choosePageLight}
        >{pageNumber}</div>
        <div className='Pager__item' onClick={incrementPointer}>&gt;</div>
      </div>
    </section>
  );
}

export default Pager;

//--------------------------------------------------------

// const incrementPointer = () => {
//   let temp = {...pageBar};
//   if (temp.pointer < temp.last) temp.pointer++;
//   if (temp.displayRight && temp.pointer === temp.stop) {
//     temp.start++;
//     temp.stop++;
//     temp.displayLeft = true;
//     if (temp.stop === temp.last - 1) {
//       temp.displayRight = false;
//     }
//   }

//   setPageBar(temp);
// }