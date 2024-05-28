// filter data table

const selectJenjang = document.getElementById("select-jenjang");
const selectJurusan = document.getElementById("select-jurusan");
const box = document.getElementById("toggleBox");
const selectKelas = document.getElementById("select-kelas");

const toggleBox = () => {
  box.classList.toggle("show");
};

const filter = () => {
  const isSemuaKelas = selectKelas.value === "semua kelas";
  selectJenjang.disabled = !isSemuaKelas;
  selectJurusan.disabled = !isSemuaKelas;
  selectJenjang.selectedIndex = isSemuaKelas ? 0 : 0;
  selectJurusan.selectedIndex = isSemuaKelas ? 0 : 0;
}

const columns = [
  { data: "nama" },
  { data: "nis" },
  { data: "kelas" },
  { data: "program_keahlian" },
  { data: "email" },
]

const applyFilter = () => {
  const selectedValues = {};
  if (selectKelas.value === "semua kelas") {
    if (selectJenjang.value === "" && selectJurusan.value === "") {
      console.log('default');
      box.classList.toggle("show");
    } else {
      if (selectJenjang.value !== "") {
        selectedValues['jenjang_kelas'] = selectJenjang.value;
      }
      if (selectJurusan.value !== "") {
        selectedValues['program_keahlian'] = selectJurusan.value;
      }
      console.log(selectedValues);
      const queryString = Object.keys(selectedValues).map(key => key + '=' + encodeURIComponent(selectedValues[key])).join('&');
      const newUrl = '/api/get/data/siswa?' + queryString;
      console.log(newUrl);
      // Panggil fungsi datatables dengan URL yang baru
      reloadDataTable(newUrl);
      box.classList.toggle("show");
    }
  } else {
    selectedValues['kelas'] = selectKelas.value;
    console.log("Data Dipilih: " + selectKelas.value);
    const queryString = Object.keys(selectedValues).map(key => key + '=' + encodeURIComponent(selectedValues[key])).join('&');
    const newUrl = '/api/get/data/siswa?' + queryString;
    console.log(newUrl);
    // Panggil fungsi datatables dengan URL yang baru
    reloadDataTable(newUrl);
    box.classList.toggle("show");
  }
}

const reloadDataTable = (newUrl) => {
  // Jika DataTable sudah diinisialisasi, hancurkan terlebih dahulu
  if ($.fn.DataTable.isDataTable('#table-data')) {
    $('#table-data').DataTable().destroy();
  }

  // Inisialisasi ulang DataTable dengan URL baru
  datatables(columns, 'Siswa', newUrl, false, viewButton, editButton, deleteButton);
}
