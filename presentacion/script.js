document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.querySelector('.progress-bar');
  const slideNumber = document.querySelector('.slide-number');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  
  let currentSlideIndex = 0;

  function updateSlides() {
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update Progress Bar
    const progressPercent = ((currentSlideIndex) / (slides.length - 1)) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Update Slide Number Indicator
    slideNumber.textContent = `Diapositiva ${currentSlideIndex + 1} de ${slides.length}`;

    // Update Button Disabled States
    btnPrev.disabled = currentSlideIndex === 0;
    btnNext.disabled = currentSlideIndex === slides.length - 1;
  }

  function nextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      currentSlideIndex++;
      updateSlides();
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      updateSlides();
    }
  }

  // Button Click Events
  btnNext.addEventListener('click', nextSlide);
  btnPrev.addEventListener('click', prevSlide);

  // Keyboard Navigation Events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    }
  });

  // Initialize
  updateSlides();
});
