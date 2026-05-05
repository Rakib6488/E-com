'use strict';

(function () {
    var form = document.getElementById('admin-login-form');
    var message = document.getElementById('admin-login-message');

    if (!form) {
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var adminId = document.getElementById('admin-id').value.trim();
        var password = document.getElementById('admin-password').value;

        if (adminId === 'admin' && password === 'farha123') {
            sessionStorage.setItem('farhaAdminLoggedIn', 'true');
            message.textContent = 'Login successful. Opening dashboard...';
            message.className = 'admin-login__message admin-login__message--success';
            window.setTimeout(function () {
                window.location.href = './admin-dashboard.html';
            }, 500);
            return;
        }

        message.textContent = 'Invalid admin ID or password.';
        message.className = 'admin-login__message admin-login__message--error';
    });
}());
