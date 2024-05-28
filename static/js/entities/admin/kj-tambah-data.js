document.addEventListener('DOMContentLoaded', (event) => {

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
        'use strict'
    
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.needs-validation')
    
        // Loop over them and prevent submission
        Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
    
            form.classList.add('was-validated')
            }, false)
        })
    })()

    const urlParams = new URLSearchParams(window.location.search);
    const encodedResult = urlParams.get('r');
    if (encodedResult) {
        var decodedResult = base64ToDict(encodedResult);

        if (decodedResult) {
            if (decodedResult.status === 200) {
            success(decodedResult.message, 'top-end', 'success');
            } else {
            success(decodedResult.message, 'top-end', 'error');
            }
        } else {
            success('Failed to decode the result.');
        }
        setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 4000);
    }
})