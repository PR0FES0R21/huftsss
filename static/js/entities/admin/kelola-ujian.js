document.addEventListener('DOMContentLoaded', () => {

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

    const columns = [
        { data: "nama_ujian" },
        { data: "jenis_ujian" },
        { data: "program_keahlian" },
        { data: "jenjang_kelas" },
        { data: "mata_pelajaran" },
        { data: "tanggal_dibuat" },
        { data: "pembuat" },
    ]
    callback = {
        cb1: playButton,
        cb2: analitikButtonP,
    }
    datatables(columns, 'ujian', '/api/get/data/ujian', false, settingsButton, editButton, deleteButton, false, false, callback)

    const batalkanHapusData = document.getElementById('batalkan-hapus-data');
    batalkanHapusData.addEventListener('click', () => {
        closeAlert();
    })

    // belum fix
    const tombolHapusDataA = document.getElementById('hapus-data-ujian-a')
    tombolHapusDataA.addEventListener('click', () => {
        showAlert('input');
    })
    const confirmasiHapusDataA = document.getElementById('confirmasi-hapus-data-a')
    confirmasiHapusDataA.addEventListener('click', () => {
        confirmasiHapusDataA.disabled = true;
        confirmasiHapusDataA.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        const password = document.getElementById('security-password-confirmasi')
        $.ajax({
            url: '/api/delete_all/ujian',
            type: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                password: password.value
            },
            success: response => {
                if (response.status === 200) {
                    set_count_data('/api/get/count/ujian', '#exam_count_data')
                    $('#table-data').DataTable().ajax.reload();
                    success(response.message);
                    closeAlert();
                } else {
                    success(response.message, 'center', 'error');
                }
                password.value = '';
                confirmasiHapusDataA.disabled = false;
                confirmasiHapusDataA.innerHTML = 'Konfirmasi'
            }
        })
    })
    const cancleHapusDataA = document.getElementById('batalkan-hapus-data-a')
    cancleHapusDataA.addEventListener('click', () => {
        closeAlert();
    })

    // filter data tables
    const tombolFilter = document.getElementById('tombol-filter')
    tombolFilter.addEventListener('click', () => {
        toggleBox();
    })
    const selectKelas = document.getElementById("select-kelas");
    selectKelas.addEventListener('change', () => {
        filter();
    })
    const applyButton = document.getElementById("apply-button");
    applyButton.addEventListener('click', () => {
        applyFilter();
    })
    
    function handleMulaiUjian(event) {
        const button = event.currentTarget;
        const id = button.getAttribute('data-id');
        getData(id, 'soal')
        .then(data => {
            success(`Ujian ${data.namau} Dimulai`, 'top-right')
            button.removeEventListener('click', handleMulaiUjian);
            button.classList.remove('btn-secondary', 'tombol-mulai-ujian');
            button.classList.add('btn-info');
            button.innerHTML = `
            <div class="loader">
                <i class="fa-solid fa-spinner"></i>
            </div>`

            setTimeout(() => {
                button.classList.remove('btn-info')
                button.classList.add('btn-success', 'lihat-hasil-ujian')
                button.innerHTML = `<i class="fa-solid fa-chart-column"></i>`
                button.setAttribute('onclick', `window.location.href = '/lihat/hasil/ujian?id=${id}'`);
            }, 3000)
        })
        .catch(error => {
            success(error, 'top-right', 'error')
        })
    }

    const tombolMulaiUjian = document.querySelectorAll('.tombol-mulai-ujian')
    tombolMulaiUjian.forEach(button => {
        button.addEventListener('click', handleMulaiUjian);
    });
})

const set_update = (id) => {
    window.location.href = `/admin/kelola_ujian/ubah_data?id=${id}`
}
const delete_data = (id) => {
    showAlert();

    const confirmasiHapusData = document.getElementById('confirmasi-hapus-data');
    confirmasiHapusData.addEventListener('click', function a(event) {
        confirmasiHapusData.disabled = true;
        confirmasiHapusData.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        $.ajax({
            url: '/api/delete/ujian',
            type: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                id: id
            },
            success: response => {
                if (response.status === 200) {
                    set_count_data('/api/get/count/ujian', '#exam_count_data')
                    $('#table-data').DataTable().ajax.reload();
                    success(response.message);
                } else {
                    success(response.message, 'center', 'error');
                }
                closeAlert();
                confirmasiHapusData.disabled = false;
                confirmasiHapusData.innerHTML = 'Konfirmasi'
            }
        })
        confirmasiHapusData.removeEventListener('click', a);
    })
}

const setting_data = (id) => {
    window.location.href = `/admin/kelola_ujian/kelola_soal?id=${id}`
}

const play_data = (id) => {

    $.ajax({
        url: `/api/ujian/set_active`,
        type: 'GET',
        beforeSend: xhr => {
            xhr.setRequestHeader('X-CSRFToken', csrf_token)
        },
        data: {
            id: id
        },
        success: response => {
            if (response.status === 200) {
                console.log('oke');
                success(response.message);
                $('#table-data').DataTable().ajax.reload();
            } else {
                success(response.message, 'center', 'error');
            }
        }
    })
}