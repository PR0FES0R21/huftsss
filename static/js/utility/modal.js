// fungsi untuk memunculkan modal tambah guru
const showModal = (entities, action) => {
    
    // modal Popup
    var modal = document.getElementById("infoModal");
    var span = document.getElementsByClassName("close")[0];
    var out = document.getElementsByClassName("out")[0];

    span.onclick = () => {
        $('form')[0].reset()
        modal.style.display = "none"
    };
    out.onclick = () => {
        id = $('form').attr('id')
        entities = id.split('-')[2]
        if (entities == 'guru') {
            $('form')[0].reset()
        }
        modal.style.display = "none"
    };
    
    document.querySelector('#staticBackdropLabel').innerHTML = `${action} Data ${entities}`;
    // document.querySelector('.modal-body form').setAttribute('action', `/${action}/data/${entities}`);
    document.querySelector('form button[type=submit]').innerHTML = `${action} Data`
    modal.style.display = 'block'
}