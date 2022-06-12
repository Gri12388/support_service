import React from 'react';

import '../../assets/styles/common.scss';
import './Slider.scss';

import sliderSprite from '../../assets/images/sprite.svg';



function Slider({sliderConfig, functions}) {

  const hideSlider = e => {
    let temp = {...sliderConfig};
    if (e.target.id === 'Slider__modal-area') temp.isVisible = false;
    functions.setSliderConfig(temp);
  }

  const sliderItemsData = [
    {id: 0, name: 'home', content: 'Home'},
    {id: 1, name: 'globe', content: 'Services'},
    {id: 2, name: 'archive', content: 'Storage'},
    {id: 3, name: 'piechart', content: 'Charts'},
    {id: 4, name: 'dollar', content: 'Currency'},
    {id: 5, name: 'database', content: 'Base'},
    {id: 6, name: 'location', content: 'Locations'},
  ];

  const sliderItems = sliderItemsData.map(item => (
    <div className='Slider__item' key={item.id}>
      <svg className="Slider__svg">
        <use href={sliderSprite + `#${item.name}`}></use>
      </svg>
      <p className='text10 interactiv Slider__text'>{item.content}</p>
    </div>
  ));

  return (
    <section  className='modal-area1' 
              id='Slider__modal-area'
              style={{visibility: sliderConfig.isVisible ? 'visible' : 'hidden'}}
              onClick={hideSlider}
    >
      <div className={sliderConfig.isVisible ? 'Slider__slider_on' : 'Slider__slider_off'}>
        {sliderItems}
      </div>
    </section>
  );
}

export default Slider;

// --------------------------------------

// const sliderItems = sliderItemsData.map(item => (
//   <div className='Slider__item' key={item.id}>
//     <img src={item.image} alt={item.alt} className='Slider__image interactiv' />
//     <p className='text10 interactiv Slider__text'>{item.content}</p>
//   </div>
// ));