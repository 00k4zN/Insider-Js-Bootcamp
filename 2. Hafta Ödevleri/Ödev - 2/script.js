function sayiZinciriHesapla(sayi) {
    let dizi = [sayi];
    while (sayi !== 1) {
        // Çift sayıysa 2'ye böl
        if (sayi % 2 === 0) {
            sayi = sayi / 2;
        } 
        // Tek sayıysa 3 ile çarp ve 1 ekle
        else {
            sayi = 3 * sayi + 1;
        }
        dizi.push(sayi);
    }
    return dizi;
}

// Belirtilen limite kadar olan sayılar arasında
// en uzun zinciri oluşturan sayıyı bulmak için:
function enUzunZinciriBul(limit) {
    let maksimumUzunluk = 0;
    let enUzunZinciriOlusturanSayi = 0;
    
    // 1'den limite kadar olan her sayı için zinciri kontrol et
    for (let i = 1; i < limit; i++) {
        const zincirUzunlugu = sayiZinciriHesapla(i).length;
        // Şu ana kadar bulunan en uzun zincirden daha uzun sayı varsa güncelle
        if (zincirUzunlugu > maksimumUzunluk) {
            maksimumUzunluk = zincirUzunlugu;
            enUzunZinciriOlusturanSayi = i;
        }
    }
    
    // Bulunan en uzun zincir
    return {
        sayi: enUzunZinciriOlusturanSayi,
        uzunluk: maksimumUzunluk,
        zincir: sayiZinciriHesapla(enUzunZinciriOlusturanSayi)
    };
}

// 1 milyondan küçük sayılar arasında en uzun zincir
const sonuc = enUzunZinciriBul(1000000);

console.log(`En uzun zinciri oluşturan sayı: ${sonuc.sayi}`);
console.log(`Bu sayının oluşturduğu zincirin uzunluğu: ${sonuc.uzunluk} adım`);

// Geri sayım için:
let countdownInterval;
const timeInput = document.getElementById('timeInput');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const countdownDisplay = document.getElementById('countdown');

startButton.addEventListener('click', startCountdown);
resetButton.addEventListener('click', resetCountdown);

function startCountdown() {
    // Eğer halihazırda bir geri sayım çalışıyorsa, onu durdur
    clearInterval(countdownInterval);
    
    // Input'tan değeri al
    let time = parseInt(timeInput.value);
    
    // Geçerli bir sayı değilse veya negatifse işlemi durdur
    if (!time || time < 0) {
        alert('Lütfen geçerli bir sayı giriniz!');
        return;
    }
    
    // Başlangıç değerini göster
    countdownDisplay.textContent = time;
    
    // Her saniye çalışacak interval'i başlat
    countdownInterval = setInterval(() => {
        time--;
        
        // Geri sayımı göster
        countdownDisplay.textContent = time;
        
        // Süre dolduğunda
        if (time <= 0) {
            clearInterval(countdownInterval);
            alert('Süre doldu!');
            timeInput.value = '';
        }
    }, 1000);
    
    // Başlat butonunun metnini değiştir
    startButton.textContent = 'Durdur';
    
    // Butona tıklandığında artık durdurma fonksiyonunu çağır
    startButton.removeEventListener('click', startCountdown);
    startButton.addEventListener('click', stopCountdown);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    
    // Butonu eski haline getir
    startButton.textContent = 'Başlat';
    startButton.removeEventListener('click', stopCountdown);
    startButton.addEventListener('click', startCountdown);
}

function resetCountdown() {
    // Interval'i temizle
    clearInterval(countdownInterval);
    
    // Değerleri sıfırla
    timeInput.value = '';
    countdownDisplay.textContent = '0';
    
    // Butonu başlangıç durumuna getir
    startButton.textContent = 'Başlat';
    startButton.removeEventListener('click', stopCountdown);
    startButton.addEventListener('click', startCountdown);
}