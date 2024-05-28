document.addEventListener("DOMContentLoaded", (event) => {

getLocation()
.then(location => {
    getWeater(location);
}).catch(error => {
    console.error('Error getting location:', error);
});
  // const location = 
  const getWeater = (location) => {
    getCurrentWeather(weatherApikey, location)
      .then((response) => {
        const weaterImage = document.getElementById("weater-image");
        const suhu = document.getElementById("suhu");
        const humadity = document.getElementById("humadity");
        const kecepatanAngin = document.getElementById("kecepatan-angin");
        const indexUv = document.getElementById("index-uv");
        const temperature = document.getElementById("temperature");
        const widgetLocation = document.getElementById("widget-location");
  
        const current = response.current;
        weaterImage.setAttribute("src", current.condition.icon);
        suhu.innerText = current.temp_f + "°F";
        humadity.innerText = current.humidity + "%";
        kecepatanAngin.innerText = current.wind_mph + " " + "Km/h";
        indexUv.innerText = current.uv;
        temperature.innerText = current.temp_c + "°c";
        widgetLocation.innerText =
          response.location.name + ", " + response.location.region;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

});
