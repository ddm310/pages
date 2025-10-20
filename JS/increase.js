const blocks = document.querySelectorAll('.image-block');

blocks.forEach(block => {
  block.addEventListener('mouseenter', () => {
    block.style.transform = 'scale(1.04)';
  });

  block.addEventListener('mouseleave', () => {
    block.style.transform = 'scale(1)';
  });
});
