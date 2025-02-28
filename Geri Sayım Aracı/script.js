let sayacGosterge = document.getElementById("sayac");
let sayacInput = document.getElementById("sayac_input");
let baslatButton = document.getElementById("baslat_button");
let resetButton = document.getElementById("reset");

let durdur;

function sayac() {
    let saniye = Number(sayacInput.value);
    
    // Geçerli bir değer girilmezse çalıştırma
    if (isNaN(saniye) || saniye <= 0) {
        sayacGosterge.innerText = "Lütfen geçerli bir değer girin";
        return;
    }

    // Önceki sayaç çalışıyorsa durdur
    clearInterval(durdur);

    sayacGosterge.innerText = saniye;
    
    durdur = setInterval(() => {
        if (saniye > 0) {
            saniye--;
            sayacGosterge.innerText = saniye;
        } 
        if (saniye === 0) { // Süre bitince mesaj göster
            clearInterval(durdur);
            sayacGosterge.innerText = "Süre bitti";
        }
    }, 1000);
}

function reset() {
    clearInterval(durdur);
    sayacGosterge.innerText = "0";
    sayacInput.value = "";
}

baslatButton.addEventListener("click", sayac);
resetButton.addEventListener("click", reset);
