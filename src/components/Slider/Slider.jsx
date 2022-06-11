import React from 'react';

import '../../assets/styles/common.scss';
import './Slider.scss';

function Slider({sliderConfig, functions}) {

  const hideSlider = e => {
    let temp = {...sliderConfig};
    if (e.target.id === 'Slider__modal-area') temp.isVisible = false;
    functions.setSliderConfig(temp);
  }

  return (
    <section  className='modal-area1' 
              id='Slider__modal-area'
              style={{visibility: sliderConfig.isVisible ? 'visible' : 'hidden'}}
              onClick={hideSlider}
    >
      <div className={sliderConfig.isVisible ? 'Slider__slider_on' : 'Slider__slider_off'}>

      </div>
    </section>
  );
}

export default Slider;