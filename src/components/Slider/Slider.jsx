import React from 'react';

import c from '../../assets/styles/common.scss';
import s from './Slider.scss';

import sliderSprite from '../../assets/images/sprite.svg';


//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// слайдера.                            
//------------------------------------------------------------//
function Slider({ sliderConfig, functions }) {

  //------------------------------------------------------------//
  // Массив объектов, необходимый для воздания группы иконок
  // слайдера.                           
  //------------------------------------------------------------//
  const sliderItemsData = [
    {id: 0, name: 'home', content: 'Home'},
    {id: 1, name: 'globe', content: 'Services'},
    {id: 2, name: 'archive', content: 'Storage'},
    {id: 3, name: 'piechart', content: 'Charts'},
    {id: 4, name: 'dollar', content: 'Currency'},
    {id: 5, name: 'database', content: 'Base'},
    {id: 6, name: 'location', content: 'Locations'},
  ];



  //------------------------------------------------------------//
  // Функция, скрывающая слайдер.                            
  //------------------------------------------------------------//
  function hideSlider(e) {
    let temp = { ...sliderConfig };
    if (e.target.id === 'Slider__modal-area') temp.isVisible = false;
    functions.setSliderConfig(temp);
  }


  //------------------------------------------------------------//
  // Иконки слайдера.                             
  //------------------------------------------------------------//
  const sliderItems = sliderItemsData.map(item => (
    <div className={ s.item } key={ item.id }>
      <svg className={ s.svg }>
        <use href={ sliderSprite + `#${ item.name }` }></use>
      </svg>
      <p className={ `${c.text10} ${c.interactiv} ${s.text}` }>{ item.content }</p>
    </div>
  ));


  
  //--------------------------------------------------------------------

  return (
    <section  className={ c.modalArea1 } 
              id='Slider__modal-area'
              style={{ visibility: sliderConfig.isVisible ? 'visible' : 'hidden' }}
              onClick={ hideSlider }
    >
      <div className={ sliderConfig.isVisible ? `${s.sliderOn}` : `${s.sliderOff}` }>
        { sliderItems }
      </div>
    </section>
  );
}

export default Slider;
