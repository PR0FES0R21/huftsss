// Tampilkan Modal Tambah dan ubah data Guru
document.addEventListener('DOMContentLoaded', () => {

    // tampilkan table menggunakan Datatables
    const columns = [ 
        { data: "nama" },
        { data: "nktam" },
        { data: "jabatan" },
        { data: "mata_pelajaran" },
        { data: "email" },
    ]
    datatables(columns, 'Guru', "/api/get/data/guru", false, viewButton, editButton, deleteButton)

    // cek apakah form sudah terisi semua atau belum
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
                    addGuru()
                } else if ( f == 'update' ) {
                    updateGuru()
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

    // hapus 1 data guru
    const batalkanHapusGuru = document.getElementById('batalkan-hapus-data')
    batalkanHapusGuru.addEventListener('click', () => {
        closeAlert()
    })

    const lihatprofileGuru = document.querySelectorAll('.lihat-profile-guru')
    lihatprofileGuru.forEach(event => {
        event.addEventListener('click', () => {
            const id = event.getAttribute('data-name')
            window.location.href = `/profile/${id}`
        })
    })

    // Tampilkan Modal hapus Semua guru
    const HapusSemuaData = document.getElementById('hapus-semua-data-guru'),
    confirmasiHapusA = document.getElementById('confirmasi-hapus-data-a'),
    batalkanHapusA = document.getElementById('batalkan-hapus-data-a')

    HapusSemuaData.addEventListener('click', () => {
        document.getElementById('confirmasi-hapus-data-a').disabled = false
        document.getElementById('confirmasi-hapus-data-a').innerHTML = 'Konfirmasi'
        showAlert('input')
    })
    confirmasiHapusA.addEventListener('click', () => {
        delete_all_data()
    })
    batalkanHapusA.addEventListener('click', () => {
        closeAlert()
    })
})


// const clearFormGuru = () => {
//     $(`form input[type='text'], form input[type='number'], form input[type='email'], form select`).val('');
//     $('input[name="jkGuru"]').prop('checked', false)
//     $(`#tanggalLahirGuru`)[0]._flatpickr.clear();
// }

// handler untuk memunculkan modal tambah data guru
const tombolTambahData = document.getElementById('tambah-data-guru')
tombolTambahData.addEventListener('click', () => {
    $('form').attr('id', 'form-add-guru');
    document.getElementById('submit-form').disabled = false
    document.getElementById('submit-form').innerHTML = 'Tambah Data'
    showModal('Guru', 'Tambah')
})

// handler untuk mengirim data guru ke database
const addGuru = () => {
    const submit_button = document.getElementById('submit-form')
    submit_button.disabled = true
    submit_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
    // ambil data email dari form lalu validasi formatnya dengan regex
    const email = $('#emailGuru').val()
    const isValidEmail = validateEmail(email)
    if(!isValidEmail) {
        success('Format Email Tidak Valid', 'center', 'info', 2000)
        submit_button.disabled = false
        submit_button.innerHTML = 'Tambah Data'
        return
    }
    var formData = $('#form-add-guru').serialize();
    $.ajax({
        url: '/api/add/guru',
        method: 'post',
        data: formData,
        success: response => {
            if(response.status == 409) {
                success(response.message, 'center', 'info')
            } else if (response.status == 200) {
                set_count_data('/api/get/count/guru', '#teacher_count_data')
                success(response.message)
                $('#infoModal').hide()
                $('#form-add-guru')[0].reset();
                $('#table-data').DataTable().ajax.reload();
            } else if (response.status == 400) {
                success(response.message, 'center', 'info', 2000)
            }
            else {
                success(response.message, 'center', 'warning')
            }
            submit_button.disabled = false
            submit_button.innerHTML = 'Tambah Data'
        },
        error: (xhr, status, error) => {
            submit_button.disabled = false
            submit_button.innerHTML = 'Tambah Data'
            console.error(error);
        }
    })
}

const delete_data = (id) => {
    showAlert();

    x = document.getElementById('confirmasi-hapus-data')
    x.disabled = false
    x.innerHTML = 'Ya, Hapus'
    x.addEventListener('click', function a(event) {
        x.disabled = true
        x.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
        $.ajax({
            url: '/api/delete/guru',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            method: 'POST',
            data: { id: id },
            success: response => {
                if (response.status == 200) {
                    set_count_data('/api/get/count/guru', '#teacher_count_data')
                    success('Data Guru Berhasil Dihapus')
                    $('#table-data').DataTable().ajax.reload();
                } else if( response.status == 400 ){
                    success(response.message, 'center', 'info')
                } else {
                    success('Terjadi Kesalahan')
                }
                closeAlert()
                x.disabled = false
                x.innerHTML = 'Ya, Hapus'
            },
        })

        x.removeEventListener('click', a)
    })
}


// Update Data Guru
function updateGuru() {

    const submit_button = document.getElementById('submit-form')
    submit_button.disabled = true
    submit_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'

    const email = $('#emailGuru').val()
    const isValidEmail = validateEmail(email)
    if(!isValidEmail) {
        success('Format Email Tidak Valid', 'center', 'info', 2000)
        submit_button.disabled = false
        submit_button.innerHTML = 'Ubah Data'
        return
    }
    var formData = $('#form-update-guru').serialize();
    $.ajax({
        url: '/api/update/guru',
        method: 'post',
        data: formData,
        success: response => {
            if(response.status == 400) {
                success(response.message, 'center', 'info')
            } else if (response.status == 200) {
                success(response.message)
                $('#infoModal').hide()
                $('#form-update-guru')[0].reset();
                $('#table-data').DataTable().ajax.reload();
            }
            else {
                success(response.message, 'center', 'warning')
            }
            submit_button.disabled = false
            submit_button.innerHTML = 'Ubah Data'
        },
        error: (xhr, status, error) => {
            submit_button.disabled = false
            submit_button.innerHTML = 'Ubah Data'
            console.error(error);
        }
    })
}

// handler untuk melakukan inisisasi data guru yang akan diubah
const set_update = (id) => {

    document.getElementById('submit-form').disabled = false
    document.getElementById('submit-form').innerHTML = 'Ubah Data'

    $.ajax({
        url: '/api/get/data/guru',
        method: 'get',
        data: {
            id: id
        },
        success: response => {
            const datas = response
            const tanggal_lahir = datas.tanggal_lahir
            // inisiasi target
            $('#idGuru').val(datas._id)
            $('#namaGuru').val(datas.nama)
            $('#nktam').val(datas.nktam)
            flatpickr(`#tanggalLahirGuru`, {
                dateFormat: 'd-m-Y',
                defaultDate: tanggal_lahir
            });
            $(`input[name="jkGuru"][value="${datas.jenis_kelamin}"]`).prop('checked', true)
            $('#jabatan').val(datas.jabatan)
            $('#mapelYangDiajar').val(datas.mata_pelajaran)
            $('#emailGuru').val(datas.email)
            $('#nomorTeleponGuru').val(datas.nomor_telepon)

            $('form').attr('id', `form-update-guru`);
            showModal('Guru', 'Ubah')

        },
        error:(xhr, status, error) => {
            console.error(error);
        }
    })
}

const delete_all_data = () => {
    const submit_button = document.getElementById('confirmasi-hapus-data-a')
    submit_button.disabled = true
    submit_button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
    const pw = document.getElementById('security-password-confirmasi').value

    if (pw == '') {
        success('Password Tidak Boleh Kosong', 'center', 'info', 2000)
        submit_button.disabled = false
        submit_button.innerHTML = 'Konfirmasi'
        return
    }

    $.ajax({
        url: '/api/delete_all/guru',
        method: 'post',
        data: { 
            password: pw 
        },
        beforeSend: xhr => {
            xhr.setRequestHeader('X-CSRFToken', csrf_token)
        },
        success: response => {
            if(response.status == 200) {
                set_count_data('/api/get/count/guru', '#teacher_count_data')
                success('Semua Data Berhasil Dihapus!');
                $('#table-data').DataTable().ajax.reload();
                closeAlert();
            } else if (response.status == 400) {
                success(response.message, 'center', 'info')
            } else {
                success(response.message, 'center', 'warning')
            }
            pw.value = '';
            submit_button.disabled = false
            submit_button.innerHTML = 'Konfirmasi'
        },
        error: (xhr, status, error) => {
            submit_button.disabled = false
            submit_button.innerHTML = 'Konfirmasi'
            console.error(error);
        }
    }) 
}



