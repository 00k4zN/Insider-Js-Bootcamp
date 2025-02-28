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