import React, { useEffect, useMemo, useState } from 'react';

import '../../assets/styles/common.scss';
import './Sel.scss';

import sprite from '../../assets/images/sprite.svg';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// группы элементов, обслуживающих пользовательский
// элемент 'Select'.                             
//------------------------------------------------------------//
function Sel({ id, label, value, groupId, state, callbacks, placeholder }) {
  
  //------------------------------------------------------------//
  // Извлекаем из sessionStorage объект types, формируем из него
  // массив, фильтруем массив, оставляя лишь те элементы, которые
  // имеют свойство slug, из фильтрата формируем массивообразный
  // объект. Это нужно для того, чтобы недопустить создание 
  // запросов на сервер, в которых тип заявки не будет указан.                             
  //------------------------------------------------------------//
  const types = useMemo (() => {
    const result = {};
    Object.values(JSON.parse(sessionStorage.getItem('types')))
    .filter(item => item.slug)
    .forEach(item => result[item.id] = item);
    return result;
  }, []);



  //------------------------------------------------------------//
  // Устанавливаем длину массивообразного объекта types.                             
  //------------------------------------------------------------//
  const typesLength = useMemo(() => {
    return Object.values(types).length;
  }, []);

  

  //------------------------------------------------------------//
  // Создание локальных состояний: isVisible отвечает за 
  // отображение выпадающего меню; color отвечает за отображение
  // цвета типа заявки; content отвечает за отображение типа
  // заявки; pointed отвечает за номер позиции типа заявки в 
  // выпадающем меню.                                   
  //------------------------------------------------------------//
  const [isVisible, setIsVisible] = useState(false);
  const [color, setColor] = useState(value ? types[value].color : 'transparent');
  const [content, setContent] = useState(value ? types[value].type : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}`);
  const [pointed, setPointed] = useState(null);
  


  //------------------------------------------------------------//
  // Функция, меняющая локальное состояние isVisible на 
  // противоположное.
  //------------------------------------------------------------//
  function toggleVisibility() {
    setIsVisible(!isVisible);
  }



  //------------------------------------------------------------//
  // Обработчик кнопки, выполняющей роль основания для 
  // пользовательского элемента 'Select'.
  //------------------------------------------------------------//
  function onButtonClick(e) {
    e.preventDefault();
    toggleVisibility();  
  }



  //------------------------------------------------------------//
  // Функция, обрабатывающая выбор элемента из выпадающего 
  // списка. Устанавливает нужные значения в локальные состояния
  // color, content, pointed, скрывает выпадающее меню, передает
  // id выбранного типа заявки в вышестоящий компонент.
  //------------------------------------------------------------//
  function chooseItem(e) {
    setPointed(null);
    let temp = +e.currentTarget.dataset.id;
    setColor(types[temp].color);
    setContent(types[temp].type);
    toggleVisibility();
    callbacks.onChange(types[temp].id.toString());
  }



  //------------------------------------------------------------//
  // Функция, обрабатывающая нажатие кнопок и определяющая 
  // реакцию на их нажатие.
  //------------------------------------------------------------//
  function onKeyDown(e) {
    e.preventDefault();
    let temp = pointed;

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
      chooseItem({ currentTarget: { dataset: { id: pointed }}});
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
      temp--;
    }

    // спуститься на пункт ниже
    else if (isVisible && (e.code === 'ArrowDown' || e.key === 'ArrowDown')) {
      temp++;
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
  function configInputWrapperView() {
    if (state && !state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper' 
      };
    };
    if (state && !state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper' 
      };
    };
    if (state && !state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__error' 
      };
    };
    if (state && state.focused && !state.touched) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__focused' 
      };
    };
    if (state && state.focused && state.touched && state.status) {
      return { 
        isWarningShown: false, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__focused' 
      };
    };
    if (state && state.focused && state.touched && !state.status) {
      return { 
        isWarningShown: true, 
        className: 'input_wrapper Sel__base Sel__input_wrapper Sel__focused' 
      };
    }
    else return { 
      isWarningShown: false, 
      className: 'input_wrapper Sel__base Sel__input_wrapper' 
    };
  }



  //------------------------------------------------------------//
  // Функция, определяющая вид элемента выпадающего меню 
  // в зависимости от значения локального состояния pointed.
  //------------------------------------------------------------//
  function configureItemView(id) {
    if (pointed === id) return 'input_wrapper Sel__item Sel__item-pointed';
    else return 'input_wrapper Sel__item';
  }



  //------------------------------------------------------------//
  // Функция, определяющая вид элемента выпадающего меню 
  // в зависимости положения курсора мыши/указателя относительно
  // этого элемента выпадающего меню.
  //------------------------------------------------------------//
  function onPointerEnter(e) {
    setPointed(+e.target.dataset.id);
  }



  //------------------------------------------------------------//
  // Функция, обрабатывающая клик мыши вне элементов 'Sel'
  // компонента. Устанавливается на document в качестве 
  // eventListener.
  //------------------------------------------------------------//
  function onOutClick(e) {
    let temp = e.target.dataset.group;
    if (temp !== groupId) setIsVisible(false);
  }



  //------------------------------------------------------------//
  // Хук, реагирующий на монтирование. Устанавливает функцию
  // onOutClick на элемент document. 
  //------------------------------------------------------------//
  useEffect(() => {
    document.addEventListener('click', onOutClick);
    return () => document.removeEventListener('click', onOutClick);
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
        <div  className='Sel__shell'
              onClick={ chooseItem } 
              onPointerEnter={ onPointerEnter }
              data-id={ item.id } 
              data-group={ groupId }
        />
        <div  className='Sel__select' 
              data-group={ groupId }
        >
          <div  className='Sel__mark-area' 
                data-group={ groupId }
          >
            <div  className='Sel__mark' 
                  style={{ backgroundColor: item.color }} 
                  data-group={ groupId }
            />
            
          </div>
          <p  className='text3' 
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
      {label && <label htmlFor={ id } className='text1 InputText__label'>{ label }</label>}
      <button  className={ configInputWrapperView().className } 
            id={ id }
            onClick={ onButtonClick } 
            onFocus={ callbacks && callbacks.onFocus }
            onBlur={ callbacks.onBlur }
            onKeyDown={ onKeyDown }
            //onClick={ toggleVisibility }
            data-group={groupId}
      >
        <div className='Sel__select'
                // id={ id } 
                // onClick={ onButtonClick } 
                // onFocus={ callbacks && callbacks.onFocus }
                // onBlur={ callbacks.onBlur }
                // onKeyDown={ onKeyDown }
                data-group={ groupId }
        >
          <div  className='Sel__mark-area' 
                style={{ display: value ? 'flex' : 'none' }} 
                data-group={ groupId }
          >
            <div  className='Sel__mark' 
                  style={{ backgroundColor: value ? color : 'transparent' }} 
                  data-group={ groupId }
            ></div>
          </div>
          <p  className='text3' 
              data-group={ groupId }
          >
            { value ? content : placeholder ?? `Select ${(label ?? 'item').toLowerCase()}` }
          </p>
        </div>
        <div  className='Sel__side-area' 
              data-group={ groupId }
        >
          <svg  className={ isVisible ? 'Sel__icon-rotated_svg' : 'Sel__icon_svg' } 
                data-group={ groupId }
          >
            <use  href={ sprite + '#chevron' } 
                  data-group={ groupId }
            ></use>
          </svg>
          
        </div>
        <div  className='Sel__drop' 
              style={{ display: isVisible ? 'block' : 'none' }} 
              data-group={ groupId }
        >
          {options}
        </div>
      </button>
      <p className='text8'>{ configInputWrapperView().isWarningShown && state.error }</p>
    </>
  );
}

export default Sel;