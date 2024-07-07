
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('show-paswd').addEventListener('click', () => {
        var passwordInput = document.getElementById("password");
        var checkbox = document.getElementById("show-paswd");
        
        if (checkbox.checked) {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    })

    document.getElementById('login-form').addEventListener('submit', event => {
        event.preventDefault();

        // jika username atau passwordnya kosong, maka akan muncul alert
        if($('#username').val() == '' || $('#password').val() == '') {
            alertBs5('warning', 'Silahkan Masukan Username Atau Password');
            return;
        }
        const formData = $('#login-form').serialize();
        $.ajax({
            type: 'POST',
            url: '/auth/login',
            data: formData,
            success: response => {
                if(response.status == 200) {
                    alertBs5('success', response.message);
                    window.location.href = response.redirect + '/dashboard';
                } else if(response.status == 400) {
                    alertBs5('warning', response.message);
                } else if(response.status == 401) {
                    alertBs5('danger', response.message);
                } else {
                    alertBs5('danger', response.message);
                }
            },
            error: (xhr, status, error) => {
                console.log(error);
            }
        });
    });
})