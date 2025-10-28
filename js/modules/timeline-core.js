import {
  timelineEvents,
  getCurrentIndex,
  setCurrentIndex,
  getMaxIndex,
  setMaxIndex,
  getCurrentPosition,
  setCurrentPosition,
  getEventWidth,
  getMaxPosition,
  setMaxPosition,
} from '../data/timeline-data.js';
import { groupEventsByYear } from './utils.js';

// Timeline initialization
function initializeTimeline() {
  const timeline = document.getElementById('timeline');
  const yearMarkers = document.getElementById('yearMarkers');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!timeline || !yearMarkers || !prevBtn || !nextBtn) {
    console.error('Required timeline elements not found');
    return;
  }

  // Create year markers - AGORA COM LAYOUT HORIZONTAL
  const uniqueYears = [
    ...new Set(timelineEvents.map((event) => event.year)),
  ].sort();
  uniqueYears.forEach((year, index) => {
    const yearMarker = document.createElement('div');
    yearMarker.className = `year-marker ${index === 0 ? 'active' : ''}`;
    yearMarker.setAttribute('data-year', year); // Adicionar data attribute
    yearMarker.innerHTML = `
      <div class="year-dot"></div>
      <span class="year-label">${year}</span>
    `;
    yearMarker.addEventListener('click', () => navigateToYear(year));
    yearMarkers.appendChild(yearMarker);
  });

  // Create timeline content
  const eventsByYear = groupEventsByYear(timelineEvents);
  let totalElements = 0;

  Object.keys(eventsByYear).forEach((year) => {
    // Create year title
    const yearTitle = document.createElement('div');
    yearTitle.className = 'year-title';
    yearTitle.textContent = year;
    yearTitle.dataset.year = year;
    timeline.appendChild(yearTitle);
    totalElements++;

    // Add events for this year
    eventsByYear[year].forEach((event) => {
      const eventElement = createEventElement(event, year);
      eventElement.addEventListener('click', () => {
        const elementIndex = Array.from(timeline.children).indexOf(
          eventElement
        );
        if (typeof playSound === 'function') {
          playSound('select', 0.3);
        }
        navigateToIndex(elementIndex);
      });
      timeline.appendChild(eventElement);
      totalElements++;
    });
  });

  // Setup navigation usando as funções de estado
  setMaxIndex(timeline.children.length - 1);
  setMaxPosition(getMaxIndex() * getEventWidth());

  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', () => {
    if (getCurrentIndex() > 0) navigateToIndex(getCurrentIndex() - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (getCurrentIndex() < getMaxIndex())
      navigateToIndex(getCurrentIndex() + 1);
  });

  // Initialize first state
  navigateToIndex(0);
  enhanceYearTitles();
}

function createEventElement(event, year) {
  const eventElement = document.createElement('div');
  eventElement.className = 'timeline-event';
  eventElement.dataset.year = year;

  eventElement.innerHTML = `
    <div class="event-marker"></div>
    <div class="event-content">
      <div class="event-header">
        <div class="event-date">
          <h3 class="event-title">${event.title}</h3>
          ${
            event.yearTitleCard
              ? `<span class="event-month">${event.yearTitleCard}</span>`
              : ''
          }
          ${
            event.month ? `<span class="event-month">${event.month}</span>` : ''
          }
          ${event.day ? `<span class="event-day">${event.day}</span>` : ''}
        </div>
      </div>
      <p class="event-description">${event.description}</p>
    </div>
  `;
  return eventElement;
}

function navigateToIndex(newIndex) {
  const currentMaxIndex = getMaxIndex();
  newIndex = Math.max(0, Math.min(newIndex, currentMaxIndex));
  setCurrentIndex(newIndex);

  const timeline = document.getElementById('timeline');
  const container = document.querySelector('.timeline-container');

  if (!timeline || !container) return;

  const containerWidth = container.offsetWidth;
  console.log({containerWidth});
  const timelineWidth = timeline.scrollWidth;
  console.log({timelineWidth});

//   // Calcula a posição para centralizar o elemento ativo
  let halfScreen = containerWidth / 2;
  console.log({halfScreen});
  let newPosition = halfScreen - getCurrentIndex() * getEventWidth() - ((getEventWidth())/2) - getCurrentIndex() * 32;

  console.log({newPosition});

  setCurrentPosition(newPosition);

  console.log({newIndex})
  //first number = 796
  //second = 436
  //third = 76
  //deslocamento = 360 (metade do elemento + 32 de gap)


  // Aplica a transformação
  timeline.style.transform = `translateX(${getCurrentPosition()}px)`;
  console.log({'getCurrentPosition':getCurrentPosition()});

  if (typeof playSound === 'function') {
    playSound('navigate', 0.2);
  }
  updateActiveElement();
  updateButtons();
  updateYearMarkerFromCurrentIndex();
}

function navigateToYear(targetYear) {
  const yearTitle = document.querySelector(
    `.year-title[data-year="${targetYear}"]`
  );
  if (yearTitle) {
    const elementIndex = Array.from(
      document.getElementById('timeline').children
    ).indexOf(yearTitle);
    navigateToIndex(elementIndex);
  }
  if (typeof playSound === 'function') {
    playSound('select', 0.25);
  }
}

function updateActiveElement() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const currentElement = timeline.children[getCurrentIndex()];
  if (!currentElement) return;

  // Remove active classes
  document.querySelectorAll('.timeline-event, .year-title').forEach((el) => {
    el.classList.remove('active', 'active-year');
  });

  // Add appropriate active class
  if (currentElement.classList.contains('timeline-event')) {
    currentElement.classList.add('active');
    const year = currentElement.dataset.year;
    const yearTitle = document.querySelector(
      `.year-title[data-year="${year}"]`
    );
    if (yearTitle) yearTitle.classList.add('active-year');
  } else if (currentElement.classList.contains('year-title')) {
    currentElement.classList.add('active-year');
  }
}

function updateYearMarkerFromCurrentIndex() {
  const timeline = document.getElementById('timeline');
  if (!timeline) return;

  const currentElement = timeline.children[getCurrentIndex()];
  if (!currentElement) return;

  let year;
  if (currentElement.classList.contains('year-title')) {
    year = currentElement.dataset.year || currentElement.textContent;
  } else if (currentElement.classList.contains('timeline-event')) {
    year = currentElement.dataset.year;
  }

  if (year) updateYearMarker(year);
}

function updateYearMarker(year) {
  document.querySelectorAll('.year-marker').forEach((marker) => {
    const yearLabel = marker.querySelector('.year-label');
    marker.classList.toggle(
      'active',
      yearLabel && yearLabel.textContent === year
    );
  });

  // Update active historical period
  if (typeof updateActivePeriod === 'function') {
    updateActivePeriod(year);
  }
}

function updateButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.disabled = getCurrentIndex() === 0;
  if (nextBtn) nextBtn.disabled = getCurrentIndex() >= getMaxIndex();

  // Atualizar também as setas do carrossel
  if (typeof updateCarouselArrows === 'function') {
    updateCarouselArrows();
  }
}

function enhanceYearTitles() {
  document.querySelectorAll('.year-title').forEach((title) => {
    const decoration = document.createElement('div');
    decoration.className = 'year-decoration';
    title.appendChild(decoration);
  });
}

export {
  initializeTimeline,
  navigateToIndex,
  navigateToYear,
  updateActiveElement,
  updateYearMarkerFromCurrentIndex,
  updateYearMarker,
  updateButtons,
};
