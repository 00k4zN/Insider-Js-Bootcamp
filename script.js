document.addEventListener('DOMContentLoaded', function() {
    const favoriteBtn = document.getElementById('favoriteBtn');
    
    favoriteBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        
        if (this.classList.contains('active')) {
            this.innerHTML = '<i class="fas fa-heart"></i> Favorilerde';
        } else {
            this.innerHTML = '<i class="fas fa-heart"></i> Favorilere Ekle';
        }
    });
}); 