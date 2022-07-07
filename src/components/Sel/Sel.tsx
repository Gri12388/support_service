import React, { useEffect, useMemo, useState } from 'react';

import c from '../../assets/styles/common.scss';
import s from './Sel.scss';

import sprite from '../../assets/images/sprite.svg';

import type { IconfigInputWrapperViewReturn, IinputSelCallbacks, IinputElement, Iobj, IobjObj } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// группы элементов, обслуживающих пользовательский
// элемент 'Select'.                             
//------------------------------------------------------------//
function Sel(
  { id, label, value, groupId, state, callbacks, placeholder } : { id : string, label : string, value : string, groupId : string, state : IinputElement, callbacks : IinputSelCallbacks , placeholder : string }) : JSX.Element {
  
  //------------------------------------------------------------//
  // Извлекаем из sessionStorage объект types, формируем из него
  // массив, фильтруем массив, оставляя лишь те элементы, которые
  // имеют свойство slug, из фильтрата формируем массивообразный
  // объект. Это нужно для того, чтобы недопустить создание 
  // запросов на сервер, в которых тип заявки не будет указан.                             
  //------------------------------------------------------------//
  const types : IobjObj = useMemo (() => {
    const result : IobjObj = {} as IobjObj;
    (Object.values(JSON.parse(sessionStorage.getItem('types')!)) as Iobj[])
    .filter((item : Iobj) => item.slug)
    .forEach((item : Iobj) => result[item.id] = item);
    return result;
  }, []);



  //------------------------------------------------------------//
  // Устанавливаем длину массивообразного объекта types.                             
  //------------------------------------------------------------//
  const typesLength : number = useMemo(() => {
    return Object.values(types).length;
  }, []);

  

  //------------------------------------------------------------//
  // Создание локальных состояний: isVisible отвечает за 
  // отображение выпадающего меню; color отвечает за отображение
  // цвета типа заявки; content отвечает за отображение типа
  // заявки; pointed отвечает за номер позиции типа заявки в 
  // выпадающем меню.                                   
  //------------------------------------------------------------//
  const [isVisible, setIsVisible] : [isVisible : boolean, setIsVisible : React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [color, setColor] : [color : string, setColor : React.Dispatch<React.SetStateAction<string>>] = useState(value ? types[value].color : 'transparent');
  const [content, setContent] : [content : string | null, setContent : React.Dispatch<React.SetStateAction<string | null>>] = useState(value ? types[value].type! : placeholder ? `Select ${(label ?? 'item').toLowerCase()}` : null);
  const [pointed, setPointed] : [pointed : number | null, setPointed : React.Dispatch<React.SetStateAction<number | null>>] = useState(null as number | null);
  


  //------------------------------------------------------------//
  // Функция, меняющая локальное состояние isVisible на 
  // противоположное.
  //------------------------------------------------------------//
  function toggleVisibility() : void {
    setIsVisible(!isVisible);
  }



  //------------------------------------------------------------//
  // Обработчик кнопки, выполняющей роль основания для 
  // пользовательского элемента 'Select'.
  //------------------------------------------------------------//
  function onButtonClick(e : React.MouseEvent) : void {
    e.preventDefault();
    toggleVisibility();  
  }



  //------------------------------------------------------------//
  // Функция, обрабатывающая выбор элемента из выпадающего 
  // списка. Устанавливает нужные значения в локальные состояния
  // color, content, pointed, скрывает выпадающее меню, передает
  // id выбранного типа заявки в вышестоящий компонент.
  //------------------------------------------------------------//
  function chooseItem(e : React.MouseEvent | { currentTarget: { dataset: { id: number }}}) : void {
    const currentTarget : { dataset? : { id: string}} = e.currentTarget as { dataset? : { id: string}}
    setPointed(null);
    const temp : number = +currentTarget.dataset!.id;
    setColor(types[temp].color);
    setContent(types[temp].type!);
    toggleVisibility();
    callbacks.onChange(types[temp].id.toString());
  }



  //------------------------------------------------------------//
  // Функция, обрабатывающая нажатие кнопок и определяющая 
  // реакцию на их нажатие.
  //------------------------------------------------------------//
  function onKeyDown(e : React.KeyboardEvent) : void {
    e.preventDefault();
    let temp : number | null = pointed;

    // перейти к другому input
    if (!isVisible && state.content && (e.code === 'Enter' || e.key === 'Enter')) {
      callbacks && callbacks.onPressedEnter && callbacks.onPressedEnter(e);
    }

    // скрыть/открыть выпадающее меню
    else if (!state.content && pointed === null && (e.code === 'Enter' || e.key === 'Enter')) {
      toggleVisibility();
    }

    // выбрать пункт меню
    else if (pointed !== null && (e.code === 'Enter' || e.key === 'Enter')) {
      chooseItem({ currentTarget: { dataset: { id: pointed! }}});
      temp = null;
    }

    // скрыть выпадающее меню
    else if (isVisible && temp === null && (e.code === 'ArrowUp' || e.key === 'ArrowUp')) {
      setIsVisible(false);
    }

    // перейти к первому пункту меню
    else if (isVisible && temp === null && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      temp = 0;
    }

    // скрыть выпадающее меню
    else if (isVisible && temp === 0 && (e.code === 'ArrowUp' || e.key === 'ArrowUp')) {
      temp = null;
      setIsVisible(false);
    }

    // ничего не делать
    else if (isVisible && temp === typesLength - 1 && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
    }

    // подняться на пункт выше
    else if (isVisible && (e.code === 'ArrowUp' || e.key === 'ArrowUp')) {
      temp!--;
    }

    // спуститься на пункт ниже
    else if (isVisible && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      temp!++;
    }

    // открыть выпадающее меню
    else if (!isVisible && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      setIsVisible(true);
    }

    setPointed(temp);
  } 



//------------------------------------------------------------//
  // Функция, определяющая вид 'Sel' компонента в зависимости от
  // фокуса и валидации.
  //------------------------------------------------------------//
  function configInputWrapperView() : IconfigInputWrapperViewReturn {
    if (state && !state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.base} ${s.inputWrapper}` 
      };
    };
    if (state && !state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.base} ${s.inputWrapper}` 
      };
    };
    if (state && !state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: `${c.inputWrapper} ${s.base} ${s.inputWrapper} ${s.error}` 
      };
    };
    if (state && state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.base} ${s.inputWrapper} ${s.focused}`
      };
    };
    if (state && state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: `${c.inputWrapper} ${s.base} ${s.inputWrapper} ${s.focused}` 
      };
    };
    if (state && state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: `${c.inputWrapper} ${s.base} ${s.inputWrapper} ${s.focused}` 
      };
    }
    else return { 
      isWarningShown: false, 
      className: `${c.inputWrapper} ${s.base} ${s.inputWrapper}` 
    };
  }



  //------------------------------------------------------------//
  // Функция, определяющая вид элемента выпадающего меню 
  // в зависимости от значения локального состояния pointed.
  //------------------------------------------------------------//
  function configureItemView(id : number) : string {
    if (pointed === id) return `${c.inputWrapper} ${s.item} ${s.itemPointed}`;
    else return `${c.inputWrapper} ${s.item}`;
  }



  //------------------------------------------------------------//
  // Функция, определяющая вид элемента выпадающего меню 
  // в зависимости положения курсора мыши/указателя относительно
  // этого элемента выпадающего меню.
  //------------------------------------------------------------//
  function onPointerEnter(e : React.PointerEvent) {
    const target : { dataset? : { id : string}} = e.target as { dataset? : { id : string}};
    setPointed(+target.dataset!.id);
  }



  //------------------------------------------------------------//
  // Функция, обрабатывающая клик мыши вне элементов 'Sel'
  // компонента. Устанавливается на document в качестве 
  // eventListener.
  //------------------------------------------------------------//
  function onOutClick(e : MouseEvent) {
    const target : { dataset? : { group : string}} = e.target as { dataset? : { group : string}};
    const temp : string = target.dataset!.group;
    if (temp !== groupId) setIsVisible(false);
  }



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Устанавливает функцию
  // onOutClick на элемент document. 
  //------------------------------------------------------------//
  useEffect(() => {
    const handler : (this: Document, ev: MouseEvent) => any = onOutClick.bind(Document);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);



  //------------------------------------------------------------//
  // Элемент выпадающего меню. 
  //------------------------------------------------------------//
  const options = Object.values(types).map(item => {
    return (
      <div  key={ item.id } 
            className={ configureItemView(item.id) } 
            data-group={ groupId }
      >
        <div  className={ s.shell }
              onClick={ chooseItem } 
              onPointerEnter={ onPointerEnter }
              data-id={ item.id } 
              data-group={ groupId }
        />
        <div  className={ s.select }
              data-group={ groupId }
        >
          <div  className={ s.markArea } 
                data-group={ groupId }
          >
            <div  className={ s.mark } 
                  style={{ backgroundColor: item.color }} 
                  data-group={ groupId }
            />
            
          </div>
          <p  className={ c.text3 } 
              data-group={ groupId }
          >
            { item.type }
          </p>
        </div>
      </div>
    );
  })



  //--------------------------------------------------------------------

  return(
    <>
      {label && <label htmlFor={ id } className={ `${c.text1} ${s.label}` }>{ label }</label>}
      <button  className={ configInputWrapperView().className } 
            id={ id }
            onClick={ onButtonClick } 
            onFocus={ callbacks && callbacks.onFocus }
            onBlur={ callbacks.onBlur }
            onKeyDown={ onKeyDown }
            data-group={groupId}
      >
        <div  className={ s.select }
              data-group={ groupId }
        >
          <div  className={ s.markArea } 
                style={{ display: value ? 'flex' : 'none' }} 
                data-group={ groupId }
          >
            <div  className={ s.mark } 
                  style={{ backgroundColor: value ? color : 'transparent' }} 
                  data-group={ groupId }
            ></div>
          </div>
          <p  className={ c.text3 } 
              data-group={ groupId }
          >
            { value ? content : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}` }
          </p>
        </div>
        <div  className={ s.sideArea } 
              data-group={ groupId }
        >
          <svg  className={ isVisible ? s.iconRotatedSvg : s.iconSvg } 
                data-group={ groupId }
          >
            <use  href={ sprite + '#chevron' } 
                  data-group={ groupId }
            ></use>
          </svg>
          
        </div>
        <div  className={ s.drop } 
              style={{ display: isVisible ? 'block' : 'none' }} 
              data-group={ groupId }
        >
          {options}
        </div>
      </button>
      <p className={ c.text8 }>{ configInputWrapperView().isWarningShown && state.error }</p>
    </>
  );
}

export default Sel;