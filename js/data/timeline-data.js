// Timeline data
const timelineEvents = [
  {
    year: '2009',
    yearTitleCard: '2009',
    month: 'Unknown Month',
    day: 'Unknown Day',
    title: "Harriet Choi's birth",
    description: 'Born around 2009, she later in her life became a bioterrorist and member of the Naysay Doom, a death cult that existed in the 21st Century. This group engineered the "Doom Plague" viral cocktail, which was later released in  New York, London, Moscow, Tokyo, and Shanghai in the year 2039, killing millions of people. Following the attack in 2039, many countries outlawed burgeoning research on genetic testing.',
  },
  {
    year: '2013',
    yearTitleCard: '2013',
    month: 'December',
    day: '24th',
    title: "Ted Faro's birth",
    description: "The future reponsible for humanity's doom, Theodor 'Ted' Faro, was born on this date.",
  },
  {
    year: '2017',
    yearTitleCard: '2017',
    month: 'Unknown Month',
    day: 'Unknown Day',
    title: 'Law changes in the US',
    description: "The United States Interior Department decides to remove the grizzly bear species from it's endangered species list.",
  },
  {
    year: '2020',
    yearTitleCard: '2020',
    month: 'March',
    day: '12',
    title: 'Franchise Reboot',
    description: 'Series restart with new graphics engine, maintaining the essence of the original story.',
  },
  {
    year: '2023',
    yearTitleCard: '2023',
    month: 'October',
    day: '27',
    title: 'Multiverse Expansion',
    description: 'Largest expansion ever released, introducing the concept of multiverse and alternate realities.',
  },
];

// Estado global como objeto para ser mutável
const timelineState = {
  currentIndex: 0,
  currentPosition: 0,
  eventWidth: 330,
  maxIndex: 0,
  maxPosition: 0
};

// Funções para acessar e modificar o estado
function getCurrentIndex() {
  return timelineState.currentIndex;
}

function setCurrentIndex(value) {
  timelineState.currentIndex = value;
}

function getMaxIndex() {
  return timelineState.maxIndex;
}

function setMaxIndex(value) {
  timelineState.maxIndex = value;
}

function getCurrentPosition() {
  return timelineState.currentPosition;
}

function setCurrentPosition(value) {
  timelineState.currentPosition = value;
}

function getEventWidth() {
  return timelineState.eventWidth;
}

function getMaxPosition() {
  return timelineState.maxPosition;
}

function setMaxPosition(value) {
  timelineState.maxPosition = value;
}

// Exportar tanto os dados quanto as funções de estado
export { 
  timelineEvents, 
  timelineState,
  getCurrentIndex,
  setCurrentIndex,
  getMaxIndex,
  setMaxIndex,
  getCurrentPosition,
  setCurrentPosition,
  getEventWidth,
  getMaxPosition,
  setMaxPosition
};