/* ==========================================================================
   RIVIERA SPORT JDM - NISSAN SILVIA S15 SPEC-R
   Interactive Logic, Modal Handling, Form Processing & Sakura Animation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements Selection
  const navbar = document.querySelector('.navbar');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const modalOverlay = document.getElementById('testDriveModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');
  const bookingSuccess = document.getElementById('bookingSuccess');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const yearSpan = document.getElementById('year');

  // Set current year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Set minimum date selector to today in form
  const preferredDateInput = document.getElementById('preferredDate');
  if (preferredDateInput) {
    const today = new Date().toISOString().split('T')[0];
    preferredDateInput.min = today;
  }

  // 2. Navbar Backdrop Effect on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // 3. Modal Open & Close Triggers
  const openModal = (source = 'unknown') => {
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent page background scrolling
    console.log(`[ Riviera Sport Conversion ] Modal opened from CTA: ${source}`);
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const source = btn.dataset.source || 'CTA';
      openModal(source);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking on overlay background
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // 4. Form Submission & Confirmation Logic
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(bookingForm);
      const name = formData.get('fullName');
      const phone = formData.get('phone');
      const date = formData.get('preferredDate');
      const timeSlot = formData.get('timeSlot');

      // Map timeSlot value to French readable text
      const slotMap = {
        'matin': 'Matin (09h00 - 12h00)',
        'apres-midi': 'Après-midi (14h00 - 17h00)',
        'fin-journee': 'Fin de journée (17h00 - 19h00)'
      };

      // Format date into readable French format (e.g., 25 Octobre 2025)
      let formattedDate = date;
      if (date) {
        const d = new Date(date);
        formattedDate = d.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }

      // Populate Success State Text
      document.getElementById('successName').textContent = name;

      // Transition Form View -> Success View
      bookingForm.style.display = 'none';
      bookingSuccess.style.display = 'block';
    });
  }

  if (closeSuccessBtn) {
    closeSuccessBtn.addEventListener('click', () => {
      closeModal();

      // Reset Form state for future uses
      setTimeout(() => {
        bookingForm.reset();
        bookingForm.style.display = 'block';
        bookingSuccess.style.display = 'none';
      }, 300);
    });
  }

  // 4b. Gallery Lightbox Handling
  const galleryImgs = document.querySelectorAll('.gallery-img');
  const lightboxModal = document.getElementById('imageLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightboxBtn = document.getElementById('closeLightbox');

  if (lightboxModal && lightboxImg) {
    galleryImgs.forEach(img => {
      img.addEventListener('click', () => {
        const fullSrc = img.getAttribute('data-full') || img.src;
        lightboxImg.src = fullSrc;
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
    };

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // 5. Subtle Sakura Falling Canvas Particle Animation (Soft Pink Petals for Light Backdrop)
  const canvas = document.getElementById('sakura-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Particle class for Sakura Petals
    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height;
        this.size = Math.random() * 5 + 4;
        this.speedY = Math.random() * 0.8 + 0.4;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        this.opacity = Math.random() * 0.4 + 0.25;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.rotation += this.rotationSpeed;

        if (this.y > height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;

        // Draw Soft Sakura Petal Shape
        ctx.beginPath();
        ctx.fillStyle = '#E56B81';
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.5);
        ctx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
        ctx.fill();

        ctx.restore();
      }
    }

    const petalCount = 28;
    const petals = Array.from({ length: petalCount }, () => new Petal());

    function animateSakura() {
      ctx.clearRect(0, 0, width, height);
      petals.forEach(petal => {
        petal.update();
        petal.draw();
      });
      requestAnimationFrame(animateSakura);
    }

    animateSakura();
  }
});
  // ==========================================================================
  // Simulator Logic
  // ==========================================================================
  const carPriceInput = document.getElementById('carPrice');
  const downPaymentInput = document.getElementById('downPayment');
  const durationInput = document.getElementById('duration');
  const downPaymentDisplay = document.getElementById('downPaymentDisplay');
  const durationDisplay = document.getElementById('durationDisplay');
  const monthlyPaymentDisplay = document.getElementById('monthlyPayment');

  if (carPriceInput && downPaymentInput && durationInput) {
    const calculatePayment = () => {
      const price = parseFloat(carPriceInput.value) || 0;
      let downPayment = parseFloat(downPaymentInput.value) || 0;
      const duration = parseInt(durationInput.value, 10) || 48;

      // Prevent down payment from exceeding car price
      if (downPayment > price) {
        downPayment = price;
        downPaymentInput.value = price;
      }

      // Update max attribute dynamically
      downPaymentInput.max = price;

      downPaymentDisplay.textContent = downPayment.toLocaleString('fr-FR');
      durationDisplay.textContent = duration;

      const loanAmount = price - downPayment;
      const annualRate = 0.059; // 5.9% TAEG
      const monthlyRate = annualRate / 12;

      let monthlyPayment = 0;
      if (loanAmount > 0) {
        // Standard amortization formula
        monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -duration));
      }

      monthlyPaymentDisplay.textContent = Math.round(monthlyPayment).toLocaleString('fr-FR');
    };

    carPriceInput.addEventListener('input', calculatePayment);
    downPaymentInput.addEventListener('input', calculatePayment);
    durationInput.addEventListener('input', calculatePayment);

    // Initial calculation
    calculatePayment();
  }

  // ==========================================================================
  // Fiche Technique Modal Logic
  // ==========================================================================
  const specModal = document.getElementById('specModal');
  const closeSpecModalBtn = document.getElementById('closeSpecModalBtn');
  const openSpecBtns = document.querySelectorAll('.open-spec-btn');

  // Modal elements to populate
  const specTitle = document.getElementById('specModalTitle');
  const specMoteur = document.getElementById('specMoteur');
  const specPuissance = document.getElementById('specPuissance');
  const specTransmission = document.getElementById('specTransmission');
  const specEquipements = document.getElementById('specEquipements');

  const openSpecModal = (btn) => {
    // Populate data from attributes
    specTitle.textContent = btn.dataset.title;
    specMoteur.textContent = btn.dataset.moteur;
    specPuissance.textContent = btn.dataset.puissance;
    specTransmission.textContent = btn.dataset.transmission;
    specEquipements.textContent = btn.dataset.equipements;

    // Show modal
    specModal.classList.add('active');
    specModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeSpecModal = () => {
    specModal.classList.remove('active');
    specModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (specModal) {
    openSpecBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSpecModal(btn);
      });
    });

    if (closeSpecModalBtn) {
      closeSpecModalBtn.addEventListener('click', closeSpecModal);
    }

    specModal.addEventListener('click', (e) => {
      if (e.target === specModal) {
        closeSpecModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && specModal.classList.contains('active')) {
        closeSpecModal();
      }
    });
  }
