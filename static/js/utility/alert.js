
// alert confirmasi
const overlay = document.getElementById('overlay'),
      confirm = document.getElementById('confirm-popup'),
      confirmInput = document.getElementById('input-confirm-popup')

const showAlert = (tipe) => {
  overlay.style.display = 'block';
  
  if ( tipe == 'input' ) {
      confirmInput.style.display = 'block';
  } else {
      confirm.style.display = 'block';
  }
};
const closeAlert = () => {
  overlay.style.display = 'none';
  confirm.style.display = 'none';
  confirmInput.style.display = 'none'
}

const success = (message, position = 'center', status = 'success', timer = 1500) => {
  Swal.fire({
    position: position,
    icon: status,
    title: message,
    showConfirmButton: false,
    timer: timer
  });
}

const alert = () => {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: "<strong>Informasi Penting!</strong>",
      icon: "info",
      html: `
        Demi Keamanan, Aplikasi Ini Memerlukan Izin Lokasi, mohon izinkan untuk melanjutkan.
      `,
      showCloseButton: false,
      showCancelButton: false,
      focusConfirm: true,
      confirmButtonText: `
        <i class="bi bi-hand-thumbs-up"></i> Great!
      `,
      confirmButtonAriaLabel: "Thumbs up, great!"
    }).then((result) => {
      if(result.isConfirmed) {
        getLocation()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
      }
    }).catch((err) => {
      reject(false)
    });
  })
}
const alertBs5 = (status, message) => {
  let temp_html = `
                    <div class="alert alert-${status} d-flex align-items-center" role="alert">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                        viewBox="0 0 16 16"
                        role="img"
                        aria-label="Warning:"
                      >
                        <path
                          d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"
                        />
                      </svg>
                      <div>${message}</div>
                    </div>`

  document.getElementById('alert-container').innerHTML = temp_html;
}