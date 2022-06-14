import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { pager } from '../../data/data.js';
import { selectTotalClaimsNumber, fetchClaims, selectToken } from '../../store/slices/claimsSlice.js';
import { selectPagerState, setPagerState } from '../../store/slices/pagerSlice.js';

import './Pager.scss';

function Pager() {

  let pagerState = useSelector(selectPagerState);
  let token = sessionStorage.getItem('token');
  
  let dispatchPagerState = useDispatch();
  let dispatch = useDispatch();

  let pageNumber = Math.ceil(useSelector(selectTotalClaimsNumber) / pager.base);
  
  let offset = null;

  let [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const getWindowWidth = () => setWindowWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener('resize', getWindowWidth);
    return () => window.removeEventListener('resize', getWindowWidth);
  }, []);

  if (windowWidth < 500 && pagerState.offset !== pager.offsetMin) offset = pager.offsetMin;
  else if (windowWidth >= 500 && pagerState.offset !== pager.offsetMax) offset = pager.offsetMax;

  useEffect(() => {
    let temp = {};

    temp.last = pageNumber;
    temp.offset = windowWidth < 500 ? pager.offsetMin : pager.offsetMax;
    temp.pointer = (+sessionStorage.getItem('offset')) / pager.base + 1;
    
    // if (!pagerState.pointer) {
    //   temp.pointer = (+sessionStorage.getItem('offset')) / pager.base + 1;
    //   //debugger
    // }
    // else if (pagerState.pointer > temp.last) {
    //   temp.pointer = temp.last;
    //   //debugger
    // }
    // else {
    //   temp.pointer = pagerState.pointer;
    //   //debugger
    // }
    //debugger
    if (temp.last > 1 && temp.last <= temp.offset + 3) {
      temp.start = 2;
      temp.stop = temp.last - 1;
      temp.displayLeft = false;
      temp.displayRight = false;
    }
    else {
      if (temp.pointer === 1 || temp.pointer === 2) {
        temp.start = 2;
        temp.stop = temp.start + temp.offset;
        temp.displayLeft = false;
        temp.displayRight = true;
        temp.stop--;
      }
      else if (temp.pointer === temp.last || temp.pointer === temp.last - 1) {
        temp.stop = temp.last - 1;
        temp.start = temp.stop - temp.offset;
        temp.displayRight = false;
        temp.displayLeft = true; 
        temp.start++;
      }
      else {
        //debugger
        temp.start = temp.pointer - temp.offset + 1 > 1 ? temp.pointer - temp.offset + 1 : 2;
        temp.stop = temp.start + temp.offset;
        if (temp.stop + 1 !== temp.last) {
          temp.displayRight = true;
          if (temp.pointer - temp.offset + 1 > 1) temp.start++;
          else temp.stop--;
        }
        else temp.displayRight = false;
        if (temp.start - 1 !== 1) {
          temp.displayLeft = true;
          temp.start++;
        }
        else temp.displayLeft = false;
      }
    }
    dispatchPagerState(setPagerState(temp));
  }, [offset, pageNumber]);





  

  

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

    let temp = {...pagerState};
    //let temp = pagerState;
    if (temp.pointer < temp.last) temp.pointer++;
    controlRight(temp);
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  }

  const decrementPointer = () => {
    let temp = {...pagerState};
    // let temp = pagerState;
    if (temp.pointer > 1) temp.pointer--;
    controlLeft(temp);
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  }

  const choosePage = e => {
    let temp = {...pagerState};
    // let temp = pagerState;
    
    temp.pointer = +e.target.id;
    controlLeft(temp);
    controlRight(temp);
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));

  } 

  const chooseExtremePage = e => {
    let temp = {...pagerState};
    // let temp = pagerState;
    temp.pointer = +e.target.id;
    if (temp.pointer === temp.last) {
      temp.stop = temp.last - 1;
      temp.start = temp.stop - temp.offset;
      temp.displayRight = false;
      temp.displayLeft = true; 
      temp.start++;
    }
    if (temp.pointer === 1) {
      temp.start = 2;
      temp.stop = temp.start + temp.offset;
      temp.displayLeft = false;
      temp.displayRight = true;
      temp.stop--;
    }
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  }
  


  const pages = [];
  for (let i = pagerState.start; i <= pagerState.stop; i++) {
    pages.push(
      <div key={i} id={i} className={pagerState.pointer === i ? 'Pager__item Pager__pointer' : 'Pager__item'} onClick={choosePage}>{i}</div>
    );
  }

  if (pageNumber === 0 || pageNumber === 1) return;
  else return (
    <section className='Pager__bar_wrapper' >
      <div className='Pager__bar'>
        <div  className='Pager__item' 
              onClick={decrementPointer}
              style={{visibility: pagerState.pointer !== 1 ? 'visible' : 'hidden'}}
        >&lt;</div>
        <div  id={1} 
              className={pagerState.pointer === 1 ? 'Pager__item Pager__pointer' : 'Pager__item'} 
              onClick={chooseExtremePage}
        >{1}</div>
        {pagerState.displayLeft && <div className='Pager__item1'>...</div>}
        {pages}
        {pagerState.displayRight && <div className='Pager__item1'>...</div>}
        <div  id={pagerState.last} 
              className={pagerState.pointer === pagerState.last ? 'Pager__item Pager__pointer' : 'Pager__item'} 
              onClick={chooseExtremePage}
        >{pagerState.last}</div>
        <div  className='Pager__item' 
              onClick={incrementPointer}
              style={{visibility: pagerState.pointer !== pagerState.last ? 'visible' : 'hidden'}}
        >&gt;</div>
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