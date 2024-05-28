function getCurrentWeather(apiKey, location) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'https://api.weatherapi.com/v1/current.json',
            method: 'get',
            data: {
                key: apiKey,
                q: location,
                aqi: 'yes'
            },
            success: response => {
                resolve(response);
            },
            error: (xhr, status, error) => {
                reject(error);
            }
        });
    });
}