const viewButton = (row, entities) => {
    return `
        <button class="btn btn-sm btn-warning btn-edit lihat-data-${entities}" onclick="view_data('${row._id}')">
            <i class="fa-regular fa-eye"></i>
        </button>
    `;
};

const editButton = (row, entities) => {
    return `
        <button class="btn btn-sm btn-primary btn-edit edit-data-${entities}" onclick="set_update('${row._id}')">
            <i class='bx bx-edit'></i>
        </button>
    `;
};

const deleteButton = (row, entities) => {
    return `
        <button class="btn btn-sm btn-danger btn-delete hapus-data-${entities}" onclick="delete_data('${row._id}')">
            <i class='bx bx-trash' ></i>
        </button>
    `;
};

const settingsButton = (row, entities) => {
    return `
        <button class="btn btn-sm btn-warning btn-settings hapus-data-${entities}" onclick="setting_data('${row._id}')">
            <i class='bx bx-cog text-white'></i>
        </button>
    `;
};

const playButton = (row, entities) => {
    return `
        <button class="btn btn-sm btn-secondary btn-play hapus-data-${entities}" onclick="play_data('${row._id}')" data-name="${row.nama_ujian}">
            <i class="bi bi-play"></i>
        </button>
    `;
};

const analitikButton = (row, entities) => {
    return `
    <button class="btn btn-sm btn-outline-success btn-edit analitik-hasil-ujian" onclick="analitik('${row._id}')">
        <i class="bi bi-clipboard-data"></i></i> Analitik
    </button>
    `;
}

const analitikButtonP = (row, entities) => {
    return `
    <button class="btn btn-sm btn-outline-success btn-edit analitik-hasil-ujian" onclick="analitik('${row._id}')">
        <i class="bi bi-clipboard-data"></i></i>
    </button>
    `;
}

const successButton = (row, entities) => {
    return `
    <button class="btn btn-sm btn-outline-success btn-outline-success-custom">
        <i class="bi bi-check-circle-fill text-success"></i> Selesai
    </button>
    `;
}

const stand = (row, entities) => {
    return `
    <button class="btn btn-sm btn-secondary">
        Belum Dimulai
    </button>
    `;
}

const workButton = (row, entities) => {
    return `
    <button class="btn btn-sm btn-warning btn-edit kerjakan-ujian" onclick="working('${row._id}')">
        Kerjakan..
    </button>
    `;
}

const remidialButton = (row, entities) => {
    return `
            <button class="btn btn-sm btn-warning btn-edit kerjakan-remidial" onclick="remidial('${row._id}')">
                Remidial...
            </button>
        `;
}

const datatables = (columns, entities, endpoint, defs = false, callback1 = false, callback2 = false, callback3 = false, callback4 = false, callback5 = false, callback6 = false, callback7 = false) => {
    $("#table-data").DataTable({
        order: [[0, "asc"]],
        ajax: {
            url: endpoint,
            dataSrc: "",
        },
        columnDefs: [
            defs
        ],
        columns: [
            ...columns,
            {
                data: null,
                render: function (data, type, row, meta) {
                    let buttons = [
                        callback1 ? callback1(row, entities) : "",
                        callback2 ? callback2(row, entities) : "",
                        callback3 ? callback3(row, entities) : "",
                        callback4 ? callback4(row, entities) : ""
                    ];
    
                    if (callback5) {
                        if (row.status == 0) {
                            if (row.status_pengerjaan == 0) {
                                buttons.push(callback5.cb1(row, entities));
                            } else if (row.status_pengerjaan == 1) {
                                buttons.push(callback5.cb2(row, entities));
                            } else {
                                console.warn(`Unknown status_pengerjaan: ${row.status_pengerjaan} for row:`, row);
                            }
                        } else if (row.status == 1) {
                            buttons.push(callback5.cb3(row, entities));
                        } else {
                            console.warn(`Unknown status: ${row.status} for row:`, row);
                        }
                    }

                    if (callback6) {
                        if (row.status_pengerjaan == 0) {
                            buttons.unshift(callback6.cb1(row, entities));
                        } else if (row.status_pengerjaan == 1) {
                            buttons.unshift(callback6.cb2(row, entities));
                        }
                    }

                    if (callback7) {
                        if (row.status == 0) {
                            buttons.push(callback7.cb1(row, entities))
                        } else if (row.status == 1) {
                            buttons.push(callback7.cb2(row, entities))
                        }
                    }
                    return buttons.join('');
                },
            },
        ],
        scrollX: true,
        lengthMenu: [
            [5, 10, 25, 50, -1],
            ["5", "10", "25", "50", "Semua"],
        ],
        language: {
            search: "",
            searchPlaceholder: "Cari Data...",
            lengthMenu: "Tampilkan _MENU_",
        },
    });
    
}

function formatDate(date) {
    var day = date.getDate();
    var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = ('0' + date.getHours()).slice(-2); // Format dua digit untuk jam
    var minutes = ('0' + date.getMinutes()).slice(-2); // Format dua digit untuk menit
    var seconds = ('0' + date.getSeconds()).slice(-2); // Format dua digit untuk detik
    return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + hours + '.' + minutes + '.' + seconds;
}
