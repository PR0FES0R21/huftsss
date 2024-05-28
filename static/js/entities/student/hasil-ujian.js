document.addEventListener('DOMContentLoaded', (event) => {
    const columns = [
        { data: "mata_pelajaran" },
        { data: 'waktu_mulai'},
        { data: 'waktu_selesai'},
        { 
            data: 'nilai_ujian', type: 'string', className: 'dt-left',
            render: data => {
                return data + ' Point';
            },
        },
        { 
            data: 'nilai_rata_rata', type: 'string', className: 'dt-left',
            render: data => {
                return data + ' Point';
            }
        },
    ];
    const defs = [
        { 
            targets: '_all', 
            className: 'dt-left'
        } 
    ]
    a = {
        cb1: remidialButton,
        cb2: analitikButton
    }
    datatables(columns, 'daftar-ujian', "/api/get/daftar_selesai/ujian", defs, false, false, false, false, false, false, a)
});