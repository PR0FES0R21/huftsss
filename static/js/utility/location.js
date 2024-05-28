function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    resolve(latitude + ',' + longitude);
                }, 
                function(error) {
                    if (error.code === error.PERMISSION_DENIED) {
                        resolve('kalirejo');
                    } else {
                        reject(error);
                    }
                }
            );
        } else {
            reject(new Error("Geolocation tidak didukung oleh browser ini."));
        }
    });
}
