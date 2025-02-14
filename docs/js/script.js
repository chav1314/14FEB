document.addEventListener('DOMContentLoaded', () => {
    /* --- Manejo de Transición entre Pantallas --- */
    const screen1 = document.getElementById('screen1');
    const screen2 = document.getElementById('screen2');
    const screen3 = document.getElementById('screen3');
    const screen4 = document.getElementById('screen4');
    const btnSi = document.getElementById('btnSi');
    const btnNo = document.getElementById('btnNo');
    const buttonContainer = document.getElementById('buttonContainer');
  
    // Lógica para el botón "No": se mueve
    btnNo.addEventListener('mouseover', () => {
      const rect = buttonContainer.getBoundingClientRect();
      const btnWidth = btnNo.offsetWidth;
      const btnHeight = btnNo.offsetHeight;
      const randomX = Math.floor(Math.random() * (rect.width - btnWidth));
      const randomY = Math.floor(Math.random() * (rect.height - btnHeight));
      btnNo.style.left = randomX + 'px';
      btnNo.style.top = randomY + 'px';
    });
    btnNo.addEventListener('click', e => {
      e.preventDefault();
      btnNo.style.left = Math.floor(Math.random() * (buttonContainer.offsetWidth - btnNo.offsetWidth)) + 'px';
      btnNo.style.top = Math.floor(Math.random() * (buttonContainer.offsetHeight - btnNo.offsetHeight)) + 'px';
    });
  
    // Al hacer click en "Sí" (Pantalla 1), pasa a pantalla 2, luego 3
    btnSi.addEventListener('click', () => {
      screen1.classList.remove('active');
      screen2.classList.add('active');
      setTimeout(() => {
        screen2.classList.remove('active');
        screen3.classList.add('active');
        startCarousel();
      }, 3000);
    });
  
    /* --- Carrusel Infinito (Pantalla 3) --- */
    const slidesContainer = document.querySelector('.slides');
    const originalSlides = Array.from(document.querySelectorAll('.slide'));
    const totalOriginal = originalSlides.length; // 8 slides
  
    // Clonar el último slide y agregarlo al inicio
    const lastClone = originalSlides[totalOriginal - 1].cloneNode(true);
    slidesContainer.insertBefore(lastClone, originalSlides[0]);
  
    // Clonar el primer slide y agregarlo al final
    const firstClone = originalSlides[0].cloneNode(true);
    slidesContainer.appendChild(firstClone);
  
    let slides = document.querySelectorAll('.slide');
    let totalSlides = slides.length; // totalOriginal + 2
  
    const slideWidth = 50; // en vw
    const margin = 2;      // en vw
    const totalWidth = slideWidth + 2 * margin; // 54vw
    const offset = 23;     // en vw (50 - (2+25) = 23)
  
    slidesContainer.style.width = (totalSlides * totalWidth) + "vw";
  
    let currentSlide = 1;
    const IMAGE_DURATION = 3000;
    let timer = null;
    let videoEndedListener = null;
    let firstCycleDone = false; // Detectar la primera pasada
  
    function updateTransform(animate = true) {
      slidesContainer.style.transition = animate ? 'transform 0.5s ease' : 'none';
      const translateValue = offset - currentSlide * totalWidth;
      slidesContainer.style.transform = `translateX(${translateValue}vw)`;
    }
  
    function showSlide() {
      slides.forEach(slide => slide.classList.remove('active'));
      const currentSlideElement = slides[currentSlide];
      if (!currentSlideElement.querySelector('video')) {
        currentSlideElement.classList.add('active');
      }
    }
  
    function goToSlide(index) {
      currentSlide = index;
      updateTransform();
      showSlide();
      const currentSlideElement = slides[currentSlide];
      const video = currentSlideElement.querySelector('video');
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (videoEndedListener && video) {
        video.removeEventListener('ended', videoEndedListener);
      }
      if (!video) {
        timer = setTimeout(nextSlide, IMAGE_DURATION);
      } else {
        video.play();
        videoEndedListener = () => {
          nextSlide();
        };
        video.addEventListener('ended', videoEndedListener);
      }
    }
  
    function nextSlide() {
      currentSlide++;
      goToSlide(currentSlide);
    }
  
    // (No hay botón "Anterior" en pantalla, pero la función existe si quisieras usarla)
    function prevSlide() {
      currentSlide--;
      goToSlide(currentSlide);
    }
  
    slidesContainer.addEventListener('transitionend', () => {
      if (currentSlide === totalSlides - 1) {
        // Clon del primer slide
        updateTransform(false);
        currentSlide = 1;
        requestAnimationFrame(() => {
          updateTransform(false);
          requestAnimationFrame(() => {
            slidesContainer.style.transition = 'transform 0.5s ease';
          });
        });
      }
      if (currentSlide === 0) {
        // Clon del último slide
        updateTransform(false);
        currentSlide = totalSlides - 2;
        requestAnimationFrame(() => {
          updateTransform(false);
          requestAnimationFrame(() => {
            slidesContainer.style.transition = 'transform 0.5s ease';
          });
        });
      }
      // Cuando regresa al slide real 1 la primera vez, muestra overlay
      if (currentSlide === 1 && !firstCycleDone) {
        firstCycleDone = true;
        showFinalMessage();
      }
      const currentSlideElement = slides[currentSlide];
      const video = currentSlideElement.querySelector('video');
      if (!video && !timer) {
        timer = setTimeout(nextSlide, IMAGE_DURATION);
      }
    });
  
    function startCarousel() {
      currentSlide = 1;
      goToSlide(currentSlide);
    }
  
    /* Mostrar el overlay final con un solo botón "Sí" */
    const finalOverlay = document.getElementById('finalMessage');
    const finalYes = document.getElementById('finalYes');
  
    function showFinalMessage() {
      finalOverlay.classList.add('visible');
    }
  
    // Al hacer click en "Sí" del overlay final, pasar a la Pantalla 4
    finalYes.addEventListener('click', () => {
      screen3.classList.remove('active');
      screen4.classList.add('active');
    });
  });
  