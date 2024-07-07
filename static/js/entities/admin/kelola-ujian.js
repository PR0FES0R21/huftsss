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
})

const set_update = (id) => {
    window.location.href = `/admin/kelola_ujian/ubah_data?id=${id}`
}
const delete_data = (id) => {
    showAlert();

    const confirmasiHapusData = document.getElementById('confirmasi-hapus-data');
    const batalHapusData = document.getElementById('batalkan-hapus-data');

    const confirmHandler = function(event) {
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
                confirmasiHapusData.innerHTML = 'Konfirmasi';
            },
            error: (xhr, status, error) => {
                success('Failed to delete data', 'center', 'error');
                closeAlert();
                confirmasiHapusData.disabled = false;
                confirmasiHapusData.innerHTML = 'Konfirmasi';
            },
            complete: () => {
                confirmasiHapusData.removeEventListener('click', confirmHandler);
                batalHapusData.removeEventListener('click', cancelHandler);
            }
        });
    };

    const cancelHandler = function(event) {
        closeAlert();
        confirmasiHapusData.removeEventListener('click', confirmHandler);
        batalHapusData.removeEventListener('click', cancelHandler);
    };

    confirmasiHapusData.addEventListener('click', confirmHandler);
    batalHapusData.addEventListener('click', cancelHandler);
}



const setting_data = (id) => {
    window.location.href = `/admin/kelola_ujian/kelola_soal?id=${id}`
}

const play_data = (id) => {
    const confirm_popup = document.getElementById('play-confirm-popup');
    const overlay = document.getElementById('overlay');
    confirm_popup.style.display = 'block';
    overlay.style.display = 'block';
    const data_name = document.getElementsByClassName('btn-play')[0].getAttribute('data-name');
    const kode_mapel = document.getElementById('kode_mapel');
    kode_mapel.innerHTML = 'Kode: <strong>' + data_name + '</strong>';
    kode_mapel.setAttribute('data-kode-mapel', data_name);
    kode_mapel.setAttribute('data-id', id);
    
    // Ensure the handler is added once
    konfirmasi_mulai_ujian.removeEventListener('click', confirmHandler);
    konfirmasi_mulai_ujian.addEventListener('click', confirmHandler);
}

const konfirmasi_mulai_ujian = document.getElementById("confirmasi-mulai-ujian");

const confirmHandler = (event) => {
    const kode_konfirmasi = document.getElementById('mapel_name').value;
    const data_name = document.getElementById('kode_mapel').getAttribute('data-kode-mapel');
    const confirm_popup = document.getElementById('play-confirm-popup');
    const overlay = document.getElementById('overlay');
    const id = document.getElementById('kode_mapel').getAttribute('data-id');

    if (kode_konfirmasi !== data_name) {
        success('Kode Yang Anda Masukan Salah', 'center', 'info');
        return;
    }

    konfirmasi_mulai_ujian.disabled = true;
    konfirmasi_mulai_ujian.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;

    $.ajax({
        url: `/api/ujian/set_active`,
        type: 'GET',
        beforeSend: xhr => {
            xhr.setRequestHeader('X-CSRFToken', csrf_token);
        },
        data: {
            id: id,
        },
        success: response => {
            if (response.status === 200) {
                success(response.message);
                $('#table-data').DataTable().ajax.reload();
            } else {
                success(response.message, 'center', 'error');
            }
            resetConfirmButton();
        },
        error: (xhr, status, error) => {
            success('Failed to start the exam', 'center', 'error');
            resetConfirmButton();
        }
    });
};

document.getElementById('batalkan-mulai-ujian').addEventListener('click', () => {
    document.getElementById('play-confirm-popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    konfirmasi_mulai_ujian.removeEventListener('click', confirmHandler);
});

const resetConfirmButton = () => {
    const confirm_popup = document.getElementById('play-confirm-popup');
    const overlay = document.getElementById('overlay');
    konfirmasi_mulai_ujian.disabled = false;
    konfirmasi_mulai_ujian.innerHTML = `Konfirmasi`;
    confirm_popup.style.display = 'none';
    overlay.style.display = 'none';
    document.getElementById('mapel_name').value = '';
    konfirmasi_mulai_ujian.removeEventListener('click', confirmHandler);
};
