class YearTimelineScroll {
  constructor() {
    this.scrollContainer = document.getElementById('yearScrollContainer');
    this.yearMarkers = document.getElementById('yearMarkers');   
    // this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;

    this.init();
  }

  init() {
    if (!this.scrollContainer || !this.yearMarkers) return;

    this.setupEventListeners();

    // Scroll para o ano atual após um breve delay
    setTimeout(() => {
      this.scrollToCurrentYear();
    }, 500);
  }

  setupEventListeners() {
    // Scroll automático ao navegar na timeline
    if (typeof navigateToIndex === 'function') {
      // Sobrescrever a função updateYearMarker para incluir scroll
      this.overrideUpdateYearMarker();
    }

    // Drag para scroll em dispositivos com mouse
    // this.setupDragScroll();    
  }

  overrideUpdateYearMarker() {
    // Guardar a função original
    const originalUpdateYearMarker = window.updateYearMarker;

    // Sobrescrever com scroll automático
    window.updateYearMarker = (year) => {
      // Chamar função original
      if (originalUpdateYearMarker) {
        originalUpdateYearMarker(year);
      }

      // Scroll para o ano
      this.scrollToYear(year);
    };
  }

  // setupDragScroll() {
  //   this.scrollContainer.addEventListener('mousedown', (e) => {
  //     this.isDragging = true;
  //     this.startX = e.pageX - this.scrollContainer.offsetLeft;
  //     this.scrollLeft = this.scrollContainer.scrollLeft;
  //     this.scrollContainer.style.cursor = 'grabbing';
  //     this.scrollContainer.style.userSelect = 'none';
  //   });

  //   document.addEventListener('mousemove', (e) => {
  //     if (!this.isDragging) return;
  //     e.preventDefault();
  //     const x = e.pageX - this.scrollContainer.offsetLeft;
  //     const walk = (x - this.startX) * 2;
  //     this.scrollContainer.scrollLeft = this.scrollLeft - walk;
  //   });

  //   document.addEventListener('mouseup', () => {
  //     this.isDragging = false;
  //     this.scrollContainer.style.cursor = 'grab';
  //     this.scrollContainer.style.userSelect = '';
  //   });

  //   this.scrollContainer.addEventListener('mouseleave', () => {
  //     this.isDragging = false;
  //     this.scrollContainer.style.cursor = 'grab';
  //     this.scrollContainer.style.userSelect = '';
  //   });
  // }

  scrollBy(amount) {
    this.scrollContainer.scrollBy({
      left: amount,
      behavior: 'smooth',
    });
  }

  scrollToYear(year) {
    const yearMarker = document.querySelector(`[data-year="${year}"]`);
    if (!yearMarker) return;

    const container = this.scrollContainer;
    const containerWidth = container.clientWidth;
    const markerLeft = yearMarker.offsetLeft;
    const markerWidth = yearMarker.offsetWidth;

    // Calcular posição para centralizar o marcador
    const targetScroll = markerLeft - containerWidth / 2 + markerWidth / 2;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }

  scrollToCurrentYear() {
    const currentElement = document.querySelector('.year-marker.active');
    if (!currentElement) return;

    const yearLabel = currentElement.querySelector('.year-label');
    if (yearLabel) {
      this.scrollToYear(yearLabel.textContent);
    }
  }

  // Método para adicionar anos dinamicamente (se necessário no futuro)
  addYearMarker(year, isActive = false) {
    const yearMarker = document.createElement('div');
    yearMarker.className = `year-marker ${isActive ? 'active' : ''}`;
    yearMarker.innerHTML = `
      <div class="year-dot"></div>
      <span class="year-label">${year}</span>
    `;
    yearMarker.addEventListener('click', () => {
      if (typeof navigateToYear === 'function') {
        navigateToYear(year);
      }
    });

    this.yearMarkers.appendChild(yearMarker);
  }
}

export default YearTimelineScroll;
