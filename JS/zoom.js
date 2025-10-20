const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("closeModal");
const zoomables = document.querySelectorAll(".zoom");

let currentImage = null;
let startRect = null;
let isAnimating = false;

zoomables.forEach(img => {
  img.addEventListener("click", function(e) {
    if (isAnimating) return;
    isAnimating = true;
    
    currentImage = this;
    startRect = this.getBoundingClientRect();
    
    // Блокируем скролл
    document.body.style.overflow = 'hidden';
    
    // Устанавливаем начальную позицию
    modalImg.style.position = 'fixed';
    modalImg.style.width = startRect.width + 'px';
    modalImg.style.height = startRect.height + 'px';
    modalImg.style.left = startRect.left + 'px';
    modalImg.style.top = startRect.top + 'px';
    modalImg.style.borderRadius = '5px';
    modalImg.style.objectFit = 'cover';
    modalImg.style.transform = 'none';
    
    modalImg.src = this.src;
    modal.style.display = "flex";
    
    // Ждем загрузки изображения
    modalImg.onload = function() {
      setTimeout(() => {
        modal.classList.add('show');
        
        // Рассчитываем конечную позицию
        const imgAspectRatio = this.naturalWidth / this.naturalHeight;
        const maxWidth = window.innerWidth * 0.9;
        const maxHeight = window.innerHeight * 0.9;
        
        let targetWidth = this.naturalWidth;
        let targetHeight = this.naturalHeight;
        
        if (targetWidth > maxWidth) {
          targetWidth = maxWidth;
          targetHeight = targetWidth / imgAspectRatio;
        }
        
        if (targetHeight > maxHeight) {
          targetHeight = maxHeight;
          targetWidth = targetHeight * imgAspectRatio;
        }
        
        const targetLeft = (window.innerWidth - targetWidth) / 2;
        const targetTop = (window.innerHeight - targetHeight) / 2;
        
        // Применяем конечные стили
        modalImg.style.width = targetWidth + 'px';
        modalImg.style.height = targetHeight + 'px';
        modalImg.style.left = targetLeft + 'px';
        modalImg.style.top = targetTop + 'px';
        modalImg.style.objectFit = 'contain';
        
        isAnimating = false;
      }, 10);
    };
    
    // Если изображение уже загружено
    if (this.complete) {
      modalImg.onload();
    }
  });
});

function closeModalFunc() {
  if (!currentImage || !startRect || isAnimating) return;
  
  isAnimating = true;
  modal.classList.remove('show');
  
  // Возвращаем картинку на место
  modalImg.style.width = startRect.width + 'px';
  modalImg.style.height = startRect.height + 'px';
  modalImg.style.left = startRect.left + 'px';
  modalImg.style.top = startRect.top + 'px';
  modalImg.style.objectFit = 'cover';
  
  setTimeout(() => {
    modal.style.display = "none";
    document.body.style.overflow = ''; // Разблокируем скролл
    
    // Сбрасываем стили
    modalImg.style.position = '';
    modalImg.style.width = '';
    modalImg.style.height = '';
    modalImg.style.left = '';
    modalImg.style.top = '';
    modalImg.style.objectFit = '';
    modalImg.style.borderRadius = '';
    
    currentImage = null;
    startRect = null;
    isAnimating = false;
  }, 400);
}

modal.addEventListener("click", (e) => {
  if (e.target === modal && !isAnimating) {
    closeModalFunc();
  }
});

closeModal.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!isAnimating) {
    closeModalFunc();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.style.display === "flex" && !isAnimating) {
    closeModalFunc();
  }
});

// Обновляем позицию при ресайзе
window.addEventListener('resize', () => {
  if (currentImage && modal.style.display === "flex" && !isAnimating) {
    // Пересчитываем позицию при изменении размера окна
    const imgAspectRatio = modalImg.naturalWidth / modalImg.naturalHeight;
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;
    
    let targetWidth = modalImg.naturalWidth;
    let targetHeight = modalImg.naturalHeight;
    
    if (targetWidth > maxWidth) {
      targetWidth = maxWidth;
      targetHeight = targetWidth / imgAspectRatio;
    }
    
    if (targetHeight > maxHeight) {
      targetHeight = maxHeight;
      targetWidth = targetHeight * imgAspectRatio;
    }
    
    const targetLeft = (window.innerWidth - targetWidth) / 2;
    const targetTop = (window.innerHeight - targetHeight) / 2;
    
    modalImg.style.width = targetWidth + 'px';
    modalImg.style.height = targetHeight + 'px';
    modalImg.style.left = targetLeft + 'px';
    modalImg.style.top = targetTop + 'px';
  }
});

// Запрещаем скролл при открытом модальном окне
modal.addEventListener('wheel', (e) => {
  e.preventDefault();
}, { passive: false });

modal.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });