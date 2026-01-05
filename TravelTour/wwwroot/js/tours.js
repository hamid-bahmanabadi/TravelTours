$(document).ready(function () {

    loadFavorites();
    updateFavoritesCount();

    // Favorite button
    $('.tour-favorite-btn').on('click', favoriteClickHandler);

    // Filter buttons (AJAX)
    $('.tour-filter-btn').on('click', function (e) {
        e.preventDefault();

        var btn = $(this);
        var filter = btn.data('filter');

        $('.tour-filter-btn').removeClass('active');
        btn.addClass('active');

        $.ajax({
            url: '/Tour/Index',
            type: 'GET',
            data: {
                filter: filter,
                pageNumber: 1,
                pageSize: 12
            },
            success: function (data) {
                var newContent = $(data).find('#tourContainer').html();

                if (newContent) {
                    $('#tourContainer').html(newContent);
                    reattachEventListeners();

                    $('html, body').animate({
                        scrollTop: $('#tours').offset().top - 100
                    }, 600);
                }
            },
            error: function () {
                console.error('AJAX Error');
            }
        });
    });

    // Back to top
    $(window).on('scroll', function () {
        $('.tour-back-to-top')
            .toggleClass('visible', $(window).scrollTop() > 300);
    });

    $('.tour-back-to-top').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    attachCardHoverEffects();
});


// ================= FUNCTIONS =================

function favoriteClickHandler(e) {
    e.preventDefault();
    e.stopPropagation();

    var btn = $(this);
    var city = btn.data('city');

    btn.toggleClass('active');

    if (btn.hasClass('active')) {
        btn.find('i').removeClass('fa-star-o').addClass('fa-star');
        addToFavorites(city);
    } else {
        btn.find('i').removeClass('fa-star').addClass('fa-star-o');
        removeFromFavorites(city);
    }

    updateFavoritesCount();
}

function attachCardHoverEffects() {
    $('.tour-card').each(function () {
        var card = $(this);
        var image = card.find('.tour-image-container');

        card.off('mouseenter mouseleave');

        card.on('mouseenter', function () {
            image.css('transform', 'scale(1.08)');
        });

        card.on('mouseleave', function () {
            image.css('transform', 'scale(1)');
        });
    });
}

function reattachEventListeners() {
    attachCardHoverEffects();

    $('.tour-favorite-btn')
        .off('click')
        .on('click', favoriteClickHandler);
}


// ===== Dummy functions (اگر قبلاً داری حذف کن) =====
function loadFavorites() { }
function updateFavoritesCount() { }
function addToFavorites(city) { }
function removeFromFavorites(city) { }




