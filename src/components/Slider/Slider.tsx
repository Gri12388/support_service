import React from 'react';

import c from '../../assets/styles/common.scss';
import s from './Slider.scss';

import sliderSprite from '../../assets/images/sprite.svg';

import type { ISliderConfig, IsliderItemsData } from '../../commonTypes';



//------------------------------------------------------------//
// Компонент отвечает за отображение и функционирование
// слайдера.                            
//------------------------------------------------------------//
function Slider({ sliderConfig, functions } : { sliderConfig : ISliderConfig, functions : { setSliderConfig: React.Dispatch<React.SetStateAction<ISliderConfig>> }}) : JSX.Element {

  //------------------------------------------------------------//
  // Массив объектов, необходимый для воздания группы иконок
  // слайдера.                           
  //------------------------------------------------------------//
  const sliderItemsData : IsliderItemsData[] = [
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
  function hideSlider(e : React.MouseEvent) : void {
    const target : { id? : string } = e.target as { id? : string };
    const temp : ISliderConfig = { ...sliderConfig };
    if (target.id === 'Slider__modal-area') temp.isVisible = false;
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
