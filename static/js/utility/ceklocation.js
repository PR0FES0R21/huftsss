// import { alert } from "./alert.js";

document.addEventListener('DOMContentLoaded', () => {
    if (navigator.permissions) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
            if (result.state !== 'granted') {
                alert()
                .then((result) => {
                    console.log('ok');
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((error) => {
            console.error('Terjadi kesalahan dalam memeriksa izin lokasi:', error);
        });
    } else {
    success('Browser tidak mendukung fitur Permissions API', 'center', 'warning', 3000);
    }
    // if (navigator.permissions) {
    //     navigator.permissions.query({ name: 'geolocation' }).then((result) => {
    //         if (result.state === 'granted') {
    //             getLocation()
    //             .then((result) => {
    //                 getWeater(result)
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         } else {
    //             alert()
    //             .then((result) => {
    //                 getWeater(result);
    //             }).catch((err) => {
    //                 console.log(err);
    //             });
    //         }
    //     }).catch((error) => {
    //         console.error('Terjadi kesalahan dalam memeriksa izin lokasi:', error);
    //     });
    // } else {
    // console.warn('Browser tidak mendukung fitur Permissions API');
    // }



        

    // getLocation()
    // .then(location => {
    //     getCurrentWeather(http.weaterApikey, location)
    //     .then(response => {
    //         const weaterImage = document.getElementById('weater-image');
    //         const suhu = document.getElementById('suhu');
    //         const humadity = document.getElementById('humadity')
    //         const kecepatanAngin = document.getElementById('kecepatan-angin');
    //         const indexUv = document.getElementById('index-uv')
    //         const temperature = document.getElementById('temperature')
    //         const widgetLocation = document.getElementById('widget-location')

    //         const current = response.current
    //         weaterImage.setAttribute('src', current.condition.icon)
    //         suhu.innerText = current.temp_f + '°F'
    //         humadity.innerText = current.humidity + '%'
    //         kecepatanAngin.innerText = current.wind_mph +' '+ 'Km/h'
    //         indexUv.innerText = current.uv
    //         temperature.innerText = current.temp_c + '°c'
    //         widgetLocation.innerText = response.location.name +', '+ response.location.region
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // })
    // .catch(error => {
    //     console.error("Error: " + error.message);
    // });



    // getCurrentWeather(http.weaterApikey, getLocation())
    // .then(response => {
    //     console.log(response);
    //     const weaterImage = document.getElementById('weater-image');
    //     const suhu = document.getElementById('suhu');
    //     const humadity = document.getElementById('humadity')
    //     const kecepatanAngin = document.getElementById('kecepatan-angin');
    //     const indexUv = document.getElementById('index-uv')
    //     const temperature = document.getElementById('temperature')
    //     const widgetLocation = document.getElementById('widget-location')

    //     const current = response.current
    //     weaterImage.setAttribute('src', current.condition.icon)
    //     suhu.innerText = current.temp_f + '°F'
    //     humadity.innerText = current.humidity + '%'
    //     kecepatanAngin.innerText = current.wind_mph +' '+ 'Km/h'
    //     indexUv.innerText = current.uv
    //     temperature.innerText = current.temp_c + '°c'
    //     widgetLocation.innerText = response.location.name +', '+ response.location.region
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
})