import React from 'react';

import '../../assets/styles/common.scss';
import './Slider.scss';

import sliderArchive from '../../assets/images/archive.svg';
import sliderDatabase from '../../assets/images/database.svg';
import sliderDollar from '../../assets/images/dollar.svg';
import sliderGlobe from '../../assets/images/globe.svg';
import sliderHome from '../../assets/images/home.svg';
import sliderNavigation from '../../assets/images/navigation.svg';
import sliderPieChart from '../../assets/images/pie-chart.svg';


function Slider({sliderConfig, functions}) {

  const hideSlider = e => {
    let temp = {...sliderConfig};
    if (e.target.id === 'Slider__modal-area') temp.isVisible = false;
    functions.setSliderConfig(temp);
  }

  const sliderItemsData = [
    {id: 0, image: sliderHome, alt: 'home', content: 'Home'},
    {id: 1, image: sliderGlobe, alt: 'globe', content: 'Services'},
    {id: 2, image: sliderArchive, alt: 'archive', content: 'Storage'},
    {id: 3, image: sliderPieChart, alt: 'piechart', content: 'Charts'},
    {id: 4, image: sliderDollar, alt: 'dollar', content: 'Currency'},
    {id: 5, image: sliderDatabase, alt: 'database', content: 'Base'},
    {id: 6, image: sliderNavigation, alt: 'location', content: 'Locations'},
  ];

  const sliderItems = sliderItemsData.map(item => (
    <div className='Slider__item' key={item.id}>
      <img src={item.image} alt={item.alt} className='Slider__image interactiv' />
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

