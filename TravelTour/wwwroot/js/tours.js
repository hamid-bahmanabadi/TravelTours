$(document).ready(function () {

    loadFavorites();
    updateFavoritesCount();

    // Manage favorites
    $('.tour-favorite-btn').click(function (e) {
        e.preventDefault();
        e.stopPropagation();

        var btn = $(this);
        var city = btn.data('city');

        btn.toggleClass('active');

        if (btn.hasClass('active')) {
            btn.find('i').removeClass('fa-star').addClass('fa-star');
            addToFavorites(city);
            showNotification('به علاقه مندی ها اضافه شد', 'success');
        } else {
            btn.find('i').removeClass('fa-star').addClass('fa-star');
            removeFromFavorites(city);
            showNotification('از علاقه مندی ها حذف شد ', 'info');
        }

        updateFavoritesCount();
    });

    // Manage filters
    $('.tour-filter-btn').click(function (e) {
        e.preventDefault();
        var btn = $(this);
        var filter = btn.data('filter');

        $('.tour-filter-btn').removeClass('active');
        btn.addClass('active');

        // Filter cards
        filterTours(filter);
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            $('.tour-back-to-top').addClass('visible');
        } else {
            $('.tour-back-to-top').removeClass('visible');
        }
    });

    $('.tour-back-to-top').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    $('.tour-card').each(function () {
        var card = $(this);
        var image = card.find('.tour-image-container');

        card.on('mouseenter', function () {
            image.css('transform', 'scale(1.08)');
        });

        card.on('mouseleave', function () {
            image.css('transform', 'scale(1)');
        });
    });

});

// Function to filter tours
function filterTours(filter) {
    var tourItems = $('.tour-item');

    tourItems.hide();

    switch (filter) {
        case 'all':
            tourItems.show();
            break;

        case 'cheap':
            tourItems.filter('[data-category*="cheap"]').show();
            break;

        case 'expensive':
            tourItems.filter('[data-category*="expensive"]').show();
            break;

        case 'plane':
            tourItems.filter('[data-type*="plane"]').show();
            break;

        case 'train':
            tourItems.filter('[data-type*="train"]').show();
            break;

        case 'sea':
            tourItems.filter('[data-type*="sea"]').show();
            break;

        case 'combo':
            var comboItems = tourItems.filter('[data-type*="combo"], [data-category*="combo"]');
            comboItems.show();

            if (comboItems.length === 0) {
                showNotification('No combo tours available!', 'warning');

                setTimeout(function () {
                    tourItems.show();
                    $('.tour-filter-btn[data-filter="all"]').addClass('active');
                    $('.tour-filter-btn[data-filter="combo"]').removeClass('active');
                }, 1500);
            }
            break;

        case 'favorites':
            var favorites = getFavorites();
            tourItems.each(function () {
                var city = $(this).find('.tour-favorite-btn').data('city');
                if (favorites.includes(city)) {
                    $(this).show();
                }
            });

            if ($('.tour-item:visible').length === 0) {
                showNotification('هیچ توری در لیست علاقه‌مندی‌ها وجود ندارد', 'warning');
            }
            break;
    }
}

// Manage favorites
function getFavorites() {
    return JSON.parse(localStorage.getItem('tourFavorites') || '[]');
}

function addToFavorites(city) {
    var favorites = getFavorites();
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('tourFavorites', JSON.stringify(favorites));
    }
}

function removeFromFavorites(city) {
    var favorites = getFavorites();
    favorites = favorites.filter(function (f) {
        return f !== city;
    });
    localStorage.setItem('tourFavorites', JSON.stringify(favorites));
}

function loadFavorites() {
    var favorites = getFavorites();
    favorites.forEach(function (city) {
        $('.tour-favorite-btn[data-city="' + city + '"]').each(function () {
            $(this).addClass('active');
            $(this).find('i').removeClass('fa-star').addClass('fa-star');
        });
    });
}

function updateFavoritesCount() {
    var favoritesCount = getFavorites().length;
    $('.favorites-count').text(favoritesCount);
}

function showNotification(message, type) {
    var alertClass = type === 'success' ? 'alert-success' :
        type === 'info' ? 'alert-info' :
            type === 'warning' ? 'alert-warning' : 'alert-danger';
    var icon = type === 'success' ? 'fa-check-circle' :
        type === 'info' ? 'fa-info-circle' :
            type === 'warning' ? 'fa-exclamation-triangle' : 'fa-times-circle';

    $('.tour-notification').remove();

    var notification = $(
        '<div class="alert ' + alertClass + ' alert-dismissible fade show tour-notification" role="alert">' +
        '<div class="d-flex align-items-center">' +
        '<div class="flex-grow-1">' + message + '</div>' +
        '</button>' +
        '</div>' +
        '</div>'
    );

    $('body').append(notification);

    setTimeout(function () {
        notification.remove();
    }, 3000);
}