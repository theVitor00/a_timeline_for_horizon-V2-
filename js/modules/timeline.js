import { timelineEvents, currentIndex, currentPosition, eventWidth, maxIndex, maxPosition } from '../data/timeline-data.js';

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

  // Create year markers
  const uniqueYears = [...new Set(timelineEvents.map((event) => event.year))].sort();
  uniqueYears.forEach((year, index) => {
    const yearMarker = document.createElement('div');
    yearMarker.className = `year-marker ${index === 0 ? 'active' : ''}`;
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
        const elementIndex = Array.from(timeline.children).indexOf(eventElement);
        playSound('select', 0.3);
        navigateToIndex(elementIndex);
      });
      timeline.appendChild(eventElement);
      totalElements++;
    });
  });

  // Setup navigation
  maxIndex = timeline.children.length - 1;
  maxPosition = maxIndex * eventWidth;

  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) navigateToIndex(currentIndex - 1);
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < maxIndex) navigateToIndex(currentIndex + 1);
  });

  // Initialize first state
  navigateToIndex(0);
  enhanceYearTitles();
}

// Helper functions for timeline
function groupEventsByYear(events) {
  return events.reduce((groups, event) => {
    const year = event.year;
    if (!groups[year]) groups[year] = [];
    groups[year].push(event);
    return groups;
  }, {});
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
          ${event.yearTitleCard ? `<span class="event-month">${event.yearTitleCard}</span>` : ''}
          ${event.month ? `<span class="event-month">${event.month}</span>` : ''}
          ${event.day ? `<span class="event-day">${event.day}</span>` : ''}
        </div>
      </div>
      <p class="event-description">${event.description}</p>
    </div>
  `;
  return eventElement;
}

function enhanceYearTitles() {
  document.querySelectorAll('.year-title').forEach((title) => {
    const decoration = document.createElement('div');
    decoration.className = 'year-decoration';
    title.appendChild(decoration);
  });
}

// Exportar funções públicas
export { 
  initializeTimeline, 
  navigateToIndex, 
  navigateToYear, 
  updateActiveElement, 
  updateYearMarkerFromCurrentIndex,
  updateYearMarker,
  updateButtons 
};