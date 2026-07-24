/**
 * DESARROLLO ORGANIZACIONAL - PRESENTACIÓN INTERACTIVA
 * Slide Engine, Keyboard Navigation, Grid Modal & Interactive Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentSlideIndex = 0;

  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnOverview = document.getElementById('btn-overview');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const btnCloseModal = document.getElementById('btn-close-modal');

  const currentSlideNumEl = document.getElementById('current-slide-num');
  const totalSlidesNumEl = document.getElementById('total-slides-num');
  const progressBar = document.getElementById('progress-bar');

  const modalOverview = document.getElementById('modal-overview');
  const gridThumbnails = document.getElementById('grid-thumbnails');

  // Slide Titles for Modal Overview
  const slideTitles = [
    "Carátula Institucional",
    "Conociendo la Empresa",
    "Diagnóstico Interno",
    "Problema Principal #1",
    "Causas del Problema",
    "Consecuencias",
    "Cultura & Liderazgo",
    "Propuesta de Mejora",
    "Las 5 Acciones",
    "Responsables",
    "Recursos Necesarios",
    "Cronograma, Indicadores y Riesgos",
    "Conclusiones y Recomendaciones"
  ];

  // Initialize Header Count
  if (totalSlidesNumEl) {
    totalSlidesNumEl.textContent = String(totalSlides).padStart(2, '0');
  }

  // Generate Overview Thumbnails
  function generateThumbnails() {
    gridThumbnails.innerHTML = '';
    slideTitles.forEach((title, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-card ${idx === currentSlideIndex ? 'active' : ''}`;
      thumb.innerHTML = `
        <div class="thumb-num">${String(idx + 1).padStart(2, '0')}</div>
        <div class="thumb-title">${title}</div>
      `;
      thumb.addEventListener('click', () => {
        goToSlide(idx);
        closeOverviewModal();
      });
      gridThumbnails.appendChild(thumb);
    });
  }

  // Update Slide State
  function updateSlideState() {
    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Counter & Progress
    if (currentSlideNumEl) {
      currentSlideNumEl.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
    if (progressBar) {
      progressBar.style.width = `${progressPercent}%`;
    }

    // Update Nav Buttons
    if (btnPrev) btnPrev.disabled = currentSlideIndex === 0;
    if (btnNext) btnNext.disabled = currentSlideIndex === totalSlides - 1;
  }

  // Navigation Logic
  function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
      currentSlideIndex = index;
      updateSlideState();
    }
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  // Event Listeners for Nav Buttons
  if (btnNext) btnNext.addEventListener('click', nextSlide);
  if (btnPrev) btnPrev.addEventListener('click', prevSlide);

  // Modal Controls
  function openOverviewModal() {
    generateThumbnails();
    modalOverview.classList.add('active');
  }

  function closeOverviewModal() {
    modalOverview.classList.remove('active');
  }

  if (btnOverview) btnOverview.addEventListener('click', openOverviewModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeOverviewModal);

  modalOverview.addEventListener('click', (e) => {
    if (e.target === modalOverview) {
      closeOverviewModal();
    }
  });

  // Fullscreen Toggle
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    if (modalOverview.classList.contains('active')) {
      if (e.key === 'Escape') closeOverviewModal();
      return;
    }

    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case 'PageDown':
        nextSlide();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        prevSlide();
        break;
      case 'Home':
        goToSlide(0);
        break;
      case 'End':
        goToSlide(totalSlides - 1);
        break;
      case 'o':
      case 'O':
        openOverviewModal();
        break;
    }
  });

  // Accordion Interactivity (Slide 9)
  const actionCards = document.querySelectorAll('.action-card');
  actionCards.forEach(card => {
    card.addEventListener('click', () => {
      const isAlreadyActive = card.classList.contains('active');
      actionCards.forEach(c => c.classList.remove('active'));
      if (!isAlreadyActive) {
        card.classList.add('active');
      }
    });
  });

  // Touch Swipe Gesture Support
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, false);

  document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, false);

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Initial State Setup
  updateSlideState();
});
