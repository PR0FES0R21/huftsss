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