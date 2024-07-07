document.addEventListener("DOMContentLoaded", function() {
    const toggleShow = document.querySelectorAll(".toggle-show");
    const toggleHide = document.getElementById("toggle-hide");
    const sidebar = document.getElementById("sidebar-profile");

    // Event listener untuk toggle
    toggleShow.forEach(show => {
        toggleHide.addEventListener('click', () => {
            sidebar.classList.remove("d-block");
            show.style.display = 'block';
        })
        show.addEventListener("click", function() {
            sidebar.classList.add("d-block");
            show.style.display = 'none';
    
            // if (sidebar.classList.contains("d-block")) {
            //     toggle.style.display = 'none'
            //     toggle.style.left = "0px";
            //     sidebar.classList.add("d-none");
            //     setTimeout(() => {
            //         toggle.style.display = 'flex'
            //     }, 200)
            // } else {
            //     sidebar.classList.remove("d-none");
            //     toggle.classList.add("toggle-active");
            //     toggle.style.display = 'none'
            //     toggle.style.left = "235px";
            //     sidebar.classList.add("d-block");
            //     setTimeout(() => {
            //         toggle.style.display = 'flex'
            //     }, 200)
            // }
        });
    })

    $(document).ready(function() {
        $(".sidebar-menu").click(function() {
            const dataType = $(this).attr('data-type');
            if( dataType == 'profile' ) {
                console.log('profile');
                $('#aktifitas-pengguna').hide()
                $('#profile').show()
            } else if ( dataType == 'aktifitas-pengguna') {
                console.log('aktifitas pengguna');
                $('#profile').hide()
                $('#toggle-profile-menu').show()
                $('#aktifitas-pengguna').show()
            }
            $(this).siblings().find("a").removeClass("active");
            $(this).find("a").addClass("active");
        });
    });
    const subMenus = document.querySelectorAll('.sub-menu');
    const mInformasiPribadi = document.getElementById('m-informasi-pribadi');
    const keamananPage = document.getElementById('keamanan');
    const pengaturanProfile = document.getElementById('pengaturan-profile')
    const pengaturanSekolah = document.getElementById('pengaturan-profile')
    subMenus.forEach((subMenu) => {
    subMenu.addEventListener('click', () => {
        subMenus.forEach((otherSubMenu) => {
        otherSubMenu.classList.remove('active');
        });
        const dataType = subMenu.getAttribute('data-type');
        if( dataType == 'informasi-pribadi' ) {
            keamananPage.style.display = 'none';
            pengaturanProfile.style.display = 'none';
            pengaturanSekolah.style.display = 'none'

            
            console.log('object');
            mInformasiPribadi.style.display = 'block';
        } else if ( dataType == 'pengaturan-profile' ) {
            mInformasiPribadi.style.display = 'none';
            keamananPage.style.display = 'none';
            pengaturanSekolah.style.display = 'none'

            console.log('ajn');
            pengaturanProfile.style.display = 'block';
        } else if ( dataType == 'keamanan' ) {
            pengaturanProfile.style.display = 'none';
            mInformasiPribadi.style.display = 'none';
            pengaturanSekolah.style.display = 'none'
            
            
            console.log('oct');
            keamananPage.style.display = 'block';
        } else if ( dataType == 'pengaturan-sekolah' ) {
            pengaturanProfile.style.display = 'none';
            mInformasiPribadi.style.display = 'none';
            keamananPage.style.display = 'none';

            console.log('kl');
            pengaturanSekolah.style.display = 'block'
        }
        subMenu.classList.add('active');
        
    });
    });


});

