function showJurusanComparison(data) {
  const options = {
    chart: {
      type: "bar",
      height: 250,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    series: data.series.map((item, index) => {
      return {
        name: item.name,
        data: item.data,
        color: ["#415CB4", "#90E0EF", "#0077B6", "#FF0000"][index],
      };
    }),
    xaxis: {
      categories: data.categories,
    },
    yaxis: {
      title: {
        text: "Jumlah Siswa",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  const chart = new ApexCharts(
    document.querySelector("#showJurusanComparison"),
    options
  );
  chart.render();
}

function pertumbuhanSiswaChart(data, height) {
  const options = {
    chart: {
      type: "area",
      height: height,
    },
    series: data.series,
    xaxis: {
      categories: data.categories,
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      title: {
        text: "Jumlah Siswa",
      },
    },

    colors: ["#90E0EF"],
  };

  const chart = new ApexCharts(
    document.querySelector("#pertumbuhanSiswaChart"),
    options
  );
  chart.render();
}

function createBrowserUsageChart(data) {
  const options = {
    chart: {
      type: "donut",
      height: 150,
      position: "left",
    },
    series: data.series,
    labels: data.categories,
    colors: ["#FF0000", "#90E0EF", "#FBC2EB", "#0096C7", "#A6C1EE"],
    legend: {
      position: "right",
    },
    dataLabels: {
      enabled: false,
    },
  };

  const chart = new ApexCharts(
    document.querySelector("#browserUsageChart"),
    options
  );
  chart.render();
}

const dataSiswa = {
  categories: ["Kelas 10", "Kelas 11", "Kelas 12"],
  series: [
    { name: "TKJ", data: [30, 40, 35] },
    { name: "TBSM", data: [25, 35, 30] },
    { name: "TP", data: [20, 30, 25] },
    { name: "TKR", data: [15, 25, 20] },
  ],
};

function gambaranDataSekolah(data) {
  var options = {
    series: [
      {
        data: [22, 512, 30, 27],
      },
    ],
    chart: {
      height: 250,
      type: "bar",
    },
    colors: ["#415CB4", "#90E0EF", "#ff0000", "#0077B6"],
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: ["Guru", "Siwa", "Kelas", "Mapel"],
      labels: {
        style: {
          colors: ["#415CB4", "#90E0EF", "#0077B6"],
          fontSize: "12px",
        },
      },
    },
  };

  var chart = new ApexCharts(
    document.querySelector("#chart-gambaran-data-sekolah"),
    options
  );
  chart.render();
}

const scatterplotDistribusiNilai = () => {
  var options = {
    series: [
      {
        name: "TP",
        data: [
          [16.4, 5.4],
          [21.7, 2],
          [25.4, 3],
          [19, 2],
          [10.9, 1],
          [13.6, 3.2],
          [10.9, 7.4],
          [10.9, 0],
          [10.9, 8.2],
          [16.4, 0],
          [16.4, 1.8],
          [13.6, 0.3],
          [13.6, 0],
          [29.9, 0],
          [27.1, 2.3],
          [16.4, 0],
          [13.6, 3.7],
          [10.9, 5.2],
          [16.4, 6.5],
          [10.9, 0],
          [24.5, 7.1],
          [10.9, 0],
          [8.1, 4.7],
          [19, 0],
          [21.7, 1.8],
          [27.1, 0],
          [24.5, 0],
          [27.1, 0],
          [29.9, 1.5],
          [27.1, 0.8],
          [22.1, 2],
        ],
      },
      {
        name: "TKR",
        data: [
          [36.4, 13.4],
          [1.7, 11],
          [5.4, 8],
          [9, 17],
          [1.9, 4],
          [3.6, 12.2],
          [1.9, 14.4],
          [1.9, 9],
          [1.9, 13.2],
          [1.4, 7],
          [6.4, 8.8],
          [3.6, 4.3],
          [1.6, 10],
          [9.9, 2],
          [7.1, 15],
          [1.4, 0],
          [3.6, 13.7],
          [1.9, 15.2],
          [6.4, 16.5],
          [0.9, 10],
          [4.5, 17.1],
          [10.9, 10],
          [0.1, 14.7],
          [9, 10],
          [12.7, 11.8],
          [2.1, 10],
          [2.5, 10],
          [27.1, 10],
          [2.9, 11.5],
          [7.1, 10.8],
          [2.1, 12],
        ],
      },
      {
        name: "TBSM",
        data: [
          [21.7, 3],
          [23.6, 3.5],
          [24.6, 3],
          [29.9, 3],
          [21.7, 20],
          [23, 2],
          [10.9, 3],
          [28, 4],
          [27.1, 0.3],
          [16.4, 4],
          [13.6, 0],
          [19, 5],
          [22.4, 3],
          [24.5, 3],
          [32.6, 3],
          [27.1, 4],
          [29.6, 6],
          [31.6, 8],
          [2.6, 24],
          [16, 4],
          [4, 28],
          [32.6, 10.3],
          [29.7, 20.8],
          [24.5, 0.8],
          [21.4, 0],
          [21.7, 6.9],
          [28.6, 7.7],
          [15.4, 0],
          [18.1, 0],
          [33.4, 0],
          [16.4, 0],
        ],
      },
      {
        name: "TKJ",
        data: [
          [19.7, 17],
          [29.6, 7.5],
          [16.6, 26],
          [29.9, 2],
          [14, 16],
          [13, 23],
          [10.9, 3],
          [28, 4],
          [27.1, 0.3],
          [16.4, 4],
          [13.6, 0],
          [19, 5],
          [22.4, 3],
          [24.5, 3],
          [32.6, 3],
          [27.1, 4],
          [29.6, 6],
          [31.6, 8],
          [21.6, 5],
          [20.9, 4],
          [22.4, 0],
          [32.6, 10.3],
          [29.7, 20.8],
          [24.5, 0.8],
          [21.4, 0],
          [21.7, 6.9],
          [28.6, 7.7],
          [15.4, 0],
          [18.1, 0],
          [33.4, 0],
          [16.4, 0],
        ],
      },
    ],

    chart: {
      height: 350,
      type: "scatter",
      zoom: {
        enabled: true,
        type: "xy",
      },
    },
    xaxis: {
      tickAmount: 10,
      labels: {
        formatter: function (val) {
          return parseFloat(val).toFixed(1);
        },
      },
    },
    yaxis: {
      tickAmount: 7,
    },
  };

  var chart = new ApexCharts(
    document.querySelector("#distribusi-nilai"),
    options
  );
  chart.render();
};

const pertumbuhanSiswaBerdasarkanJurusan = () => {
  var options = {
    series: [
      {
        name: "TP",
        data: [31, 45, 58, 51, 62, 109, 70],
      },
      {
        name: "TKR",
        data: [11, 32, 45, 60, 74, 82, 100],
      },
      {
        name: "TBSM",
        data: [70, 50, 35, 67, 80, 65, 45],
      },
      {
        name: "TKJ",
        data: [32, 59, 42, 29, 40, 59, 81],
      },
    ],

    chart: {
      height: 350,
      type: "line",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#008FFB", "#FEB019", "#FF4560", "#544FC5"],
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"],
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (val) {
          return val + " siswa";
        },
      },
    },
  };

  var chart = new ApexCharts(
    document.querySelector("#pertumbuhan-siswa-berdasarkan-jurusan"),
    options
  );
  chart.render();
};

const tingkatPemahamanSiswa = () => {
  var options = {
    series: [
      {
        name: "Kelas 10",
        data: [
          20, 80, 50, 90, 10, 90, 30, 70, 50
        ],
      },
      {
        name: "Kelas 11",
        data: [
          90, 40, 100, 40, 80, 30, 50, 70, 60,
        ],
      },
      {
        name: "Kelas 12",
        data: [
          60, 100, 70, 90, 95, 67, 80, 40, 60,
        ],
      },
    ],
    stroke: {
      show: false,
    },
    fill: {
      opacity: 0.5,
      colors: ["#50E3C2", "#FF4560", "#007bff"],
    },
    chart: {
      type: "radar",
      height: 550,
    },
    yaxis: {
      show: false,
    },
    xaxis: {
      categories: [
        "Mtk",
        "B. Inggris",
        "IPA",
        "B. Indo",
        "Olahraga",
        "Fisika",
        "Kimia",
        "Sejarah",
        "P. Agama",
        "B. Arab",
      ],
    },
    plotOptions: {
      radar: {
        polygons: {
          strokeColor: "#e8e8e8",
          fill: {
            colors: ["#f8f8f8", "#fff"],
          },
        },
      },
    },
    legend: {
      markers: {
        fillColors: ["#50E3C2", "#FF4560", "#007bff"],
      },
    },
    markers: {
      size: 4,
      colors: ["#50E3C2", "#FF4560", "#007bff"],
      strokeColors: ["#fff", "#fff", "#fff"],
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
  };

  var chart = new ApexCharts(
    document.querySelector("#tingkat-pemahaman-siswa"),
    options
  );
  chart.render();
};

const jumlahSiswaBerdasarkanJurusanRow = () => {
  var options = {
    series: [
      {
        name: "X (10)",
        data: [44, 55, 41, 37],
      },
      {
        name: "XI (11)",
        data: [53, 32, 43, 32],
      },
      {
        name: "XII (12)",
        data: [12, 15, 11, 20],
      },
    ],
    chart: {
      type: "bar",
      height: 250,
      stacked: true,
      stackType: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    xaxis: {
      categories: ["TKJ", "TP", "TBSM", "TKR"],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + "K";
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  var chart = new ApexCharts(
    document.querySelector("#jumlah-siswa-berdasarkan-jurusan"),
    options
  );
  chart.render();
};

const dataPertumbuhanSiswa = {
  categories: ["2018", "2019", "2020", "2021", "2022", "2023", "2024"],
  series: [
    {
      name: "Pertumbuhan Siswa",
      data: [120, 100, 120, 80, 150, 200, 176],
    },
  ],
};
const dataPertumbuhanSiswa1 = {
  categories: [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
    "2024",
  ],
  series: [
    {
      name: "Pertumbuhan Siswa",
      data: [120, 100, 120, 80, 150, 200, 92, 136, 189, 236],
    },
  ],
};

const chartJenisKelamin = () => {
  const options = {
    chart: {
      type: "pie",
    },
    labels: data.labels,
    series: data.series,
    colors: ["#FF4560", "#50E3C2"],
    legend: {
      position: "right",
      horizontalAlign: "center",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 400,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 9999,
        options: {
          chart: {
            height: 150,
          },
          legend: {
            position: "right",
          },
        },
      },
    ],
  };

  const chart = new ApexCharts(
    document.querySelector("#chart-jenis-kelamin"),
    options
  );
  chart.render();
};

const kinerjaSiswaDalamUjian = () => {
  var options = {
    series: [
      {
        name: "Waktu",
        type: "column",
        data: [27, 24, 30, 27, 13, 22, 29, 21, 18, 22, 30],
      },
      {
        name: "Nilai",
        type: "area",
        data: [90, 76, 98, 67, 76, 88, 45, 56, 89, 43, 99],
      },
      {
        name: "Jawaban Benar",
        type: "line",
        data: [45, 38, 49, 33, 38, 44, 22, 28, 44, 22, 45],
      },
    ],
    chart: {
      type: "line",
      stacked: false,
    },
    stroke: {
      width: [0, 2, 5],
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },

    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [
      "2015",
      "2016",
      "2017",
      "2018",
      "2019",
      "2020",
      "2021",
      "2022",
      "2023",
      "2024",
      "2025",
    ],
    markers: {
      size: 0,
    },
    yaxis: {
      title: {
        text: "Points",
      },
      min: 0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 260,
          },
        },
      },
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 283,
          },
        },
      },
      {
        breakpoint: 9999,
        options: {
          chart: {
            height: 329,
          },
        },
      },
    ],
  };

  var chart = new ApexCharts(
    document.querySelector("#kinerja-siswa-dalam-ujian"),
    options
  );
  chart.render();
};

const data = {
  labels: ["Laki-laki", "Perempuan"],
  series: [40, 60],
};

const browserData = {
  categories: ["Chrome", "Google", "Bing", "Opera", "Kiwi Browser"],
  series: [56, 17, 12, 21, 14],
};

var dataSekolah = [50, 500, 20];
