// Prompt() ile kullanıcıdan bilgi alıyoruz.
const isim = prompt('Adınız nedir?');
const yas = parseInt(prompt('Yaşınız kaç?'));
const meslek = prompt('Mesleğiniz nedir?');

// Kullanıcı bilgilerini bir array olarak tuttuk.
const user = { isim, yas, meslek };

console.log('Kullanıcı Bilgileri:', user);

// Sepeti bir array tanımladık
let sepet = [];

// Ürün eklemek için:
function urunEkle() {
    while (true) {
        const urunAdi = prompt('Sepete eklemek istediğiniz ürünü yazın (Çıkış için "q" yazın):');
        if (urunAdi.toLowerCase() === 'q') break;

        let fiyat;
        do {
            fiyat = parseFloat(prompt('Ürünün fiyatı:'));
            if (isNaN(fiyat) || fiyat <= 0) {
                alert("Hatalı fiyat girdiniz. Lütfen geçerli bir fiyat girin.");
            }
        } while (isNaN(fiyat) || fiyat <= 0); // Hatalı girişte prompt tekrar eder

        sepet.push({ product: urunAdi, price: fiyat });
        console.log(`${urunAdi} ürünü sepete eklendi. Fiyat: ${fiyat} TL`);
    }
}

// Toplam fiyat hesabı
function toplamFiyat() {
    const toplam = sepet.reduce((acc, item) => acc + item.price, 0);
    console.log('Toplam Fiyat:', toplam, 'TL');
}

// Ürün çıkarma fonksiyonu
function urunCikar(urunAdi) {
    const index = sepet.findIndex(item => item.product === urunAdi);
    if (index !== -1) {
        sepet.splice(index, 1);
        console.log(`${urunAdi} sepetten çıkarıldı`);
    } else {
        console.log(`${urunAdi} sepette bulunamadı`);
    }
}

// Sepeti göstermek için:
function sepetiGoster() {
    console.log('Sepetiniz:', sepet);
}

function urunIslemleri(islem) {
    switch(islem) {
        case 'ekle':
            urunEkle();
            break;
            
        case 'goster':
            sepetiGoster();
            break;
            
        case 'toplam':
            toplamFiyat();
            break;
            
        case 'cikar':
            const urunAdi = prompt('Çıkarmak istediğiniz ürünün adı:');
            urunCikar(urunAdi);
            break;
            
        default:
            console.log('Geçersiz işlem!');
            break;
    }
}

// Kullanıcıya ürün ekleme imkanı vermek için aşağıdaki fonksiyonu çağırabiliriz.
urunEkle();
sepetiGoster();
toplamFiyat();