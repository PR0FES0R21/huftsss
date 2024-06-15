document.addEventListener('DOMContentLoaded', event => {

    const columns = [
        { data: "nama" },
        { data: "nis" },
        { data: "kelas" },
        { data: "program_keahlian" },
        { data: "email" },
    ]
    datatables(columns, 'Siswa', "/api/get/data/siswa", false, viewButton, editButton, deleteButton)

    const hapusDataA = document.getElementById('hapus-semua-data-siswa');
    const confirmasiHapusA = document.getElementById('confirmasi-hapus-data-a');
    const cancleHapusA = document.getElementById('batalkan-hapus-data-a');
    hapusDataA.addEventListener('click', () => {
        document.getElementById('confirmasi-hapus-data-a').disabled = false;
        document.getElementById('confirmasi-hapus-data-a').innerHTML = 'Konfirmasi';
        showAlert('input');
    })
    confirmasiHapusA.addEventListener('click', () => {
        const submit_button = document.getElementById('confirmasi-hapus-data-a');
        submit_button.disabled = true;
        submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        const password_security = document.getElementById('security-password-confirmasi').value;
        if (!password_security) {
            success('Password tidak boleh kosong!', 'center', 'info', 2000);
            submit_button.disabled = false;
            submit_button.innerHTML = 'Konfirmasi';
            return;
        }

        $.ajax({
            url: '/api/delete_all/siswa',
            method: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                password: password_security
            },
            success: response => {
                if (response.status == 200) {
                    set_count_data('/api/get/count/siswa', '#student_count_data')
                    success('Semua Data Berhasil Dihapus!');
                    closeAlert();
                    $('#table-data').DataTable().ajax.reload();
                } else if (response.status == 400) {
                    success(response.message, 'center', 'info');
                } else {
                    success('Terjadi Kesalahan!', 'center', 'warning');
                }
                password_security.value = '';
                submit_button.disabled = false;
                submit_button.innerHTML = 'Konfirmasi';
            },
            error: err => {
                submit_button.disabled = false;
                submit_button.innerHTML = 'Konfirmasi';
                console.error(err);
            }
        })
    })
    cancleHapusA.addEventListener('click', () => {
        document.getElementById('security-password-confirmasi').value = '';
        closeAlert();
    })

    const tombolFilter = document.getElementById('tombol-filter')
    tombolFilter.addEventListener('click', () => {
        toggleBox()
    })
    const selectKelas = document.getElementById("select-kelas");
    selectKelas.addEventListener('change', () => {
        filter();
    })
    const applyButton = document.getElementById("apply-button");
    applyButton.addEventListener('click', () => {
        applyFilter(columns)
    })

    const lihatprofileSiswa = document.querySelectorAll('.lihat-profile-siswa');
    lihatprofileSiswa.forEach(event => {
        event.addEventListener('click', () => {
            const id = event.getAttribute('data-id');
            window.location.href = `/profile/${id}`
        })
    })
})

$(document).ready(function() {
    $("form").on("submit", function(event) {
        event.preventDefault();
    
        let isValid = true;
        // Memeriksa setiap input dalam formulir
        $(this).find("input, select").each(function() {
        if ($(this).prop("required") && $(this).val() === "") {
            isValid = false;
            $(this).addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid");
        }
        });

        // Memeriksa radio button
        $(this).find("input[type='radio']").each(function() {
            const name = $(this).attr("name");
            if ($(this).prop("required") && !$(`input[name='${name}']:checked`).val()) {
            isValid = false;
            $(this).addClass("is-invalid");
            } else {
            $(this).removeClass("is-invalid");
            }
        });
    
        // Jika semua input sudah diisi, kirimkan formulir
        if (isValid) {
            event.preventDefault();
            f = $('form').attr('id').split('-')[1]

            if ( f == 'add' ) {
                add_siswa()
            } else if ( f == 'update' ) {
                update_siswa()
            }
        }
    });
    
    // Menambahkan event handler untuk setiap input dalam formulir
    $("form input, form select").on("input change", function() {
        if ($(this).val() !== "") {
        $(this).removeClass("is-invalid");
        } else {
        $(this).addClass("is-invalid");
        }
    });
});

const tombolTambahSiswa = document.getElementById('tambah-data-siswa');
tombolTambahSiswa.addEventListener('click', () => {
    $('form').attr('id', 'form-add-siswa');
    showModal('Siswa', 'Tambah');
})

const add_siswa = () => {
    const submit_button = document.getElementById('submit-form');
    submit_button.disabled = true;
    submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    const email = document.getElementById('email').value;
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
        submit_button.disabled = false;
        submit_button.innerHTML = 'Tambah Data';
        success('Format Email tidak valid', 'center', 'info', 2000);
        return;
    }

    const formData = $('#form-add-siswa').serialize();
    console.log(formData);
    $.ajax({
        type: 'POST',
        url: '/api/add/siswa',
        data: formData,
        success: function(response) {
            if(response.status == 409) {
                success(response.message, 'center', 'info')
            } else if (response.status == 200) {
                set_count_data('/api/get/count/siswa', '#student_count_data')
                success(response.message)
                $('#infoModal').hide()
                $('#form-add-siswa')[0].reset();
                $('#table-data').DataTable().ajax.reload();
            } else if (response.status == 400) {
                success(response.message, 'center', 'info', 2000)
            }
            else {
                success(response.message, 'center', 'warning')
            }
            submit_button.disabled = false;
            submit_button.innerHTML = 'Tambah Data';
        },
        error: function(err) {
            console.log(err);
        }
    })
}

const set_update = (id) => {
    document.getElementById('submit-form').innerHTML = 'Ubah Data';
    document.getElementById('submit-form').disabled = false;
    $.ajax({
        url: '/api/get/data/siswa',
        method: 'get',
        data: {
            id: id
        },
        success: response => {
            // inisiasi data dari response
            const datas = response
            console.log(response);
            // format tanggal lahir
            const tanggal_lahir = datas.tanggal_lahir

            // inisiasi target
            $('#id').val(datas._id)
            $('#nama').val(datas.nama)
            $('#nis').val(datas.nis)
            $('#tempat_lahir').val(datas.tempat_lahir)
            flatpickr(`#tanggal_lahir`, {
                dateFormat: 'Y-m-d',
                defaultDate: tanggal_lahir
            });
            $(`input[name="jenis_kelamin"][value="${datas.jenis_kelamin}"]`).prop('checked', true)
            $('#nomor_telepon').val(datas.nomor_telepon)
            $('#email').val(datas.email)
            $('#kelas').val(datas.kelas)
            $('#program_keahlian').val(datas.program_keahlian)
            $('#jenjang_kelas').val(datas.jenjang_kelas)

            $('form').attr('id', `form-update-siswa`);
            showModal('Siswa', 'Ubah')

        },
        error:(xhr, status, error) => {
            console.error(error);
        }
    })
}

const update_siswa = () => {
    const submit_button = document.getElementById('submit-form');
    submit_button.disabled = true;
    submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    const email = document.getElementById('email').value;
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
        success('Format Email tidak valid', 'center', 'info', 2000);
        submit_button.disabled = false;
        submit_button.innerHTML = 'Tambah Data';
        return;
    }
    const formData = $('#form-update-siswa').serialize();
    $.ajax({
        type: 'POST',
        url: '/api/update/siswa',
        beforeSend: xhr => {
            xhr.setRequestHeader('X-XSRFToken', csrf_token)
        },
        data: formData,
        success: function(response) {
            if(response.status == 400) {
                success(response.message, 'center', 'info')
            } else if (response.status == 200) {
                success(response.message)
                $('#infoModal').hide()
                $('#form-update-siswa')[0].reset();
                $('#table-data').DataTable().ajax.reload();
            }
            else {
                success(response.message, 'center', 'warning')
            }
            submit_button.disabled = false;
            submit_button.innerHTML = 'Tambah Data';
        },
        error: function(err) {
            submit_button.disabled = false;
            submit_button.innerHTML = 'Tambah Data';
            console.log(err);
        }
    })
}
const batalkanHapusData = document.getElementById('batalkan-hapus-data');
batalkanHapusData.addEventListener('click', () => {
    closeAlert();
})
const delete_data = (id) => {
    showAlert();
    x = document.getElementById('confirmasi-hapus-data')
    x.disabled = false;
    x.innerHTML = 'Ya, Hapus';
    x.addEventListener('click', function a(event) {
        x.disabled = true;
        x.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
        $.ajax({
            url: '/api/delete/siswa',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            method: 'POST',
            data: { id: id },
            success: response => {
                if (response.status == 200) {
                    set_count_data('/api/get/count/siswa', '#student_count_data')
                    success('Data siswa Berhasil Dihapus')
                    $('#table-data').DataTable().ajax.reload();
                } else if( response.status == 400 ){
                    success(response.message, 'center', 'info')
                } else {
                    success('Terjadi Kesalahan')
                }
                closeAlert()
            },
        })

        x.removeEventListener('click', a)
    })
}