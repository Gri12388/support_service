import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { pager } from '../../data/data.js';
import { selectTotalClaimsNumber, fetchClaims, selectToken } from '../../store/slices/claimsSlaice.js';

import './Pager.scss';

function Pager() {

  let token = useSelector(selectToken);
  const dispatch = useDispatch();

  const totalClaimsNumber = useSelector(selectTotalClaimsNumber);
  let [pageNumber] = useState(Math.ceil(totalClaimsNumber / pager.base));
  //let [pageNumber] = useState(8);
  
  let [offset, setOffset] = useState(window.innerWidth < pager.edge ? pager.stopMin : pager.stopMin);

  const onPagerWindowWidthResize = () => {
    if (offset === pager.stopMax && window.innerWidth < pager.edge) setOffset(pager.stopMin);
    else if (offset === pager.stopMin && window.innerWidth >= pager.edge) setOffset(pager.stopMax);
  }
 
  useEffect(()=> {
    window.addEventListener('resize', onPagerWindowWidthResize);
    return () => {
      window.removeEventListener('resize', onPagerWindowWidthResize);
    }
  }, [offset]);

  let temp = {
    offset: offset,
    last: pageNumber,
    start: 2,
    stop: null,
    pointer: 1,
    displayLeft: false,
    displayRight: false,
  }

  if (pageNumber === 0 || pageNumber === 1) return;
  else if (pageNumber > 1 && pageNumber <= offset + 3) temp.stop = pageNumber - 1;
  else {
    temp.stop = temp.start + offset - 1; 
    temp.displayRight = true;
  }

  let [pageBar, setPageBar] = useState(temp);
  
  const resetPageBar = () => {
    let temp = {...pageBar};
    if (pageNumber === 0 || pageNumber === 1) return;
    else if (pageNumber > 1 && pageNumber <= offset + 3) {
      temp.offset = offset;
      temp.last = pageNumber;
      temp.pointer = pageBar.pointer > pageNumber ? pageNumber : pageBar.pointer;
      temp.start = 2;
      temp.stop = pageNumber - 1;
      temp.displayLeft = false;
      temp.displayRight = false;
    }
    else {
      temp.offset = offset;
      temp.last = pageNumber;
      temp.pointer = temp.pointer > pageNumber ? pageNumber : pageBar.pointer;
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
        temp.start = temp.pointer - temp.offset + 1 > 1 ? temp.pointer - offset + 1 : 2;
        temp.stop = temp.start + temp.offset;
        if (temp.start - 1 !== 1) {
          temp.displayLeft = true;
          temp.start++;
        }
        else temp.displayLeft = false;
        if (temp.stop + 1 !== temp.last) {
          temp.displayRight = true;
          temp.stop--;
        }
        else temp.displayRight = false;
      }
    }
    setPageBar(temp);
  }

  if (offset !== pageBar.offset || pageNumber !== pageBar.last) resetPageBar();

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
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  }

  const decrementPointer = () => {
    let temp = {...pageBar};
    if (temp.pointer > 1) temp.pointer--;
    controlLeft(temp);
    setPageBar(temp);
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  }

  const choosePage = e => {
    let temp = {...pageBar};
    temp.pointer = +e.target.id;
    controlLeft(temp);
    controlRight(temp);
    setPageBar(temp);
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  } 

  const chooseExtremePage = e => {
    let temp = {...pageBar};
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
    setPageBar(temp);
    dispatch(fetchClaims({token: token, offset: (temp.pointer - 1) * pager.base, limit: pager.base}));
  }
  


  const pages = [];
  for (let i = pageBar.start; i <= pageBar.stop; i++) {
    pages.push(
      <div key={i} id={i} className={pageBar.pointer === i ? 'Pager__item Pager__pointer' : 'Pager__item'} onClick={choosePage}>{i}</div>
    );
  }

  console.log(offset);

  return (
    <>
      <section className='Pager__bar_wrapper' >
        <div className='Pager__bar'>
          <div  className='Pager__item' 
                onClick={decrementPointer}
                style={{visibility: pageBar.pointer !== 1 ? 'visible' : 'hidden'}}
          >&lt;</div>
          <div  id={1} 
                className={pageBar.pointer === 1 ? 'Pager__item Pager__pointer' : 'Pager__item'} 
                onClick={chooseExtremePage}
          >{1}</div>
          {pageBar.displayLeft && <div className='Pager__item1'>...</div>}
          {pages}
          {pageBar.displayRight && <div className='Pager__item1'>...</div>}
          <div  id={pageNumber} 
                className={pageBar.pointer === pageNumber ? 'Pager__item Pager__pointer' : 'Pager__item'} 
                onClick={chooseExtremePage}
          >{pageNumber}</div>
          <div  className='Pager__item' 
                onClick={incrementPointer}
                style={{visibility: pageBar.pointer !== pageBar.last ? 'visible' : 'hidden'}}
          >&gt;</div>
        </div>
      </section>
    </>
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