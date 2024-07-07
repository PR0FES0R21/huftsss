document.addEventListener('DOMContentLoaded', function(event) {
    pertumbuhanSiswaChart(dataPertumbuhanSiswa, 150);
    showJurusanComparison(dataSiswa);
    createBrowserUsageChart(browserData);
})

const get_info_user = async () => {
    const headers = {
        content_type: 'application/json',
        autorization: `Bearer ${$.cookie('smk_muda_token')}`
    }
    try {
        const response = await fetch('/api/get/user/info', {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();
        console.log(data);
    }
    catch (err) {
        console.log(err);
    }
}

const socket = io();
socket.on('active_users', data => {
    $('#active_user_count').text(data.count)
});

socket.on('actifity', data => {
    addActivity(data)
})


function timeAgo(timestamp) {
    const now = new Date();
    const timeDiff = now - new Date(timestamp * 1000);
    const seconds = Math.floor(timeDiff / 1000);
    
    if (seconds < 60) {
        return `${seconds} detik yang lalu`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} menit yang lalu`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} jam yang lalu`;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days} hari yang lalu`;
    }
}

function updateTimes() {
    console.log('anajsh');
    const timeElements = document.querySelectorAll('.time-ago');
    timeElements.forEach(el => {
    const timestamp = el.getAttribute('data-timestamp');
    el.textContent = timeAgo(timestamp);
    });
}
updateTimes();
setInterval(updateTimes, 60000);

function addActivity(data) {
    console.log(data);
    const container = document.getElementById('activity-container');

    const maxElements = 5;

    // Buat elemen aktivitas baru
    const newActivity = document.createElement('div');
    newActivity.classList.add('aktifitas-pengguna', 'mb-2', 'animate__animated', 'animate__fadeInUp');
    newActivity.innerHTML = `
        <div class="user-profile">
            <img src="/static/assets/images/user_profile/${data.user_profile}" alt="profile aktifitas user">
        </div>
        <div class="user-detail mx-2">
            <div class="nama text-capitalize">${data.nama}</div>
            <div class="aktifitas">${data.actifity} menggunakan ${data.os_name}</div>
            <div id="time-ago" class="waktu">
                <i class="bx bx-time-five"></i>
                <span class="time-ago" data-timestamp="${data.waktu_aktifitas}">${timeAgo(data.waktu_aktifitas)}</span>
            </div>
        </div>
    `;

    // Tambahkan elemen baru ke dalam kontainer
    
    // Hapus elemen paling atas jika sudah ada lebih dari 5 elemen dengan animasi
    if (container.children.length >= maxElements) {
        const firstChild = container.firstElementChild;
        firstChild.classList.add('animate__animated', 'animate__slideOutUp');
        container.removeChild(firstChild);
        // Tambahkan elemen baru ke dalam kontainer setelah menghapus elemen teratas
        container.appendChild(newActivity);
    } else {
        // Tambahkan elemen baru ke dalam kontainer jika belum mencapai batas maksimal
        container.appendChild(newActivity);
    }

    updateTimes();
}