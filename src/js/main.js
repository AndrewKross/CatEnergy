'use strict';

(function () {

  const LEFT_MOUSE_BUTTON = 0;
  const SLIDER_X_MIN = 0;
  const SLIDER_X_MAX = 400;
  const TABLET_WIDTH = 768;

  let beforeBtn = document.querySelector('.example__btn--before');
  let afterBtn = document.querySelector('.example__btn--after');
  let switcher = document.querySelector('.example__switcher');
  let sliderBlock = document.querySelector('.example__slider-block');
  let imgBefore = document.querySelector('.example__picture--before')
  let imgAfter = document.querySelector('.example__picture--after')
  let sliderBackground = document.querySelector('.example__slider-wrapper')

  function switchCats(evt) {
    if (evt.target === beforeBtn) {
      switcher.classList.remove('example__switcher--active');
      switcher.style.left = 0;
      if (screen.width >= TABLET_WIDTH) {
        colorizeBackground(0);
        slideCats(0);
      } else {
        imgBefore.style.display = 'block';
        imgAfter.style.display = 'none';
      }
    } else {
      switcher.classList.add('example__switcher--active');
      switcher.style.left = SLIDER_X_MAX + 'px';
      if (screen.width >= TABLET_WIDTH) {
        colorizeBackground(400);
        slideCats(400);
      } else {
        imgBefore.style.display = 'none';
        imgAfter.style.display = 'block';
      }
    }
  }

  function colorizeBackground(leftOffset) {
    let percent = leftOffset / 4;
    sliderBackground.style.background = `linear-gradient(90deg, rgb(242, 242, 242) 0%,
      rgb(242, 242, 242) ${100 - percent}%,
      rgb(234, 234, 234) ${100 - percent}%,
      rgb(234, 234, 234) 100%)`;
  }

  function slideCats(leftOffset) {
    imgBefore.style.width = 100 - leftOffset / 4 + '%';
    imgAfter.style.width = leftOffset / 4 + '%';
  }

  function dragSlider(evt) {
    if (evt.button === LEFT_MOUSE_BUTTON && screen.width >= TABLET_WIDTH) {
      evt.preventDefault();

      let startCoordsX = evt.clientX;

      let onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        let shiftX = startCoordsX - moveEvt.clientX;
        startCoordsX = moveEvt.clientX;
        let finalCoordsX = switcher.offsetLeft - shiftX;
        let sliderBlockOffsetLeft = sliderBlock.getBoundingClientRect().x;

        if (finalCoordsX >= SLIDER_X_MIN &&
          finalCoordsX <= SLIDER_X_MAX &&
          moveEvt.clientX > sliderBlockOffsetLeft &&
          moveEvt.clientX < sliderBlockOffsetLeft + sliderBlock.offsetWidth) {

          switcher.style.left = finalCoordsX + 'px';
          colorizeBackground(finalCoordsX);
          slideCats(finalCoordsX);
        }
      }

      let onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  }

  beforeBtn.addEventListener('click', switchCats);
  afterBtn.addEventListener('click', switchCats);
  switcher.addEventListener('mousedown', dragSlider);

})();
