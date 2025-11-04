//vertical
export function repositionSpheresVerticallyWithCustomOffset({
    offsetForEvent = 0,
    offsetForYear = 0
  } = {}) {
    const timelineLine = document.querySelector('.timeline-line');
    if (!timelineLine) return;
  
    const rect = timelineLine.getBoundingClientRect();
    let centerY = rect.top + rect.height / 2;
  
    const activeEvent = document.querySelector('.timeline-event.active');
    const activeYear = document.querySelector('.year-title.active-year');
  
    // Prioridade para evento ativo
    if (activeEvent) {
      centerY += offsetForEvent;
    } else if (activeYear) {
      centerY += offsetForYear;
    }
  
    const screenHeight = window.innerHeight;
    const topVH = (centerY / screenHeight) * 100;
  
    const spheres = document.querySelectorAll(
      '.sphere-3d-s1, .sphere-3d-s2, .sphere-3d-s3, .sphere-3d-s4, .sphere-3d-s5'
    );
  
    spheres.forEach(sphere => {
      sphere.style.top = `${topVH}vh`;
    });
  }

//horizontal
export function getSphereCenterX(selector) {
  const element = document.querySelector(selector);
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return rect.left + rect.width / 2;
}

export function repositionSpheres() {
  const referenceSelector = '.sphere-3d-s1'; // Esfera central
  const referenceX = getSphereCenterX(referenceSelector);
  const screenWidth = window.innerWidth;

  if (!referenceX) return;

  const relativeDistances = {
    //distância horizontal fixa em pixels
    //Distância da esfera 2 em relação a esfera central
    '.sphere-3d-s2': 485,
    //Distância da esfera 3 em relação a esfera central
    '.sphere-3d-s3': -250,
    //Distância da esfera 4 em relação a esfera central
    '.sphere-3d-s4': 820,
    //Distância da esfera 5 em relação a esfera central
    '.sphere-3d-s5': -610,
  };

  Object.entries(relativeDistances).forEach(([selector, offsetPx]) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const newX = referenceX + offsetPx;
    const newRightVW = ((screenWidth - newX) / screenWidth) * 100;

    element.style.right = `${newRightVW}vw`;
  });
}
