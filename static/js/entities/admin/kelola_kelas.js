document.addEventListener('DOMContentLoaded', (event) => {

    const coulumns = [
        { data: "wali_kelas" },
        { data: "nama_kelas" },
        { 
            data: function (row) {
                return row.jumlah_siswa + " " + "Siswa";
            },
        },
        {
            data: function (row) {
            return "Ruang" + " " + row.ruang_kelas;
            }
        },
        { data: "jenjang" },
        { data: "program_keahlian" },
    ]
    datatables(coulumns, 'kelas', '/api/get/data/kelas', false, viewButton, editButton, deleteButton)

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
        
            // Jika semua input sudah diisi, kirimkan formulir
            if (isValid) {
                const submit_button = document.getElementById('submit_form_kelas');
                submit_button.disabled = true;
                submit_button.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
                event.preventDefault();
                if( document.getElementById('id').value ) {
                    $.ajax({
                        url: '/api/update/kelas',
                        type: 'POST',
                        data: $('#form-kelas').serialize(),
                        success: response => {
                            if (response.status === 200) {
                                success(response.message);
                                $('#table-data').DataTable().ajax.reload();
                                $('#infoModal').hide();
                                $('#form-kelas')[0].reset();
                            } else {
                                success(response.message, 'center', 'error');
                            }
                            submit_button.disabled = false;
                            submit_button.innerHTML = 'Ubah Data'
                        }
                    })
                    return;
                }

                $.ajax({
                    url: '/api/add/kelas',
                    type: 'POST',
                    data: $('#form-kelas').serialize(),
                    success: response => {
                        if (response.status === 200) {
                            set_count_data('/api/get/count/kelas', '#class_count_data');
                            success(response.message);
                            $('#table-data').DataTable().ajax.reload();
                            $('#infoModal').hide();
                            $('#form-kelas')[0].reset();
                        } else {
                            success(response.message, 'center', 'error');
                        }
                        submit_button.disabled = false;
                        submit_button.innerHTML = 'Tambah Data'
                    }
                })
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


    const tombolTambahData = document.getElementById('tambah-data-kelas');
    tombolTambahData.addEventListener('click', () => {
        $('#form-kelas')[0].reset();
        document.getElementById('id').value = ''
        showModal('Kelas', 'Tambah');
    })


    const hapusDataA = document.getElementById('hapus-data-kelas-a');
    hapusDataA.addEventListener('click', () => {
        showAlert('input');
    })
    const cancleHapusA = document.getElementById('batalkan-hapus-data-a');
    cancleHapusA.addEventListener('click', () => {
        closeAlert()
    })
    const confirmasiHapusA = document.getElementById('confirmasi-hapus-data-a');
    confirmasiHapusA.addEventListener('click', () => {
        confirmasiHapusA.disabled = true;
        confirmasiHapusA.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        const password = document.getElementById('security-password-confirmasi');
        if (!password.value) {
            confirmasiHapusA.disabled = false;
            confirmasiHapusA.innerHTML = 'Konfirmasi'
            success('Silahkan Masukan Password', 'center', 'error');
            return;
        }
        $.ajax({
            url: '/api/delete_all/kelas',
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                password: password.value
            },
            success: response => {
                if (response.status === 200) {
                    set_count_data('/api/get/count/kelas', '#class_count_data');
                    success(response.message);
                    $('#table-data').DataTable().ajax.reload();
                    closeAlert();
                } else {
                    success(response.message, 'center', 'error');
                }
                password.value = '';
                confirmasiHapusA.disabled = false;
                confirmasiHapusA.innerHTML = 'Konfirmasi'
            }
        })
    })

    const cancleHapus = document.getElementById('batalkan-hapus-data');
    cancleHapus.addEventListener('click', () => {
        closeAlert();
    })

})

const set_update = (id) => {
    $.ajax({
        url: `/api/get/data/kelas`,
        method: 'get',
        data: {
            id: id
        },
        success: response => {
            const data = response[0]
            document.getElementById('id').value = data._id;
            document.getElementById('nama-kelas').value = data.nama_kelas;
            document.getElementById('wali-kelas').value = data.wali_kelas;
            document.getElementById('jumlah-siswa').value = data.jumlah_siswa;
            document.getElementById('ruang-kelas').value = data.ruang_kelas;
            document.getElementById('jenjang').value = data.jenjang;
            document.getElementById('jurusan').value = data.program_keahlian;
            showModal('Kelas', 'Ubah');
        }
    })
}

const delete_data = (id) => {
    showAlert()
    const confirmasiHapus = document.getElementById('confirmasi-hapus-data');
    confirmasiHapus.addEventListener('click', function a() {
        confirmasiHapus.disabled = true;
        confirmasiHapus.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        $.ajax({
            url: `/api/delete/kelas`,
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                id: id
            },
            success: response => {
                if (response.status === 200) {
                    set_count_data('/api/get/count/kelas', '#class_count_data');
                    success(response.message);
                    $('#table-data').DataTable().ajax.reload();
                    closeAlert();
                } else {
                    success(response.message, 'center', 'error');
                }
                confirmasiHapus.disabled = false;
                confirmasiHapus.innerHTML = 'Ya, Hapus'
            }
        })
        confirmasiHapus.removeEventListener('click', a)
    })
}