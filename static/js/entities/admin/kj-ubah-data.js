document.addEventListener('DOMContentLoaded', (event) => {
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
    })();
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
            success('Failed to decode the result.', top-end, 'error');
        }
        setTimeout(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
        }, 4000);
    } 

    // Ambil elemen-elemen dropdown yang diperlukan
    var jenjangKelasDropdown = document.getElementById('jenjang-kelas');
    var programKeahlianDropdown = document.getElementById('program-keahlian');
    var kelasDropdown = document.getElementById('kelas');

    // Tambahkan event listener untuk mendeteksi perubahan pada dropdown jenjang kelas dan program keahlian
    jenjangKelasDropdown.addEventListener('change', updateKelasDropdownStatus);
    programKeahlianDropdown.addEventListener('change', updateKelasDropdownStatus);

    // Fungsi untuk mengupdate status dropdown kelas
    function updateKelasDropdownStatus() {
      // Ambil nilai yang dipilih pada dropdown jenjang kelas dan program keahlian
        var selectedJenjangKelas = jenjangKelasDropdown.value;
        var selectedProgramKeahlian = programKeahlianDropdown.value;

        // Cek apakah salah satu atau kedua dropdown dipilih sebagai 'Semua'
        if (selectedJenjangKelas === 'Semua' || selectedProgramKeahlian === 'Semua') {
            // Nonaktifkan dropdown kelas
            kelasDropdown.disabled = true;
            kelasDropdown.value = 'Semua'
        } else {
            // Aktifkan dropdown kelas
            kelasDropdown.disabled = false;
        }
    }

    updateKelasDropdownStatus()
})