document.addEventListener('DOMContentLoaded', (event) => {
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
                const handler_form_mapel = document.getElementById('handler-form-mapel')
                handler_form_mapel.disabled = true
                handler_form_mapel.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
                event.preventDefault();
                const form = $('#form-mapel').serialize();
                if( document.getElementById('id').value ) {
                    $.ajax({
                        url: '/api/update/mapel',
                        type: 'POST',
                        data: $('#form-mapel').serialize(),
                        success: response => {
                            if (response.status === 200) {
                                success(response.message);
                                $('#table-data').DataTable().ajax.reload();
                                $('#infoModal').hide();
                                $('#form-mapel')[0].reset();
                            } else {
                                success(response.message, 'center', 'error');
                            }
                            handler_form_mapel.disabled = false
                            handler_form_mapel.innerHTML = 'Ubah Data'
                        }
                    })
                    return;
                }

                $.ajax({
                    url: '/api/add/mapel',
                    type: 'POST',
                    data: form,
                    success: response => {
                        if (response.status === 200) {
                            set_count_data('/api/get/count/mapel', '#mapel_count_data');
                            success(response.message);
                            $('#table-data').DataTable().ajax.reload();
                            $('#infoModal').hide();
                            $('#form-mapel')[0].reset();
                        } else {
                            success(response.message, 'center', 'error');
                        }
                        handler_form_mapel.disabled = false
                        handler_form_mapel.innerHTML = 'Tambah Data'
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

    const coulumns = [
        { data: "kode_mapel" },
        { data: "nama_mapel" },
        { data: "jenjang" },
        { data: "program_keahlian" },
        { data: "kkm" },
    ]
    datatables(coulumns, 'mapel', '/api/get/data/mapel', false, viewButton, editButton, deleteButton)

    const tombolTambahData = document.getElementById('tambah-data-mapel');
    tombolTambahData.addEventListener('click', () => {
        document.getElementById('id').value = ''
        showModal('Mapel', 'Tambah');
    })

    // handler_form_mapel.addEventListener('click', (event) => {
    //     handler_form_mapel.disabled = true
    //     handler_form_mapel.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
    //     event.preventDefault();
    //     if ( document.getElementById('id').value) {
    //         $.ajax({
    //             url: '/api/update/mapel',
    //             type: 'POST',
    //             data: $('#form-mapel').serialize(),
    //             success: response => {
    //                 if (response.status === 200) {
    //                     success(response.message);
    //                     $('#table-data').DataTable().ajax.reload();
    //                     $('#infoModal').hide();
    //                     $('#form-mapel')[0].reset();
    //                 } else {
    //                     success(response.message, 'center', 'error');
    //                 }
    //                 handler_form_mapel.disabled = false
    //                 handler_form_mapel.innerHTML = 'Ubah Data'
    //             }
    //         })
    //         return;
    //     }

    //     const form = $('#form-mapel').serialize();
    //     $.ajax({
    //         url: '/api/add/mapel',
    //         type: 'POST',
    //         data: form,
    //         success: response => {
    //             if (response.status === 200) {
    //                 set_count_data('/api/get/count/mapel', '#mapel_count_data');
    //                 success(response.message);
    //                 $('#table-data').DataTable().ajax.reload();
    //                 $('#infoModal').hide();
    //                 $('#form-mapel')[0].reset();
    //             } else {
    //                 success(response.message, 'center', 'error');
    //             }
    //             handler_form_mapel.disabled = false
    //             handler_form_mapel.innerHTML = 'Tambah Data'
    //         }
    //     })
    // })
    


    const hapusDataA = document.getElementById('hapus-data-mapel-a');
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
            url: '/api/delete_all/mapel',
            type: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                password: password.value
            },
            success: response => {
                if (response.status === 200) {
                    set_count_data('/api/get/count/mapel', '#mapel_count_data');
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
    // const hapusData = document.querySelectorAll('.hapus-data-mapel');
    // hapusData.forEach(button => {
    //     button.addEventListener('click', () => {
    //         showAlert()
    //     })
    // })
    // const cancleHapus = document.getElementById('batalkan-hapus-data');
    // cancleHapus.addEventListener('click', () => {
    //     closeAlert();
    // })

    const tombolFilter = document.getElementById('tombol-filter');
    tombolFilter.addEventListener('click', () => {
        toggleBox()
    })
    const selectKelas = document.getElementById("select-kelas");
    selectKelas.addEventListener('change', () => {
        filter();
    })
    const applyButton = document.getElementById("apply-button");
    applyButton.addEventListener('click', () => {
        applyFilter()
    })
})

const set_update = (id) => {
    $.ajax({
        url: `/api/get/data/mapel`,
        type: 'GET',
        data: {
            id: id
        },
        success: response => {
            const data = response[0]
            console.log(data);
            $('#kode-mapel').val(data.kode_mapel);
            $('#nama-mapel').val(data.nama_mapel);
            $('#jenjang').val(data.jenjang);
            $('#jurusan').val(data.program_keahlian);
            $('#kkm').val(data.kkm);
            $('#id').val(data._id);
            showModal('Mapel', 'Ubah');
        }
    })
}

const delete_data = (id) => {
    showAlert();

    const confirmasiHapus = document.getElementById('confirmasi-hapus-data');
    const batalkanHapus = document.getElementById('batalkan-hapus-data');

    const confirmHandler = function() {
        confirmasiHapus.disabled = true;
        confirmasiHapus.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...';

        $.ajax({
            url: '/api/delete/mapel',
            type: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token);
            },
            data: {
                id: id
            },
            success: response => {
                if (response.status === 200) {
                    set_count_data('/api/get/count/mapel', '#mapel_count_data');
                    success(response.message);
                    $('#table-data').DataTable().ajax.reload();
                    closeAlert();
                } else {
                    success(response.message, 'center', 'error');
                }
                confirmasiHapus.disabled = false;
                confirmasiHapus.innerHTML = 'Ya, Hapus';
                confirmasiHapus.removeEventListener('click', confirmHandler);
            },
            error: (xhr, status, error) => {
                success('Terjadi Kesalahan', 'center', 'error');
                closeAlert();
                confirmasiHapus.disabled = false;
                confirmasiHapus.innerHTML = 'Ya, Hapus';
                confirmasiHapus.removeEventListener('click', confirmHandler);
            }
        });
    };

    const cancelHandler = function() {
        closeAlert();
        confirmasiHapus.disabled = false;
        confirmasiHapus.innerHTML = 'Ya, Hapus';
        confirmasiHapus.removeEventListener('click', confirmHandler);
    };

    confirmasiHapus.addEventListener('click', confirmHandler);
    batalkanHapus.addEventListener('click', cancelHandler);
};
