const POPUP_MARGIN = 10;

/**
 * find parents by class
 * @param {HTMLElement} element
 * @param {string} classNames
 * @returns {HTMLElement}
 */
const findParents = (element, classNames) => {
  while ((element = element.parentElement) && !element.classList.contains(classNames)) ;
  return element;
};

/**
 * it computes the popup position relative to his parent
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {string} parentClass
 */
const placePopup = (popup, toggler, parentClass = null) => {
  const isFromWindow = parentClass === null;
  const $parent = isFromWindow ? window : this.findParents(popup, parentClass);
  const parentBox = isFromWindow ? {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    width: window.innerWidth,
    height: window.innerHeight,
  } : $parent.getBoundingClientRect();
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();

  // /!\ placement computing here is relative to the parent
  const newPlacement = {
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
  };
  if ((togglerBox.left + (togglerBox.width / 2)) < parentBox.width / 2) {
    if (popupBox.left <= 0) { // if popup is out of parent on left side
      newPlacement.left = (togglerBox.width / 2) + (-popupBox.left + POPUP_MARGIN); // we add to popup propertie the difference
    }
  } else {
    newPlacement.right = (togglerBox.width / 2) - (popupBox.width / 2);
    const outRight = parentBox.right - popupBox.right;
    if (outRight <= 0) {
      newPlacement.right -= outRight - POPUP_MARGIN;
    }
  }

  if ((togglerBox.top + (togglerBox.height / 2)) < parentBox.height / 2) {
    newPlacement.top = togglerBox.height + POPUP_MARGIN;
    if (popupBox.top <= 0) { // if popup is out of parent on top side
      newPlacement.top += (-popupBox.top + POPUP_MARGIN); // we add to popup propertie the difference
    }
  }
  const outBottom = parentBox.bottom - popupBox.bottom;
  if (outBottom <= 0) {
    newPlacement.bottom = togglerBox.height + POPUP_MARGIN;
  }

  popup.style.top = newPlacement.top === 'auto' ? 'auto' : `${newPlacement.top}px`;
  popup.style.left = newPlacement.left === 'auto' ? 'auto' : `${newPlacement.left}px`;
  popup.style.right = newPlacement.right === 'auto' ? 'auto' : `${newPlacement.right}px`;
  popup.style.bottom = newPlacement.bottom === 'auto' ? 'auto' : `${newPlacement.bottom}px`;
};

/**
 * place the popup's arrow
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {HTMLElement} arrow
 */
const placeArrow = (popup, toggler, arrow) => {
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();
  const arrowBox = arrow.getBoundingClientRect();
  let popupBorderWidth = Math.ceil(parseFloat(getComputedStyle(popup).borderWidth));
  popupBorderWidth = popupBorderWidth === 0 ? 2 : popupBorderWidth + 1;

  arrow.style.setProperty('top', 'auto');
  arrow.style.setProperty('left', `${togglerBox.left - popupBox.left + (togglerBox.width / 2) - (arrowBox.width / 2) + popupBorderWidth}px`);
  arrow.style.setProperty('right', 'auto');
  arrow.style.setProperty('bottom', 'auto');

  if (togglerBox.top < popupBox.top) { // bottom of toggler
    arrow.style.setProperty('top', `-${(arrowBox.width / 2) - popupBorderWidth}px`);
  } else { // top of toggler
    arrow.style.setProperty('bottom', `-${(arrowBox.width / 2) - popupBorderWidth}px`);
  }
};

/**
 * initialize the popup placement process
 * @param {HTMLElement} popup
 * @param {HTMLElement} toggler
 * @param {HTMLElement} arrow
 */
export default (popup, toggler, arrow) => {
  const popupBox = popup.getBoundingClientRect();
  const togglerBox = toggler.getBoundingClientRect();
  const style = popup.style;

  style.top = `${togglerBox.height + POPUP_MARGIN}px`;
  style.left = `${togglerBox.width / 2}px`;
  style.right = 'auto';
  style.bottom = 'auto';
  style.marginLeft = `${-popupBox.width / 2}px`;

  popup.style = style;
  placePopup(popup, toggler);
  placeArrow(popup, toggler, arrow);
};