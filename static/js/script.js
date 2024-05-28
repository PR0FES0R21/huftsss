
document.addEventListener("DOMContentLoaded", function (event) {
  const pathName = window.location.pathname;

  // const charts = {
  //   "/": () => {
  //     ;
  //     ;
  //     ;
  //   },
  //   "/analitik": () => {
  //     gambaranDataSekolah(dataSekolah);
  //     pertumbuhanSiswaChart(dataPertumbuhanSiswa1, 250);
  //     pertumbuhanSiswaBerdasarkanJurusan();
  //     scatterplotDistribusiNilai();
  //     tingkatPemahamanSiswa();
  //     jumlahSiswaBerdasarkanJurusanRow();
  //     chartJenisKelamin();
  //     kinerjaSiswaDalamUjian();
  //   },
  // };

  // if (charts[pathName]) charts[pathName]();

  const toggleClass = (element, className) => {
    element.classList.toggle(className);
  };

  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);

    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        ["show", "bx-x", "body-pd", "body-pd"].forEach((cls, index) => {
          toggleClass([nav, toggle, bodypd, headerpd][index], cls);
        });
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    linkColor.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  }

  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  const adjustClasses = (selector, oldClasses, newClasses) => {
    $(selector).each(function () {
      $(this).removeClass(oldClasses).addClass(newClasses);
    });
  };

  adjustClasses(
      "#table-data_wrapper .col-md-auto.me-auto",
      "col-md-auto me-auto",
      "col-12 col-sm-6 d-flex justify-content-center justify-content-sm-start"
  );

  adjustClasses(
      "#table-data_wrapper .col-md-auto.ms-auto",
      "col-md-auto ms-auto",
      "col-12 col-sm-6 d-flex justify-content-center justify-content-sm-end"
  );

});

const set_count_data = (api, targetId) => {
  $.ajax({
      url: api,
      method: 'get',
      success: response => {
          $(targetId).text(response.data)
      },
      error: (xhr, status, error) => {
          console.error(error)
      }
  })
}

function base64ToDict(base64Str) {
  try {
      var jsonStr = atob(base64Str);
      return JSON.parse(jsonStr);
  } catch (e) {
      console.error('Error decoding base64 string:', e);
      return null;
  }
}



