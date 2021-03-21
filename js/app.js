function validateForm(oForm) {
    var email = oForm.elements["email"].value;
    var message = oForm.elements["message"].value;
    var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email) {
        alert("Email harus diisi!");
    }
    else if (!message) {
        alert("Pesan harus diisi!");
    }
    else {
        emailRegExp.test(email) == true ? alert("Pesan berhasil dikirim") : alert("Email tidak valid!");
    }
}