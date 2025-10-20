window.isAnimating = false;
window.currentImage = null;
window.startRect = null;

function showSuccess() {
    generatedImage.src = currentImageUrl;
    generatedImage.style.display = 'block';
    imagePlaceholder.style.display = 'none';
    imagePreview.classList.add('has-image');
    
    if (!generatedImage.classList.contains('zoom')) {
        generatedImage.classList.add('zoom');
    }
    
    const zoomEvent = new Event('zoomUpdate');
    document.dispatchEvent(zoomEvent);
    
    const oldDownloadBtn = document.getElementById('download-btn');
    if (oldDownloadBtn) {
        oldDownloadBtn.remove();
    }
    
    const downloadBtn = document.createElement('button');
    downloadBtn.id = 'download-btn';
    downloadBtn.className = 'btn';
    downloadBtn.textContent = 'Скачать изображение';
    downloadBtn.addEventListener('click', downloadImage);
    
    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'download-container';
    downloadContainer.appendChild(downloadBtn);
    
    imagePreview.appendChild(downloadContainer);
}

document.addEventListener('zoomUpdate', function() {
    const newZoomables = document.querySelectorAll('.zoom:not(.zoom-initialized)');
    
    newZoomables.forEach(img => {
        img.classList.add('zoom-initialized');
        
        img.addEventListener('click', function(e) {
            if (window.isAnimating) return;
            window.isAnimating = true;
            
            window.currentImage = this;
            window.startRect = this.getBoundingClientRect();
            
            document.body.style.overflow = 'hidden';
            
            const modalImg = document.getElementById('modal-img');
            const modal = document.getElementById('modal');
            
            modalImg.style.position = 'fixed';
            modalImg.style.width = window.startRect.width + 'px';
            modalImg.style.height = window.startRect.height + 'px';
            modalImg.style.left = window.startRect.left + 'px';
            modalImg.style.top = window.startRect.top + 'px';
            modalImg.style.borderRadius = '5px';
            modalImg.style.objectFit = 'cover';
            modalImg.style.transform = 'none';
            
            modalImg.src = this.src;
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
                    
                    window.isAnimating = false;
                }, 10);
            };
            
            if (this.complete) {
                modalImg.onload();
            }
        });
    });
});
