// Widget waktu
function addLeadingZero(num) {
    return (num < 10 ? "0" : "") + num;
  }

  function getCurrentTime() {
    var now = new Date();
    return {
      jam: addLeadingZero(now.getHours()),
      menit: addLeadingZero(now.getMinutes()),
      detik: addLeadingZero(now.getSeconds()),
    };
  }

  function updateClock() {
    var time = getCurrentTime();
    $(".jam").text(time.jam);
    $(".menit").text(time.menit);
    $(".detik").text(time.detik);
  }

  setInterval(updateClock, 1000);
  updateClock();