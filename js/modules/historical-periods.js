import { historicalPeriods } from '../data/historical-data.js';
import { timelineEvents } from '../data/timeline-data.js';

// Initialize historical periods
function initializeHistoricalPeriods() {
  const periodsTrack = document.getElementById('periodsTrack');
  if (!periodsTrack) return;

  // Get all unique years from timeline
  const allYears = [...new Set(timelineEvents.map((event) => parseInt(event.year)))].sort((a, b) => a - b);
  const minYear = Math.min(...allYears);
  const maxYear = Math.max(...allYears);
  const totalYears = maxYear - minYear;

  // Create period ranges and markers
  historicalPeriods.forEach((period) => {
    // Calculate position for period range
    const startPos = ((period.startYear - minYear) / totalYears) * 100;
    const endPos = ((period.endYear - minYear) / totalYears) * 100;
    const width = endPos - startPos;

    // Create period range
    const periodRange = document.createElement('div');
    periodRange.className = 'period-range';
    periodRange.style.left = `${startPos}%`;
    periodRange.style.width = `${width}%`;
    periodRange.title = `${period.name}: ${period.startYear}-${period.endYear}\n${period.description}`;
    periodsTrack.appendChild(periodRange);

    // Create period marker (start)
    const periodMarker = document.createElement('div');
    periodMarker.className = 'period-marker';
    periodMarker.style.left = `${startPos}%`;
    periodMarker.innerHTML = `
      <div class="period-dot"></div>
      <div class="period-label">${period.name}</div>
    `;
    periodMarker.title = `${period.name}: ${period.startYear}-${period.endYear}\n${period.description}`;

    periodMarker.addEventListener('click', () => {
      // Find first event in this period
      const firstEventInPeriod = timelineEvents.find(
        (event) =>
          parseInt(event.year) >= period.startYear &&
          parseInt(event.year) <= period.endYear
      );
      if (firstEventInPeriod) {
        if (typeof playSound === 'function') {
          playSound('period', 0.4);
        }
        if (typeof navigateToYear === 'function') {
          navigateToYear(firstEventInPeriod.year);
        }
      }
    });

    periodsTrack.appendChild(periodMarker);
  });
}

// Update active historical period based on current year
function updateActivePeriod(currentYear) {
  const year = parseInt(currentYear);

  // Remove active class from all periods
  document.querySelectorAll('.period-marker, .period-range').forEach((el) => {
    el.classList.remove('active', 'active-period');
  });

  // Find current period
  const currentPeriod = historicalPeriods.find(
    (period) => year >= period.startYear && year <= period.endYear
  );

  if (currentPeriod) {
    // Add active class to current period
    const periodMarkers = document.querySelectorAll('.period-marker');
    const periodRanges = document.querySelectorAll('.period-range');

    periodMarkers.forEach((marker) => {
      if (marker.querySelector('.period-label').textContent === currentPeriod.name) {
        marker.classList.add('active');
      }
    });

    periodRanges.forEach((range) => {
      if (range.title.includes(currentPeriod.name)) {
        range.classList.add('active-period');
      }
    });
  }
}

export { initializeHistoricalPeriods, updateActivePeriod };