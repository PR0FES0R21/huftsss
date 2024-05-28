// inspect elemen -> header -> Sec-Ch-Ua-Platform


// Mengambil nilai dari header Sec-Ch-Ua-Platform
var platform = navigator.userAgentData?.platform;

// Memeriksa apakah nilai platform berhasil diambil
if (platform) {
    console.log('Platform:', platform);
} else {
    console.log('Platform tidak tersedia.');
}
