const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const closeModal = document.getElementById("closeModal");

let isAnimating = false;
let currentImage = null;
let startRect = null;

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('zoom')) {
        openZoom(e.target);
    }
});

function openZoom(img) {
    if (isAnimating) return;
    isAnimating = true;
    
    currentImage = img;
    startRect = img.getBoundingClientRect();
    
    document.body.style.overflow = 'hidden';
    
    modalImg.style.position = 'fixed';
    modalImg.style.width = startRect.width + 'px';
    modalImg.style.height = startRect.height + 'px';
    modalImg.style.left = startRect.left + 'px';
    modalImg.style.top = startRect.top + 'px';
    modalImg.style.borderRadius = '5px';
    modalImg.style.objectFit = 'cover';
    
    modalImg.src = img.src;
    modal.style.display = "flex";
    
    modalImg.onload = function() {
        setTimeout(() => {
            modal.classList.add('show');
            
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
            
            modalImg.style.width = targetWidth + 'px';
            modalImg.style.height = targetHeight + 'px';
            modalImg.style.left = targetLeft + 'px';
            modalImg.style.top = targetTop + 'px';
            modalImg.style.objectFit = 'contain';
            
            isAnimating = false;
        }, 10);
    };
    
    if (img.complete) {
        modalImg.onload();
    }
}

function closeZoom() {
    if (!currentImage || !startRect || isAnimating) return;
    
    isAnimating = true;
    modal.classList.remove('show');
    
    modalImg.style.width = startRect.width + 'px';
    modalImg.style.height = startRect.height + 'px';
    modalImg.style.left = startRect.left + 'px';
    modalImg.style.top = startRect.top + 'px';
    modalImg.style.objectFit = 'cover';
    
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = '';
        
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
    if (e.target === modal) {
        closeZoom();
    }
});

closeModal.addEventListener("click", (e) => {
    e.stopPropagation();
    closeZoom();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "flex") {
        closeZoom();
    }
});
