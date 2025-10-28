// Importações de módulos CORRIGIDAS
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
  setMaxPosition
} from './data/timeline-data.js';
import { 
  initializeTimeline, 
  navigateToIndex, 
  navigateToYear, 
  updateActiveElement, 
  updateYearMarkerFromCurrentIndex, 
  updateYearMarker, 
  updateButtons 
} from './modules/timeline-core.js';
import { initializeHistoricalPeriods, updateActivePeriod } from './modules/historical-periods.js';
import { setupKeyboardNavigation, initializeCarouselArrows, updateCarouselArrows, setupResizeHandler } from './modules/navigation.js';
import { initializeSoundSystem, playSound, harmonicMusic, initHarmonicMusicControls, initHarmonicMusic, initCardSounds } from './modules/sound-system.js';
import { initializePopup, /*addDebugButtons*/ } from './modules/popup.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM fully loaded - initializing application');
  initializeApplication();
});

function initializeApplication() {
  // Inicializa o timeline básico
  initializeTimeline();

  // Inicializa períodos históricos
  initializeHistoricalPeriods();

  // navegação por teclado
  setupKeyboardNavigation();

  // Inicializa as setas do carrossel - DEPOIS do timeline estar pronto
  initializeCarouselArrows();

  // Inicializa sistema de sons
  initializeSoundSystem();

  // Configurar handler de redimensionamento
  setupResizeHandler();

  // Inicializar sons de cards
  initCardSounds();

  // Por último o popup
  initializePopup();

  // Inicializar controles de música
  initHarmonicMusicControls();
  initHarmonicMusic();

  // Apenas para desenvolvimento
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    addDebugButtons();
  }
}

// Make functions globally available if needed
window.navigateToIndex = navigateToIndex;
window.navigateToYear = navigateToYear;
window.playSound = playSound;
window.harmonicMusic = harmonicMusic;
window.updateActivePeriod = updateActivePeriod;
window.updateCarouselArrows = updateCarouselArrows;

// Exportar para uso em outros módulos
export { 
  navigateToIndex, 
  navigateToYear, 
  playSound, 
  updateActivePeriod, 
  updateCarouselArrows,
  getCurrentIndex,
  getMaxIndex
};