import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';

import { pager } from '../../data/data.js';
import { selectTotalClaimsNumber, fetchClaims } from '../../store/slices/claimsSlice.js';
import { selectPagerState, setPagerState } from '../../store/slices/pagerSlice.js';
import { selectCommonState } from '../../store/slices/commonSlice.js';

import './Pager.scss';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// указателя страниц на странице, расположенной по адресу:
// '/base/claims'.                         
//------------------------------------------------------------//
function Pager() {

  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useDispatch();
  const dispatchPagerState = useDispatch();
  const pagerState = useSelector(selectPagerState);
  const { search, sort, column } = useSelector(selectCommonState);
  const pageNumber = Math.ceil(useSelector(selectTotalClaimsNumber) / pager.base);


  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage.                                  
  //------------------------------------------------------------//
  let token = useMemo(() => {
    return sessionStorage.getItem('token');
  }, []);
  


  //------------------------------------------------------------//
  // Переменная, изменение значения которой влияет на один из 
  // хуков useEffect данного компонента.                                  
  //------------------------------------------------------------//
  let offset = null;



  //------------------------------------------------------------//
  // Создание локального состояния windowWidth. Отвечает за 
  // вычисление размера окна устройства, необходимого для 
  // отображения компонента 'Pager'.                                  
  //------------------------------------------------------------//
  let [windowWidth, setWindowWidth] = useState(window.innerWidth);



  //------------------------------------------------------------//
  // Функция, возвращающая размер окна. Прикрепляется к элементу 
  // document в качестве eventListener. 
  //------------------------------------------------------------//
  function getWindowWidth() {
    return setWindowWidth(window.innerWidth);
  }



  //------------------------------------------------------------//
  // Условие, влияющее на значение переменной offset в 
  // зависимости от размера страницы.                       
  //------------------------------------------------------------// 
  if (windowWidth < 500 && pagerState.offset !== pager.offsetMin) offset = pager.offsetMin;
  else if (windowWidth >= 500 && pagerState.offset !== pager.offsetMax) offset = pager.offsetMax;





  //------------------------------------------------------------//
  // Функция, определяющая вид Pager, исходя из текущего 
  // значения pointer, содержащего истребуемый оффсет сервера.                      
  //------------------------------------------------------------// 
  function computePagerState({ last, offset, pointer }) {
    let temp = {
      last: last,
      offset: offset,
      pointer: pointer
    }

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
    return temp;
  }



  //------------------------------------------------------------//
  // Обработчик клика по стрелочке вправо. Загружает набор 
  // заявок с сервера в соответствии с номером текущего оффсета
  // сервера, увеличенного на еденицу.                     
  //------------------------------------------------------------// 
  function incrementPointer() {
    let temp = { ...pagerState };
    if (temp.pointer < temp.last) temp.pointer++;
    temp = computePagerState(temp);
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({
      token: token, 
      offset: (temp.pointer - 1) * pager.base, 
      limit: pager.base, 
      search: search, 
      column: column, 
      sort: sort
    }));
  }



  //------------------------------------------------------------//
  // Обработчик клика по стрелочке влево. Загружает набор 
  // заявок с сервера в соответствии с номером текущего оффсета
  // сервера, уменьшенного на еденицу.                     
  //------------------------------------------------------------// 
  function decrementPointer() {
    let temp = { ...pagerState };
    if (temp.pointer > 1) temp.pointer--;
    temp = computePagerState(temp);
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({
      token: token, 
      offset: (temp.pointer - 1) * pager.base, 
      limit: pager.base, 
      search: search, 
      column: column, 
      sort: sort
    }));
  }



  //------------------------------------------------------------//
  // Обработчик клика по номеру оффсета. Загружает набор 
  // заявок с сервера в соответствии с номером оффсета сервера.                     
  //------------------------------------------------------------//  
  function choosePage(e) {
    let temp = { ...pagerState };
    temp.pointer = +e.target.id;
    temp = computePagerState(temp);
    dispatchPagerState(setPagerState(temp));
    dispatch(fetchClaims({
      token: token, 
      offset: (temp.pointer - 1) * pager.base, 
      limit: pager.base, 
      search: search, 
      column: column, 
      sort: sort
    }));
  } 



  //------------------------------------------------------------//
  // Хук, реагирующий на значение переменных offset и pageNumber. 
  // Запускает функцию computePagerState.                      
  //------------------------------------------------------------//
  useEffect(() => {
    let temp = {};

    temp.last = pageNumber;
    temp.offset = windowWidth < 500 ? pager.offsetMin : pager.offsetMax;
    temp.pointer = (+sessionStorage.getItem('offset')) / pager.base + 1;
    
    temp = computePagerState(temp);
    
    dispatchPagerState(setPagerState(temp));
  }, [offset, pageNumber]);



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Устанавливает функцию
  // getWindowWidth в качестве eventListener.                      
  //------------------------------------------------------------//
  useEffect(() => {
    window.addEventListener('resize', getWindowWidth);
    return () => window.removeEventListener('resize', getWindowWidth);
  }, []);



  //------------------------------------------------------------//
  // Набор номеров оффсетов сервера. Счет начинается с единицы.                     
  //------------------------------------------------------------//
  const pages = [];
  for (let i = pagerState.start; i <= pagerState.stop; i++) {
    pages.push(
      <div key={ i } id={ i } className={ pagerState.pointer === i ? 'Pager__item Pager__pointer' : 'Pager__item' } onClick={ choosePage }>{ i }</div>
    );
  }



  //--------------------------------------------------------------------
  
  if (pageNumber === 0 || pageNumber === 1) return;
  else return (
    <section className='Pager__bar_wrapper' >
      <div className='Pager__bar'>
        <div  className='Pager__item' 
              onClick={decrementPointer}
              style={{ visibility: pagerState.pointer !== 1 ? 'visible' : 'hidden' }}
        >&lt;</div>
        <div  id={ 1 } 
              className={ pagerState.pointer === 1 ? 'Pager__item Pager__pointer' : 'Pager__item' } 
              onClick={ choosePage }
        >{ 1 }</div>
        { pagerState.displayLeft && <div className='Pager__item1'>...</div> }
        { pages }
        { pagerState.displayRight && <div className='Pager__item1'>...</div> }
        <div  id={ pagerState.last } 
              className={ pagerState.pointer === pagerState.last ? 'Pager__item Pager__pointer' : 'Pager__item' } 
              onClick={ choosePage }
        >{ pagerState.last }</div>
        <div  className='Pager__item' 
              onClick={ incrementPointer }
              style={{ visibility: pagerState.pointer !== pagerState.last ? 'visible' : 'hidden' }}
        >&gt;</div>
      </div>
    </section>
  );
}

export default Pager;