const SERVER_URL = "https://server-pr1k.onrender.com";

const promptInput = document.getElementById('prompt-input');
const generateBtn = document.getElementById('generate-btn');
const imagePlaceholder = document.getElementById('image-placeholder');
const generatedImage = document.getElementById('generated-image');
const imagePreview = document.querySelector('.image-preview');

let currentImageUrl = null;

generateBtn.addEventListener('click', generateImage);
promptInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});

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
            
            if (imageBlob.size === 0) {
                throw new Error('Получен пустой файл изображения');
            }
            
            currentImageUrl = URL.createObjectURL(imageBlob);
            showSuccess();
            
        } else {
            let errorMessage = 'Ошибка сервера';
            try {
                const errorData = await response.json();
                errorMessage = errorData.error || errorMessage;
            } catch (e) {
                errorMessage = `HTTP ошибка: ${response.status}`;
            }
            throw new Error(errorMessage);
        }
        
    } catch (error) {
        console.error('Ошибка генерации:', error);
        showError(`Ошибка: ${error.message}`);
    } finally {
        hideLoading();
    }
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
    imagePreview.classList.remove('has-image');
}

function hideLoading() {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Сгенерировать изображение';
}

function showSuccess() {
    generatedImage.src = currentImageUrl;
    generatedImage.style.display = 'block';
    imagePlaceholder.style.display = 'none';
    imagePreview.classList.add('has-image');
    
    if (!document.getElementById('download-btn')) {
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'download-btn';
        downloadBtn.className = 'btn btn_download';
        downloadBtn.textContent = 'Скачать изображение';
        downloadBtn.style.marginTop = '15px';
        downloadBtn.addEventListener('click', downloadImage);
        
        generatedImage.insertAdjacentElement('afterend', downloadBtn);
    }
}

function showError(message) {
    imagePlaceholder.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p style="color: #e74c3c; margin-bottom: 10px;">❌ ${message}</p>
            <p style="color: #7f8c8d; font-size: 0.9rem;">Попробуйте обновить страницу или повторить позже</p>
        </div>
    `;
    generatedImage.style.display = 'none';
    imagePreview.classList.remove('has-image');
}

function downloadImage() {
    if (!currentImageUrl) {
        alert('Нет изображения для скачивания');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.href = currentImageUrl;
        link.download = 'благоустройство-будущего.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        alert('Ошибка при скачивании файла');
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
