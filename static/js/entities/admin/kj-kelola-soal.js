const url_params = new URLSearchParams(window.location.search);
var id_exam = url_params.get('id');    

document.addEventListener('DOMContentLoaded', () => {

    columns = [
        { data: "soal" },
        { data: "jawaban_a" },
        { data: "jawaban_b" },
        { data: "jawaban_c" },
        { data: "jawaban_d" },
        { data: "kunci_jawaban" },
    ]
    defs = {
        targets: '_all',
        className: 'max-width-column'
    }
    datatables(columns, 'soal', `/api/get/data/soal?exam_id=${id_exam}`, defs, editButton, deleteButton,)
    
    const tombolTambahSoal = document.getElementById('tombol-tambah-soal')
    tombolTambahSoal.addEventListener('click', () => {
        $('#id').val('');
        showModal('Soal', 'Tambah');
    })
    
    const handler_soal = document.getElementById('add-soal')
    handler_soal.addEventListener('click', e => {
        handler_soal.disabled = true
        handler_soal.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        e.preventDefault()
        const form = $('#form-soal').serialize()
        console.log(form);
        
        id_ujian = document.getElementById('id').value
        if (id_ujian) {
            $.ajax({
                url: '/api/update/soal',
                type: 'POST',
                data: form,
                success: data => {
                    if (data.status == 200) {
                        success(data.message)
                        $('#infoModal').hide()
                        $('#form-soal')[0].reset();
                        $('#table-data').DataTable().ajax.reload();
                    } else if (data.status == 400) {
                        success(data.message, 'center', 'info')
                    } else {
                        success(data.message, 'center', 'error')
                    }
                    closeAlert()
                    handler_soal.disabled = false
                    handler_soal.innerHTML = 'Ubah Data'
                }
            })
            return;
        }
        
        $.ajax({
            url: '/api/add/soal',
            type: 'POST',
            data: form,
            success: function (data) {
                console.log(data);
                if (data.status == 200) {
                    set_count_data(`/api/get/count/soal?id=${id_exam}`, '#question_count_data')
                    success(data.message)
                    $('#infoModal').hide()
                    $('#form-soal')[0].reset();
                    $('#table-data').DataTable().ajax.reload();
                } else {
                    success(data.message, 'center', 'error')
                }
                closeAlert()
                handler_soal.disabled = false
                handler_soal.innerHTML = 'Tambah Data'
            }
        })
    })


    const tombolHapusSoalA = document.getElementById('hapus-data-soal-a')
    tombolHapusSoalA.addEventListener('click', () => {
        showAlert('input');
    })
    const batalkanHapusDataA = document.getElementById('batalkan-hapus-data-a')
    batalkanHapusDataA.addEventListener('click', () => {
        closeAlert();
    })
    const confirmasiHapusDataA = document.getElementById('confirmasi-hapus-data-a')
    confirmasiHapusDataA.addEventListener('click', () => {
        confirmasiHapusDataA.disabled = true;
        confirmasiHapusDataA.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        const password = document.getElementById('security-password-confirmasi')
        if (!password.value) {
            success('Silahkan Masukan Password!', 'center', 'info')
            confirmasiHapusDataA.disabled = false;
            confirmasiHapusDataA.innerHTML = 'Konfirmasi'
            return;
        }
        $.ajax({
            url: '/api/delete_all/soal',
            type: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                id: id_exam,
                password: password.value
            },
            success: response => {
                if (response.status == 200) {
                    set_count_data(`/api/get/count/soal?id=${id_exam}`, '#question_count_data')
                    success(response.message)
                    $('#table-data').DataTable().ajax.reload();
                    closeAlert();
                } else {
                    success(response.message, 'center', 'error')
                }
                password.value = '';
                confirmasiHapusDataA.disabled = false;
                confirmasiHapusDataA.innerHTML = 'Konfirmasi'
            }
        })
    })
    
    const batalkanHapusSoal = document.getElementById('batalkan-hapus-data')
    batalkanHapusSoal.addEventListener('click', () => {
        closeAlert();
    })
})

const set_update = (id) => {
    $.ajax({
        url: '/api/get/data/soal',
        method: 'get',
        data: {
            id: id
        },
        success: response => {
            datas = response[0];
            $('#id').val(datas._id)
            $('#soal').val(datas.soal)
            $('#jawaban_a').val(datas.jawaban_a)
            $('#jawaban_b').val(datas.jawaban_b)
            $('#jawaban_c').val(datas.jawaban_c)
            $('#jawaban_d').val(datas.jawaban_d)
            $('#kunci_jawaban').val(datas.kunci_jawaban)
            
            showModal('Guru', 'Ubah');
        },
        error:(xhr, status, error) => {
            console.error(error);
        }
    })
}

const delete_data = (id) => {
    showAlert();
    
    const confirmasiHapusData = document.getElementById('confirmasi-hapus-data');
    confirmasiHapusData.addEventListener('click', function a(event) {
        confirmasiHapusData.disabled = true;
        confirmasiHapusData.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`
        $.ajax({
            url: '/api/delete/soal',
            type: 'POST',
            beforeSend: xhr => {
                xhr.setRequestHeader('X-CSRFToken', csrf_token)
            },
            data: {
                id: id
            },
            success: response => {
                if (response.status == 200) {
                    set_count_data(`/api/get/count/soal?id=${id_exam}`, '#question_count_data')
                    success(response.message)
                    $('#table-data').DataTable().ajax.reload();
                } else {
                    success(response.message, 'center', 'error')
                }
                closeAlert();
                confirmasiHapusData.disabled = false;
                confirmasiHapusData.innerHTML = 'Ya, Hapus'
            }
        })
        confirmasiHapusData.removeEventListener('click', a);
    })
}