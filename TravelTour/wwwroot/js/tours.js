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
            btn.find('i').removeClass('fa-star-o').addClass('fa-star');
            addToFavorites(city);
            showNotification('به علاقه مندی ها اضافه شد', 'success');
        } else {
            btn.find('i').removeClass('fa-star').addClass('fa-star-o');
            removeFromFavorites(city);
            showNotification('از علاقه مندی ها حذف شد ', 'info');
        }

        updateFavoritesCount();
    });

    // Manage filters - AJAX version
    $('.tour-filter-btn').click(function (e) {
        e.preventDefault();
        var btn = $(this);
        var filter = btn.data('filter');

        $('.tour-filter-btn').removeClass('active');
        btn.addClass('active');

        // درخواست AJAX برای فیلتر کردن در سرور
        $.ajax({
            url: '/Tour/Index',
            type: 'GET',
            data: {
                filter: filter,
                pageNumber: 1,
                pageSize: 12
            },
            success: function (data) {
                // استخراج محتوای tour items از جواب
                var newContent = $(data).find('#tourContainer').html();

                if (newContent) {
                    // به‌روزرسانی محتوای صفحه
                    $('#tourContainer').html(newContent);

                    // دوباره attach کردن event listeners برای عناصر جدید
                    reattachEventListeners();

                    // اسکرول به بالا
                    $('html, body').animate({ scrollTop: $('#tours').offset().top - 100 }, 600);
                    showNotification('فیلتر اعمال شد', 'success');
                } else {
                    showNotification('خطا: محتوا پیدا نشد', 'warning');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX Error:', error);
                showNotification('خطا در اعمال فیلتر', 'danger');
            }
        });
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

    // Initialize hover effects
    attachCardHoverEffects();
});

// Function to attach hover effects to cards
function attachCardHoverEffects() {
    $('.tour-card').each(function () {
        var card = $(this);
        var image = card.find('.tour-image-container');

        card.off('mouseenter mouseleave'); // Remove old handlers

        card.on('mouseenter', function () {
            image.css('transform', 'scale(1.08)');
        });

        card.on('mouseleave', function () {
            image.css('transform', 'scale(1)');
        });
    });
}

// Function to reattach all event listeners after AJAX load
function reattachEventListeners() {
    // Reattach hover effects
    attachCardHoverEffects();

    // Reattach favorite button handlers
    $('.tour-favorite-btn').off('click').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var btn = $(this);
        var city = btn.data('city');

        btn.toggleClass('active');
