const SERVER_URL = "https://server-pr1k.onrender.com";
const GALLERY_KEY = "user_generated_images";

const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const imagePlaceholder = document.getElementById('image-placeholder');
const generatedImage = document.getElementById('generated-image');
const imagePreview = document.querySelector('.image-preview');

let currentImageUrl = null;
let userImages = JSON.parse(localStorage.getItem(GALLERY_KEY)) || [];

updateGallery();

generateBtn.addEventListener('click', generateImage);

async function generateImage() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        alert('Пожалуйста, введите описание изображения');
        return;
    }
    
    showLoading();
    
    try {
        const formData = new FormData();
        formData.append('prompt', prompt);
        
        const response = await fetch(`${SERVER_URL}/generate`, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const imageBlob = await response.blob();
            currentImageUrl = URL.createObjectURL(imageBlob);
            
            // Сохраняем в галерею как base64
            const reader = new FileReader();
            reader.onload = function() {
                const imageData = {
                    id: Date.now(),
                    url: reader.result,
                    prompt: prompt
                };
                
                userImages.unshift(imageData);
                if (userImages.length > 20) {
                    userImages = userImages.slice(0, 20);
                }
                
                localStorage.setItem(GALLERY_KEY, JSON.stringify(userImages));
                updateGallery();
            };
            reader.readAsDataURL(imageBlob);
            
            showSuccess();
        } else {
            throw new Error('Ошибка сервера');
        }
        
    } catch (error) {
        showError(`Ошибка: ${error.message}`);
    } finally {
        hideLoading();
    }
}

function updateGallery() {
    const galleryTrack = document.getElementById('gallery-track');
    if (!galleryTrack) return;
    
    galleryTrack.innerHTML = '';
    const allImages = [...userImages, ...userImages];
    
    allImages.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.prompt;
        img.classList.add('zoom');
        
        galleryItem.appendChild(img);
        galleryTrack.appendChild(galleryItem);
    });
}

function showLoading() {
    generateBtn.disabled = true;
    generateBtn.textContent = 'Генерация...';
    imagePlaceholder.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
            <div style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #8B7355; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p>Генерируем изображение...</p>
        </div>
    `;
    generatedImage.style.display = 'none';
}

function hideLoading() {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Сгенерировать изображение';
}

function showSuccess() {
    generatedImage.src = currentImageUrl;
    generatedImage.style.display = 'block';
    imagePlaceholder.style.display = 'none';
    
    if (!generatedImage.classList.contains('zoom')) {
        generatedImage.classList.add('zoom');
    }
    
    const oldDownloadBtn = document.getElementById('download-btn');
    if (oldDownloadBtn) oldDownloadBtn.remove();
    
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

function showError(message) {
    imagePlaceholder.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e74c3c;">❌ ${message}</p>
        </div>
    `;
}

function downloadImage() {
    if (!currentImageUrl) return;
    
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = 'благоустройство-будущего.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .download-container {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
`;
document.head.appendChild(style);
