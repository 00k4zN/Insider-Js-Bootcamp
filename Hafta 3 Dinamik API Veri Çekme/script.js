$(document).ready(function() {
    let start = 0;
    const limit = 5;
    const postContainer = $("#postContainer");
    const loadingIndicator = $("#loading");

    function loadPosts() {
        loadingIndicator.show();
        $.get(`https://jsonplaceholder.typicode.com/posts?_start=${start}&_limit=${limit}`)
            .done(function(posts){
                posts.forEach(post => {
                    postContainer.append(`<div class="post"><h3>${post.title}</h3><p>${post.body}</p></div>`);
                });
                start += limit;
            })
            .fail(function() {
                alert("Veri Yüklenirken Hata Oluştu!");
            })
            .always(function() {
                loadingIndicator.hide();
            });
    }
    
    loadPosts();
    $(window).scroll(function() {
        // eğer sayfanın altına doğru scroll yapılıyorsa ve %50 kaldıysa yeni postları yükler.
        if ($(window).scrollTop() + $(window).height() >= $(document).height() - 50) {
            loadPosts();
        }
    });
});