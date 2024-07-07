document.addEventListener('DOMContentLoaded', (event) => {
    const columns = [
        { data: "mata_pelajaran" },
        { 
            data: 'waktu_mulai',
            render: function(data) {
                var date = new Date(data * 1000);
                return formatDate(date);
            }
        },
        { 
            data: 'waktu_selesai',
            render: function(data) {
                var date = new Date(data * 1000);
                return formatDate(date);
            }
        },
        { 
            data: 'nilai_ujian', type: 'string', className: 'dt-left',
            render: data => `${data} Point`
        },
        { 
            data: 'nilai_rata_rata', type: 'string', className: 'dt-left',
            render: data => `${data} Point`
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