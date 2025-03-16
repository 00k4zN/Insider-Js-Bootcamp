# Hata Ayıklama (Debugging) Süreci

Bu dokümanda, alışveriş sepeti uygulamasındaki hataları nasıl tespit ettiğimi adım adım anlatıyorum.

## Sistematik Yaklaşım

Kodu incelemeye başlarken benimsediğim süreç:

1. İlk olarak kodun tamamını okuyarak uygulamanın genel yapısını anladım
2. Uygulamanın nasıl çalışması gerektiğini kafamda modelledim
3. Her bir fonksiyonu ayrı ayrı inceleyerek mantık hatalarını aradım
4. Kodun içinde bulunan yorum satırlarına dikkat ettim, "// < yerine <= kullanıldı" gibi ipuçları vardı
5. Kritik işlemleri (stok kontrolü, toplam hesaplama, indirim uygulama) özellikle detaylı inceledim

## Tespit Edilen Hatalar ve Çözüm Süreci

### 1. Hata: Stok Kontrolü Sorunu

**Sorunlu kod:**
```javascript
if (product.stock <= quantity) {
    throw new Error('Yetersiz stok!');
}
```

**Hata bulma süreci:**
- Bu kontrol, tam olarak stok miktarı kadar ürün eklemek istediğimizde hata veriyor
- Mantıken stok miktarı = istenilen miktar durumunda ürün eklenebilmeli
- Ayrıca koddaki "< yerine <=" yorum satırı da bu hatayı işaret ediyordu

**Çözüm:**
- Karşılaştırma operatörünü "<=" yerine "<" olarak değiştirdim

### 2. Hata: Ürün Silme Fonksiyonunda Stok İadesi

**Sorunlu kod:**
```javascript
if (product) {
    product.stock += 1;
}
```

**Hata bulma süreci:**
- Bu kod sepetten bir ürün sildiğimizde stok miktarını her zaman 1 artırıyor
- Oysa sepetten silinen ürünün miktarı (quantity) kadar stok artmalı
- Bu değişken mantığını takip ederek, burada sabit değer kullanıldığını fark ettim
- Daha önceki addItem fonksiyonunda da stok düşürme işlemi eksikti

**Çözüm:**
- Sabit değer 1 yerine item.quantity kullanarak doğru miktarı stoka ekledim
- addItem fonksiyonuna da stok azaltma işlemini ekledim

### 3. Hata: Toplam Hesaplama

**Sorunlu kod:**
```javascript
this.total = this.items.reduce((sum, item) => {
    return sum + item.price;
}, 0);
```

**Hata bulma süreci:**
- Burada toplam hesaplanırken ürün fiyatı ile ürün miktarı çarpılmıyor
- calculateTotal fonksiyonunun mantığını incelediğimde, her bir ürünün toplam değerinin (fiyat * miktar) olması gerektiğini anladım
- Yorum satırında da "quantity çarpımı unutuldu" ipucu vardı

**Çözüm:**
- Toplam hesaplamasına miktar çarpımını ekledim: item.price * item.quantity

### 4. Hata: İndirim Hesaplama

**Sorunlu kod:**
```javascript
if (this.discountApplied && this.total > 0) {
    this.total *= 0.1;
}
```

**Hata bulma süreci:**
- Bu kod %10 indirim uygulamak yerine toplamı %90 azaltıyor (0.1 ile çarparak)
- indirimApplied flag'ini kontrol ettim ve bunun %10 indirim olması gerektiğini anladım
- Kod matematiği üzerinde düşündüğümde, toplamın %10'unu almak yerine kalan %90'ını alması gerektiğini fark ettim

**Çözüm:**
- 0.1 yerine 0.9 ile çarparak doğru indirim hesaplamasını sağladım

### 5. Hata: Hata Mesajlarının Birikmesi

**Sorunlu kod:**
```javascript
showError(message) {
    const errorElement = document.getElementById('error');
    if (errorElement) {
        errorElement.textContent += message + '\n';
    }
}
```

**Hata bulma süreci:**
- İndirim uygula butonuna ard arda basıldığında her seferinde hata mesajı önceki mesajlara ekleniyor
- `+=` operatörü kullanıldığı için mesajlar birikiyor ve ekranda çoğalıyor
- Bu, kullanıcı arayüzünü karmaşık hale getiriyor ve okunabilirliği azaltıyor

**Çözüm:**
- `+=` yerine `=` operatörü kullanarak her seferinde önceki mesajları temizledim
- Ayrıca hata mesajlarını 3 saniye sonra otomatik olarak temizleyen bir setTimeout ekledim

## Sonuç

Bu debugging süreci bana bir kez daha gösterdi ki:

1. Veri akışını adım adım takip etmek hataları bulmada en etkili yöntem
2. Değişkenlerin kullanım mantığı ve matematiksel işlemler özellikle dikkat gerektiriyor
3. Stok gibi önemli değerlerin kontrolünde ve güncellenmesinde ekstra dikkat gerekiyor
4. Kullanıcı arayüzü ile ilgili özelliklerde de hatalar olabilir ve bunlar kullanım deneyimini bozabilir

Debugging sürecimde bu sistematik yaklaşım, tüm hataları tespit etmeme ve çözmeme yardımcı oldu.
