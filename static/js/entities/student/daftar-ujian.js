document.addEventListener("DOMContentLoaded", (event) => {

    const socket = io();

    socket.on('active_exam', data => {
        $('#table-data').DataTable().ajax.reload();
    })

    const columns = [
        { data: "nama_ujian" },
        { data: "mata_pelajaran" },
        { data: "tanggal_ujian" },
        { 
            data: "waktu_pengerjaan", type: 'string', className: 'dt-left',
            render: data => {
                return data + ' Menit';
            },
        },
    ];

    const defs = [
        { 
            targets: '_all', 
            className: 'dt-left'
        } 
    ]
    callback = {
        cb1: stand,
        cb2: workButton,
        cb3: successButton
    }
    datatables(columns, "daftar-ujian", "/api/get/daftar/ujian", defs, false, false, false, false, callback)

});

const working = (id) => {
    window.location.href =`/api/ujian/kerjakan?id=${id}`
}