$(document).ready(function () {
    //rAstgele profiller
    $('#fetchProfiles').click(function () {
        // sshake efekti
        $(this).effect("shake", { distance: 10, times: 2 }, 500);
        
        // AJAX isteği
        $.ajax({
            url: 'https://randomuser.me/api/?results=5',
            dataType: 'json',
            success: function (data) {
                //içeriği temizle
                $('.profile-container').empty();
                
                //slider'ı temizle ve yeniden başlat: eğer slider başlatılmışsa
                if ($('.slider').hasClass('slick-initialized')) {
                    $('.slider').slick('unslick');
                }
                $('.slider').empty();
                
                // Her kullanıcı için profil kartı oluştur
                data.results.forEach(function(user, index) {
                    // Profil kartı
                    const profileCard = `
                        <div class="profile-card">
                            <a href="#" data-fancybox data-src="#modal-${user.login.uuid}">
                                <img src="${user.picture.large}" alt="${user.name.first} ${user.name.last}">
                            </a>
                            <h3>${user.name.first} ${user.name.last}</h3>
                            <p class="email">${user.email}</p>
                            <p>${user.location.country}</p>
                            <p>${user.phone}</p>
                        </div>
                        
                        <!-- FancyBox Modal İçeriği -->
                        <div style="display:none;" id="modal-${user.login.uuid}" class="modal-content">
                            <h2>${user.name.first} ${user.name.last}</h2>
                            <img src="${user.picture.large}" alt="${user.name.first}" style="border-radius:50%; width:150px; margin:15px auto; display:block;">
                            <p><strong>Email:</strong> ${user.email}</p>
                            <p><strong>Ülke:</strong> ${user.location.country}</p>
                            <p><strong>Şehir:</strong> ${user.location.city}</p>
                            <p><strong>Telefon:</strong> ${user.phone}</p>
                            <p><strong>Yaş:</strong> ${user.dob.age}</p>
                        </div>`;
                    
                    // Slider kartı
                    const sliderCard = `
                        <div>
                            <div class="slider-card">
                                <img src="${user.picture.large}" alt="${user.name.first}">
                                <h3>${user.name.first} ${user.name.last}</h3>
                                <p>${user.location.country}</p>
                            </div>
                        </div>`;
                    
                    // DOM'a ekle
                    $('.profile-container').append(profileCard);
                    $('.slider').append(sliderCard);
                    
                    // Animasyonlar için gecikme ekle
                    setTimeout(function() {
                        // Farklı animasyonlar
                        if (index % 3 === 0) {
                            $('.profile-card').eq(index).hide().fadeIn(800);
                        } else if (index % 3 === 1) {
                            $('.profile-card').eq(index).hide().slideDown(800);
                        } else {
                            $('.profile-card').eq(index).hide().animate({opacity: 1, top: 0}, 800);
                        }
                    }, index * 200);
                });
                
                // Slider bölümünü göster
                $('.slider-section').fadeIn(1000);
                
                // Slick Slider'ı başlat
                $('.slider').slick({
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    autoplay: true,
                    autoplaySpeed: 2500,
                    dots: true,
                    arrows: true,
                    centerMode: true,
                    centerPadding: '0',
                    responsive: [
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 2,
                                centerMode: false
                            }
                        },
                        {
                            breakpoint: 576,
                            settings: {
                                slidesToShow: 1,
                                centerMode: false
                            }
                        }
                    ]
                });
            },
            error: function() {
                alert('Profiller yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
            }
        });
    });
    
    // Hover efektleri
    $(document).on('mouseenter', '.profile-card', function() {
        $(this).fadeTo(200, 0.9).toggleClass('highlight');
    }).on('mouseleave', '.profile-card', function() {
        $(this).fadeTo(200, 1).toggleClass('highlight');
    });
    
    // Bounce efekti için
    $(document).on('click', '.profile-card', function() {
        $(this).addClass('bounce');
        setTimeout(() => $(this).removeClass('bounce'), 1000);
    });
});
