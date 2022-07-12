import React, { useEffect, useMemo, useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';

import { messages, pager, setToken } from '../../data/data';
import { selectTotalClaimsNumber, fetchClaims } from '../../store/slices/claimsSlice';
import { selectPagerState, setPagerState } from '../../store/slices/pagerSlice';
import { selectCommonState } from '../../store/slices/commonSlice';

import s from './Pager.scss';

import type { IpagerSliceState } from '../../commonTypes';




//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// указателя страниц на странице, расположенной по адресу:
// '/base/claims'.                         
//------------------------------------------------------------//
function Pager() : JSX.Element | null {

  //------------------------------------------------------------//
  // Подготовка нужных инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const navigate: NavigateFunction = useNavigate();



  //------------------------------------------------------------//
  // Имя компонента.                                 
  //------------------------------------------------------------//
  const componentName = 'Pager';



  //------------------------------------------------------------//
  // Локальное состояние isError отвечает за распознание 
  // появления в коде сгенерированных ошибок.                                 
  //------------------------------------------------------------//
  const [isError, setIsError] : [isError : boolean, setIsError : React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  
  
  
  //------------------------------------------------------------//
  // Подготовка инструментов для взаимодействия с другими
  // страницами, файлами, компонентами и т.д.                                   
  //------------------------------------------------------------//
  const dispatch = useAppDispatch();
  const pagerState = useAppSelector(selectPagerState);
  const { search, sort, column } = useAppSelector(selectCommonState);
  const pageNumber: number = Math.ceil(useAppSelector(selectTotalClaimsNumber) / pager.base);


  //------------------------------------------------------------//
  // Извлечение нужных данных из sessionStorage. Извлечение
  // token из sessionStorage проходит в два этапа: сначала 
  // извлекается закодированный token, потом он раскодируется. 
  // Хук useMemo не используется так как значение  
  // закодированного token всегда должно быть актуальным, в том 
  // числе после получения нового token.                                
  //------------------------------------------------------------//
  const encryptedToken : string | null = sessionStorage.getItem('token');

  const token : string | null = useMemo(() => {
    if (isError) return '';
    if (encryptedToken === null) {
      console.error(`${messages.noToken} at ${componentName} component`);
      setIsError(true);
      return '';
    }
    return setToken(encryptedToken);
  }, [encryptedToken])
  
  const keepLogged : boolean = useMemo(() => {
    return sessionStorage.getItem('keepLogged') === 'true';
  }, []);


  //------------------------------------------------------------//
  // Переменная, изменение значения которой влияет на один из 
  // хуков useEffect данного компонента.                                  
  //------------------------------------------------------------//
  let offset : number  = 0;



  //------------------------------------------------------------//
  // Создание локального состояния windowWidth. Отвечает за 
  // вычисление размера окна устройства, необходимого для 
  // отображения компонента 'Pager'.                                  
  //------------------------------------------------------------//
  const [windowWidth, setWindowWidth] : [windowWidth : number, setWindowWidth : React.Dispatch<React.SetStateAction<number>>] = useState(window.innerWidth);



  //------------------------------------------------------------//
  // Хук, реагирующий на значение переменных offset и pageNumber. 
  // Запускает функцию computePagerState.                      
  //------------------------------------------------------------//
  useEffect(() => {
    if (isError) return;
    let temp : IpagerSliceState = {} as IpagerSliceState;

    temp.last = pageNumber;
    temp.offset = windowWidth < 500 ? pager.offsetMin : pager.offsetMax;
    temp.pointer = (+sessionStorage.getItem('offset')!) / pager.base + 1;
    
    temp = computePagerState(temp)!;

    dispatch(setPagerState(temp));
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
  // Хук, реагирующий на изменение локального состояния isError.
  // Если isError верен, то происходит переход на страницу, 
  // расположенную по адресу '/'.                                 
  //------------------------------------------------------------//
  useEffect(() => {
    if (isError) navigate('/');
  }, [isError]);



  //------------------------------------------------------------//
  // Функция, возвращающая размер окна. Прикрепляется к элементу 
  // document в качестве eventListener. 
  //------------------------------------------------------------//
  function getWindowWidth() : void {
    setWindowWidth(window.innerWidth);
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
  function computePagerState({ last, offset, pointer } : IpagerSliceState) : IpagerSliceState | null {
    if (isError) return null;
    const temp : IpagerSliceState = {
      last: last,
      offset: offset,
      pointer: pointer
    } as IpagerSliceState;

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
  // сервера, увеличенного на еденицу. Однако прежде проверяет,
  // не просрочен ли token. Если просрочен, то проверяет, 
  // нужно ли автоматически его обновить. Если обе проверки 
  // отрицательны, переходит на страницу, расположенную по 
  // адрусу: '/'. Иначе, реализует указанную выше логику.                   
  //------------------------------------------------------------// 
  function incrementPointer() : void {
    if (isError) return;
    if (!token && !keepLogged) {
      navigate('/');
      return;
    }
    let temp : IpagerSliceState = { ...pagerState };
    if (temp.pointer < temp.last) temp.pointer++;
    temp = computePagerState(temp)!;
    dispatch(setPagerState(temp));
    try {
      dispatch(fetchClaims({
        token: token!, 
        offset: (temp.pointer - 1) * pager.base, 
        limit: pager.base, 
        search: search, 
        column: column, 
        sort: sort
      }));
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
    }
  }



  //------------------------------------------------------------//
  // Обработчик клика по стрелочке влево. Загружает набор 
  // заявок с сервера в соответствии с номером текущего оффсета
  // сервера, уменьшенного на еденицу. Однако прежде проверяет,
  // не просрочен ли token. Если просрочен, то проверяет, 
  // нужно ли автоматически его обновить. Если обе проверки 
  // отрицательны, переходит на страницу, расположенную по 
  // адрусу: '/'. Иначе, реализует указанную выше логику.                             
  //------------------------------------------------------------// 
  function decrementPointer() : void {
    if (isError) return;
    if (!token && !keepLogged) {
      navigate('/');
      return;
    }
    let temp : IpagerSliceState = { ...pagerState };
    if (temp.pointer > 1) temp.pointer--;
    temp = computePagerState(temp)!;
    dispatch(setPagerState(temp));
    try {
      dispatch(fetchClaims({
        token: token!, 
        offset: (temp.pointer - 1) * pager.base, 
        limit: pager.base, 
        search: search, 
        column: column, 
        sort: sort
      }));
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
    }
  }



  //------------------------------------------------------------//
  // Обработчик клика по номеру оффсета. Загружает набор 
  // заявок с сервера в соответствии с номером оффсета сервера. 
  // Однако прежде проверяет, не просрочен ли token. Если
  // просрочен, то проверяет, нужно ли автоматически его обновить. 
  // Если обе проверки отрицательны, переходит на страницу, 
  // расположенную по адрусу: '/'. Иначе, реализует указанную 
  // выше логику.                     
  //------------------------------------------------------------//  
  function choosePage(e : React.MouseEvent) : void {
    if (isError) return;
    if (!token && !keepLogged) {
      navigate('/');
      return;
    }
    const target : { id? : string } = e.target as { id? : string };
    let temp : IpagerSliceState = { ...pagerState };
    temp.pointer = +target.id!;
    temp = computePagerState(temp)!;
    dispatch(setPagerState(temp));
    try {
      dispatch(fetchClaims({
        token: token!, 
        offset: (temp.pointer - 1) * pager.base, 
        limit: pager.base, 
        search: search, 
        column: column, 
        sort: sort
      }));
    }
    catch(err : any) {
      console.error(`${err.message} at ${componentName} component`);
      setIsError(true); 
    }
  } 



  //------------------------------------------------------------//
  // Набор номеров оффсетов сервера. Счет начинается с единицы.                     
  //------------------------------------------------------------//
  const pages : JSX.Element[] = [];
  if (!isError) {
    for (let i = pagerState.start; i <= pagerState.stop; i++) {
      pages.push(
        <div key={ i } id={ i.toString() } className={ pagerState.pointer === i ? `${s.item} ${s.pointer}` : s.item } onClick={ choosePage }>{ i }</div>
      );
    }
  }



  if (isError) return null;

  //--------------------------------------------------------------------
  
  if (pageNumber === 0 || pageNumber === 1) return null;
  else return (
    <section className={ s.barWrapper } >
      <div className={ s.bar }>
        <div  className={ s.item } 
              onClick={decrementPointer}
              style={{ visibility: pagerState.pointer !== 1 ? 'visible' : 'hidden' }}
        >&lt;</div>
        <div  id={ 1..toString() } 
              className={ pagerState.pointer === 1 ? `${s.item} ${s.pointer}` : s.item } 
              onClick={ choosePage }
        >{ 1 }</div>
        { pagerState.displayLeft && <div className={ s.item1 }>...</div> }
        { pages }
        { pagerState.displayRight && <div className={ s.item1 }>...</div> }
        <div  id={ pagerState.last.toString() } 
              className={ pagerState.pointer === pagerState.last ? `${s.item} ${s.pointer}` : s.item } 
              onClick={ choosePage }
        >{ pagerState.last }</div>
        <div  className={ s.item } 
              onClick={ incrementPointer }
              style={{ visibility: pagerState.pointer !== pagerState.last ? 'visible' : 'hidden' }}
        >&gt;</div>
      </div>
    </section>
  );
}

export default Pager;