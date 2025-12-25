$(document).ready(function () {
    console.log("سیستم رزرو تور بارگذاری شد");

    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    const validCities = ['tehran', 'mashhad', 'shiraz', 'esfahan', 'kish'];
    const referrer = document.referrer;

    const cameFromToursPage = referrer.includes('Tours') || referrer.includes('tours');

    const modalClosedForTourSelection = localStorage.getItem('modalClosedForTourSelection');
    const modalClosedTime = localStorage.getItem('modalClosedTime');
    const currentTime = new Date().getTime();

    const recentlyFromModal = modalClosedForTourSelection === 'true' &&
        modalClosedTime &&
        (currentTime - parseInt(modalClosedTime)) < 2 * 60 * 1000;

    if (!city || !validCities.includes(city)) {
        if (!cameFromToursPage) {
            showForcedTourSelectionModal();
            disableAllBookingFunctions();
            return;
        }
        else {
            showTourSelectionWarningModal();
            disableAllBookingFunctions();
            return;
        }
    }

    if (recentlyFromModal && (!city || !validCities.includes(city))) {
        showForcedTourSelectionModal();
        disableAllBookingFunctions();
        return;
    }

    localStorage.removeItem('modalClosedForTourSelection');
    localStorage.removeItem('modalClosedTime');

    cleanupBookingStatus();
    resetAllToDefault();
    setDefaultDates();

    $('.btn-next-step').click(handleNextStep);
    $('.btn-prev-step').click(handlePrevStep);
    $('#increaseCompanion').click(increaseCompanion);
    $('#decreaseCompanion').click(decreaseCompanion);
    $('#applyDiscount').click(applyDiscount);
    $('.btn-save-draft').click(saveDraft);
    $('.btn-print').click(printBookingInfo);
    $('.btn-help').click(showHelp);
    $('#bookingForm').submit(handleFormSubmit);

    $('#completePaymentButton').click(completePayment);
    $('#newBookingButton').click(startNewBooking);

    $('#tourDays, #groupType, #transportType').change(function () {
        updateTourDetails();
        calculateTourPrice(false);
    });

    $('#bookingForm input, #bookingForm select').on('change input', function () {
        calculateTourPrice(false);
    });

    loadDraft();

    setTimeout(() => {
        loadInitialTourInfo();
    }, 100);
});

function showForcedTourSelectionModal() {
    $('#forcedTourModal, #tourWarningModal').remove();
    $('.modal-backdrop').remove();

    localStorage.setItem('modalClosedForTourSelection', 'true');
    localStorage.setItem('modalClosedTime', new Date().getTime().toString());

    const modalHtml = `
        <div class="modal fade show d-block" id="forcedTourModal" tabindex="-1" 
             style=" z-index: 999999; position: fixed; top: 0; left: 0; right: 0; bottom: 0;" 
             data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-dialog-centered" style="max-width: 500px;">
                <div class="modal-content" style="border-radius: 12px; border: 3px solid #00CED1;">
                    <div class="modal-header" style="background-color: #00CED1; border-bottom: 2px solid #009fa3; border-radius: 9px 9px 0 0;">
                       
                    </div>
                    <div class="modal-body text-center py-4" style="background-color: #f8f9fa;">
                        <div class="mb-4">
                            <i class="fas fa-map-marked-alt fa-4x" style="color: #00CED1;"></i>
                        </div>
                        <h4 style="color: #333; margin-bottom: 15px; font-weight: bold;"> ابتدا تور خود را انتخاب کنید</h4>
                        <p style="color: #666; line-height: 1.6; font-size: 16px;">
                            برای استفاده از سیستم رزرو، باید ابتدا از صفحه تورها، تور مورد نظر خود را انتخاب نمایید.
                            <br>
                            <strong style="color: #00CED1;">این صفحه تا زمانی که تور انتخاب نکنید، غیرفعال می‌ماند.</strong>
                        </p>
                        
                        <div class="alert alert-info mt-4 text-right" style="border-right: 4px solid #00CED1;">
                            پس از انتخاب تور، به صورت خودکار به صفحه رزرو هدایت می‌شوید.
                        </div>
                        
                        <div class="mt-4 pt-3">
                            <a href="/Home/Tours" class="btn btn-lg" id="goToToursButton"
                               style="background-color: #00CED1; color: white; border: none; padding: 12px 40px; font-weight: bold; border-radius: 8px;">
                                <i class="fas fa-globe-americas ml-2"></i>
                                مشاهده و انتخاب تورها
                            </a>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show" style="z-index: 999998;"></div>
    `;

    $('body').append(modalHtml);

    $('body').addClass('modal-open');
    $('body').css('overflow', 'hidden');

    $('#goToToursButton').click(function () {
        localStorage.setItem('modalClosedForTourSelection', 'true');
        localStorage.setItem('modalClosedTime', new Date().getTime().toString());
    });

    $(document).on('click', '.modal-backdrop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showTemporaryWarning('این مودال قابل بستن نیست. لطفاً تور انتخاب کنید.');
        return false;
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            e.preventDefault();
            e.stopPropagation();
            showTemporaryWarning('این مودال قابل بستن نیست. لطفاً تور انتخاب کنید.');
            return false;
        }
    });
}

//  مودال هشدار برای زمانی که از تورها آمده ولی شهر معتبر نیست 
function showTourSelectionWarningModal() {
    $('#forcedTourModal, #tourWarningModal').remove();
    $('.modal-backdrop').remove();

    const modalHtml = `
        <div class="modal fade show d-block" id="tourWarningModal" tabindex="-1" 
             style="background-color: rgba(0,0,0,0.9); z-index: 999999;">
            <div class="modal-dialog modal-dialog-centered" style="max-width: 500px;">
                <div class="modal-content" style="border-radius: 12px; border: 3px solid #ffc107;">
                    <div class="modal-header" style="background-color: #ffc107; border-bottom: 2px solid #e0a800;">
                        <h5 class="modal-title" style="color: #212529; font-weight: bold;">
                            تور انتخاب شده معتبر نیست
                        </h5>
                       
                    </div>
                    <div class="modal-body text-center py-4">
                        <div class="mb-4">
                            <i class="fas fa-map-signs fa-4x" style="color: #ffc107;"></i>
                        </div>
                        <p style="color: #666; line-height: 1.6;">
                            لطفاً از صفحه تورها، یک تور معتبر انتخاب کنید.
                        </p>
                        
                        <div class="mt-4 pt-3">
                            <a href="/Home/Tours" class="btn btn-lg" 
                               style="background-color: #ffc107; color: #212529; border: none; padding: 12px 40px; font-weight: bold; border-radius: 8px;">
                                <i class="fas fa-arrow-right ml-2"></i>
                                بازگشت به صفحه تورها
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;

    $('body').append(modalHtml);

    $('#tourWarningModal .close').click(function () {
        $('#tourWarningModal').remove();
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open');
        $('body').css('overflow', '');
    });
}

function disableAllBookingFunctions() {
    $('#bookingForm').addClass('form-disabled');
    $('#bookingForm input, #bookingForm select, #bookingForm textarea, #bookingForm button').prop('disabled', true).css('cursor', 'not-allowed');

    $('.btn-next-step, .btn-prev-step').prop('disabled', true).css('cursor', 'not-allowed');

    $('#applyDiscount, #completePaymentButton, .btn-save-draft, .btn-print, .btn-help, #newBookingButton').prop('disabled', true).css('cursor', 'not-allowed');

    $('#completePaymentButton, #newBookingButton').addClass('d-none');

    $('.booking-price-section').css({
        'opacity': '0.5',
        'pointer-events': 'none'
    });

    $('#tourFutureInfo').html(`
        <div class="text-center py-5" style="color: #666;">
            <i class="fas fa-lock fa-3x mb-3"></i>
            <h5>منتظر انتخاب تور</h5>
            <p>لطفاً ابتدا از صفحه تورها، یک تور را انتخاب کنید</p>
        </div>
    `);

    $('#basePrice, #taxAmount, #totalPrice, #tourPrice, #summaryFinalPrice').text('---');
    $('#selectedCity, #selectedTourTitle, #selectedDuration, #selectedTransport, #selectedGroupType, #selectedPassengers').text('---');
    $('#summaryTour, #summaryCity').text('---');
    $('#tourServices').empty();
    $('#discountCode').val('').prop('disabled', true);
    $('#applyDiscount').prop('disabled', true).text('ابتدا تور را انتخاب کنید');

    if (!$('.tour-selection-message').length) {
        $('.booking-page').prepend(`
            <div class="alert alert-warning tour-selection-message text-center mt-4">
                <i class="fas fa-exclamation-triangle ml-2"></i>
                <strong>برای ادامه رزرو، لطفاً ابتدا از صفحه تورها، یک تور را انتخاب کنید.</strong>
            </div>
        `);
    }
}

function showTemporaryWarning(message) {
    $('.temp-warning').remove();

    const warningHtml = `
        <div class="temp-warning alert alert-warning" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 1000000; max-width: 400px;">
            <i class="fas fa-info-circle ml-2"></i> ${message}
        </div>
    `;

    $('body').append(warningHtml);

    setTimeout(() => {
        $('.temp-warning').fadeOut(300, function () {
            $(this).remove();
        });
    }, 2000);
}


function cleanupBookingStatus() {
    const bookingStatus = localStorage.getItem('bookingStatus');
    const bookingConfirmed = localStorage.getItem('bookingConfirmed');

    if (bookingStatus === 'booked' && bookingConfirmed !== 'true') {
        console.log('وضعیت رزرو ناسازگار یافت شد. پاکسازی...');
        localStorage.removeItem('bookingStatus');
        localStorage.removeItem('bookingTrackingCode');
        localStorage.removeItem('finalPrice');
    }

    if (bookingConfirmed === 'true') {
        const hasFormData = localStorage.getItem('bookingDraft');
        if (!hasFormData) {
            console.log('وضعیت تأیید بدون اطلاعات فرم یافت شد. پاکسازی...');
            localStorage.removeItem('bookingConfirmed');
        }
    }
}

function resetAllToDefault() {
    $('#basePrice').text('---');
    $('#taxAmount').text('---');
    $('#totalPrice').text('---');
    $('#tourPrice').text('---');
    $('#summaryFinalPrice').text('---');

    $('#selectedCity').text('---');
    $('#selectedTourTitle').text('---');
    $('#selectedDuration').text('---');
    $('#selectedTransport').text('---');
    $('#selectedGroupType').text('---');
    $('#selectedPassengers').text('---');
    $('#summaryTour').text('---');
    $('#summaryCity').text('---');

    $('.total-passengers-count').text('1 نفر');

    $('#tourServices').empty();

    $('#discountCode').val('');
    $('#applyDiscount').prop('disabled', true).text('ابتدا تور را انتخاب کنید');
    $('.price-row.discount').remove();

    $('#tourFutureInfo').html('<div class="loading-text"><i class="fa fa-spinner fa-spin"></i> در حال دریافت اطلاعات تور...</div>');

    $('#completePaymentButton').addClass('d-none');

    $('#newBookingButton').addClass('d-none');

    $('#bookingForm').removeClass('form-disabled');
    $('.btn-next-step, .btn-prev-step').prop('disabled', false);

    $('.booking-discount').removeClass('d-none');

    $('.price-disclosure-message').remove();
    $('.booked-success-message').remove();
    $('.booking-price-section').removeClass('booked-section');
    $('.booking-price-header h5').text('قیمت نهایی');
}

function showPriceSection() {
    const priceMessage = `
        <div class="price-disclosure-message">
            <p>قیمت نهایی پس از تأیید اطلاعات و کلیک بر روی "تکمیل رزرو"درپایین صفحه محاسبه خواهد شد</p>
        </div>
    `;

    if (!$('.price-disclosure-message').length) {
        $('.booking-price-section').prepend(priceMessage);
    }
}

function loadInitialTourInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');

    if (!city || city === 'undefined' || city === 'null' || city.trim() === '') {
        return;
    }

    const validCities = ['tehran', 'mashhad', 'shiraz', 'esfahan', 'kish'];

    if (!validCities.includes(city)) {
        return;
    }

    updateCityInfo(city);
    setupSeaTransportRestriction();
    updateTourDetails();

    loadTourFutureInfo(city);

    setTimeout(() => {
        calculateTourPrice(false);
    }, 500);
}

function loadTourFutureInfo(city) {
    const tourFutureData = {
        'tehran': {
            title: 'تور طلایی تهران',
            description: 'تور کامل پایتخت با بازدید از کاخ‌ها، موزه‌ها و مراکز خرید لوکس',
            highlights: [
                'بازدید از کاخ گلستان و سعدآباد',
                'گردش در بازار بزرگ تهران',
                'بازدید از برج میلاد',
                'تفریح در دربند و درکه'
            ],
            itinerary: 'روز ۱: ورود - روز ۲-۴: تهرانگردی - روز ۵: البرز - روز ۶: خروج',
            includes: 'اقامت در هتل ۵ ستاره، ترانسفر، راهنما، بیمه'
        },
        'mashhad': {
            title: 'تور معنوی مشهد',
            description: 'تور زیارتی-سیاحتی مشهد با زیارت حرم امام رضا(ع) و بازدید از جاذبه‌ها',
            highlights: [
                'زیارت حرم مطهر امام رضا(ع)',
                'بازدید از پارک کوهسنگی',
                'گردش در باغ ملی',
                'خرید از بازار رضا'
            ],
            itinerary: 'روز ۱: ورود - روز ۲-۴: زیارت - روز ۵: نیشابور - روز ۶: خروج',
            includes: 'اقامت در هتل نزدیک حرم، ترانسفر، راهنما، بیمه'
        },
        'shiraz': {
            title: 'تور فرهنگی شیراز',
            description: 'تور فرهنگ و تاریخ شیراز با بازدید از آثار تاریخی و باغ‌های زیبا',
            highlights: [
                'بازدید از حافظیه و سعدیه',
                'گردش در باغ ارم و نارنجستان',
                'بازدید از تخت جمشید',
                'دیدن پاسارگاد و نقش رستم'
            ],
            itinerary: 'روز ۱: ورود - روز ۲-۴: شیرازگردی - روز ۵: تخت جمشید - روز ۶: خروج',
            includes: 'اقامت در هتل سنتی، ترانسفر، راهنما، بیمه'
        },
        'esfahan': {
            title: 'تور هنری اصفهان',
            description: 'تور هنر و معماری اصفهان با بازدید از میدان نقش جهان و پل‌های تاریخی',
            highlights: [
                'بازدید از میدان نقش جهان',
                'گردش در سی وسه پل و پل خواجو',
                'بازدید از کاخ چهلستون',
                'دیدن منارجنبان و کلیسای وانک'
            ],
            itinerary: 'روز ۱: ورود - روز ۲-۴: اصفهانگردی - روز ۵: کاشان - روز ۶: خروج',
            includes: 'اقامت در هتل سنتی، ترانسفر، راهنما، بیمه'
        },
        'kish': {
            title: 'تور دریایی کیش',
            description: 'تور تفریحی-دریایی کیش با فعالیت‌های آبی و خرید',
            highlights: [
                'قایق‌سواری و جت اسکی',
                'شیرجه و غواصی',
                'خرید از مراکز خرید',
                'تور جزیره هندورابی'
            ],
            itinerary: 'روز ۱: ورود - روز ۲-۴: تفریحات دریایی - روز ۵: خرید - روز ۶: خروج',
            includes: 'اقامت در هتل ساحلی، ترانسفر دریایی، راهنما، بیمه'
        }
    };

    const tourInfo = tourFutureData[city] || {
        title: 'تور سفارشی',
        description: 'تور ویژه با توجه به شهر انتخاب شده',
        highlights: ['اقامت در هتل مناسب', 'ترانسفر', 'راهنمای تور', 'بیمه مسافرتی'],
        itinerary: 'روز ۱: ورود - روز ۲-۵: بازدید - روز ۶: خروج',
        includes: 'اقامت، ترانسفر، راهنما، بیمه'
    };

    const tourFutureHtml = `
        <div class="tour-future-card">
            <h6>${tourInfo.title}</h6>
            <p class="tour-description">${tourInfo.description}</p>
            
            <div class="tour-highlights">
                <strong> نقاط برجسته:</strong>
                <ul>
                    ${tourInfo.highlights.map(item => `<li> ${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="tour-itinerary">
                <strong><i class="fa fa-calendar-alt"></i> برنامه سفر:</strong>
                <p>${tourInfo.itinerary}</p>
            </div>
            
            <div class="tour-includes">
                <strong> شامل:</strong>
                <p>${tourInfo.includes}</p>
            </div>
        </div>
    `;

    $('#tourFutureInfo').html(tourFutureHtml);
}

function updateTourDetails() {
    const tourDays = $('#tourDays option:selected').text();
    const groupType = $('#groupType').val();
    const transportType = $('#transportType').val();
    const companionCount = parseInt($('#companionCount').text()) || 0;

    const totalPassengers = 1 + companionCount;

    $('#selectedDuration').text(tourDays || '---');
    $('#selectedTransport').text(getTransportText(transportType) || '---');
    $('#selectedGroupType').text(getGroupTypeText(groupType) || '---');

    $('#selectedPassengers').text(`${totalPassengers} نفر`);

    $('.total-passengers-count').text(`${totalPassengers} نفر`);

    updateTransportIcon(transportType);
    updateTourServices(transportType);
    updatePaymentSummary();
}

function getTransportText(transportType) {
    const transportMap = {
        'air': 'هوایی',
        'land': 'زمینی',
        'sea': 'دریایی',
        'mixed': 'ترکیبی'
    };
    return transportMap[transportType] || '---';
}

function getGroupTypeText(groupType) {
    const groupTypeMap = {
        'group': 'گروهی',
        'private': 'خصوصی',
        'family': 'خانوادگی',
        'couple': 'زوج',
        'single': 'تک نفره'
    };
    return groupTypeMap[groupType] || '---';
}

function updateTransportIcon(transportType) {
    const iconElement = $('#tourTypeIcon');
    iconElement.removeClass('fa-plane fa-bus fa-ship fa-random');

    switch (transportType) {
        case 'air': iconElement.addClass('fa-plane'); break;
        case 'land': iconElement.addClass('fa-bus'); break;
        case 'sea': iconElement.addClass('fa-ship'); break;
        case 'mixed': iconElement.addClass('fa-random'); break;
        default: iconElement.addClass('fa-plane');
    }
}

function updateTourServices(transportType) {
    const servicesContainer = $('#tourServices');
    servicesContainer.empty();

    const baseServices = [
        '<li><i class="fa fa-check"></i> اقامت در هتل با صبحانه</li>',
        '<li><i class="fa fa-check"></i> راهنمای تور فارسی زبان</li>',
        '<li><i class="fa fa-check"></i> بیمه مسافرتی</li>',
        '<li><i class="fa fa-check"></i> بازدید از جاذبه‌های اصلی</li>'
    ];

    let transportServices = [];

    switch (transportType) {
        case 'air':
            transportServices = [
                '<li><i class="fa fa-plane"></i> پرواز رفت و برگشت</li>',
                '<li><i class="fa fa-car"></i> ترانسفر فرودگاهی</li>'
            ];
            break;
        case 'land':
            transportServices = [
                '<li><i class="fa fa-bus"></i> اتوبوس توریستی لوکس</li>',
                '<li><i class="fa fa-road"></i> جاده‌های بین شهری</li>'
            ];
            break;
        case 'sea':
            transportServices = [
                '<li><i class="fa fa-ship"></i> کشتی کروز لوکس</li>',
                '<li><i class="fa fa-umbrella-beach"></i> فعالیت‌های ساحلی</li>'
            ];
            break;
        case 'mixed':
            transportServices = [
                '<li><i class="fa fa-random"></i> ترکیب چند نوع حمل و نقل</li>',
                '<li><i class="fa fa-map-marked-alt"></i> برنامه‌ریزی انعطاف‌پذیر</li>'
            ];
            break;
    }

    [...transportServices, ...baseServices].forEach(service => {
        servicesContainer.append(service);
    });
}

function updateCityInfo(city) {
    const cityNames = {
        'tehran': 'تهران',
        'mashhad': 'مشهد',
        'shiraz': 'شیراز',
        'esfahan': 'اصفهان',
        'kish': 'کیش'
    };

    const tourTitles = {
        'tehran': 'تور طلایی تهران',
        'mashhad': 'تور معنوی مشهد',
        'shiraz': 'تور فرهنگی شیراز',
        'esfahan': 'تور هنری اصفهان',
        'kish': 'تور دریایی کیش'
    };

    $('#selectedCity').text(cityNames[city] || 'تهران');
    $('#selectedTourTitle').text(tourTitles[city] || 'تور سفارشی');
    $('#summaryTour').text(tourTitles[city] || 'تور سفارشی');
    $('#summaryCity').text(cityNames[city] || 'تهران');
}

function setupSeaTransportRestriction() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city') || 'tehran';
    const transportSelect = $('#transportType');
    const seaOption = transportSelect.find('option[value="sea"]');
    const seaHint = $('#seaTransportHint');

    if (city === 'kish') {
        seaOption.prop('disabled', false);
        seaHint.addClass('d-none');
    } else {
        seaOption.prop('disabled', true);
        seaHint.removeClass('d-none');
        if (transportSelect.val() === 'sea') {
            transportSelect.val('air');
            updateTourDetails();
        }
    }
}

function increaseCompanion() {
    let count = parseInt($('#companionCount').text());
    if (count < 10) {
        count++;
        $('#companionCount').text(count);
        addCompanionForm(count);
        updateCompanionsSummary();
        calculateTourPrice(false);
        updateTourDetails();
    } else {
        showNotification('حداکثر ۱۰ همراه قابل اضافه کردن است', 'warning');
    }
}

function decreaseCompanion() {
    let count = parseInt($('#companionCount').text());
    if (count > 0) {
        removeCompanionForm(count);
        count--;
        $('#companionCount').text(count);
        updateCompanionsSummary();
        calculateTourPrice(false);
        updateTourDetails();
    }
}

function addCompanionForm(index) {
    const formHtml = `
        <div class="companion-form" id="companion${index}">
            <div class="companion-header">
                <h6><i class="fa fa-user"></i> همراه ${index}</h6>
                <button type="button" class="btn btn-remove-companion" onclick="removeCompanion(${index})">
                    <i class="fa fa-times"></i> حذف
                </button>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="نام" id="companion${index}FirstName" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="نام خانوادگی" id="companion${index}LastName" required>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="کد ملی (۱۰ رقم)" id="companion${index}NationalCode" maxlength="10" required>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="تاریخ تولد" id="companion${index}BirthDate" required>
                    </div>
                </div>
            </div>
        </div>
    `;

    $('#companionsContainer').append(formHtml);
}

function removeCompanion(index) {
    $(`#companion${index}`).remove();
    const count = parseInt($('#companionCount').text()) - 1;
    $('#companionCount').text(count);
    updateCompanionsSummary();
    calculateTourPrice(false);
    updateTourDetails();
}

function updateCompanionsSummary() {
    const companionCount = parseInt($('#companionCount').text());
    const summaryContainer = $('#companionsSummaryList');

    if (companionCount === 0) {
        summaryContainer.html(`
            <div class="empty-summary">
                <i class="fa fa-users"></i>
                <p>هنوز همراهی اضافه نشده است</p>
            </div>
        `);
    } else {
        let summaryHtml = '<div class="companions-list">';

        for (let i = 1; i <= companionCount; i++) {
            const firstName = $(`#companion${i}FirstName`).val() || '---';
            const lastName = $(`#companion${i}LastName`).val() || '---';
            const nationalCode = $(`#companion${i}NationalCode`).val() || '---';

            summaryHtml += `
                <div class="companion-summary-item">
                    <div class="companion-number">${i}</div>
                    <div class="companion-info">
                        <strong>${firstName} ${lastName}</strong>
                        <small>کدملی: ${nationalCode}</small>
                    </div>
                </div>
            `;
        }

        summaryHtml += '</div>';
        summaryContainer.html(summaryHtml);
    }

    $('#summaryCompanionsCount').text(companionCount + ' نفر');

    const totalPassengers = 1 + companionCount;
    $('#summaryTotalPassengers').text(totalPassengers + ' نفر');
}

function calculateTourPrice(showImmediately = false) {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');

    if (!city || city === 'undefined' || city === 'null' || city.trim() === '') {
        resetAllToDefault();
        return;
    }

    const validCities = ['tehran', 'mashhad', 'shiraz', 'esfahan', 'kish'];

    if (!validCities.includes(city)) {
        resetAllToDefault();
        return;
    }

    const days = parseInt($('#tourDays').val()) || 10;
    const groupType = $('#groupType').val() || 'group';
    const transportType = $('#transportType').val() || 'air';
    const companionCount = parseInt($('#companionCount').text()) || 0;

    const totalPeople = 1 + companionCount;

    const cityPrices = {
        'tehran': { base: 2850000, perDay: 150000 },
        'mashhad': { base: 1950000, perDay: 120000 },
        'shiraz': { base: 2350000, perDay: 130000 },
        'esfahan': { base: 1850000, perDay: 110000 },
        'kish': { base: 3150000, perDay: 180000 }
    };

    const cityPrice = cityPrices[city] || cityPrices['tehran'];
    let basePriceForOne = cityPrice.base + (cityPrice.perDay * (days - 10));

    const groupMultipliers = {
        'group': 0.8,
        'private': 1.5,
        'family': 0.9,
        'couple': 1.0,
        'single': 1.3
    };

    const transportMultipliers = {
        'air': 1.4,
        'land': 1.0,
        'sea': 1.6,
        'mixed': 1.3
    };

    basePriceForOne *= groupMultipliers[groupType];
    basePriceForOne *= transportMultipliers[transportType];

    let totalPrice = 0;

    totalPrice += basePriceForOne;

    if (companionCount > 0) {
        for (let i = 1; i <= companionCount; i++) {
            totalPrice += (basePriceForOne * 0.85);
        }
    }

    totalPrice = Math.round(totalPrice / 1000) * 1000;

    const taxAmount = Math.round(totalPrice * 0.09);
    const finalPrice = totalPrice + taxAmount;

    $('#basePrice').data('calculated-price', totalPrice);
    $('#taxAmount').data('calculated-price', taxAmount);
    $('#totalPrice').data('calculated-price', finalPrice);

    $('#summaryFinalPrice').text(formatPrice(finalPrice) + ' تومان');

    if (showImmediately || localStorage.getItem('bookingConfirmed') === 'true') {
        $('#basePrice').text(formatPrice(totalPrice));
        $('#taxAmount').text(formatPrice(taxAmount));
        $('#totalPrice').text(formatPrice(finalPrice));
        $('#tourPrice').text(formatPrice(finalPrice));

        $('#applyDiscount').prop('disabled', false).text('اعمال');
    } else {
        $('#basePrice').text('---');
        $('#taxAmount').text('---');
        $('#totalPrice').text('---');
        $('#tourPrice').text('---');

        $('#applyDiscount').prop('disabled', true).text('ابتدا تور را انتخاب کنید');
    }
}

function updatePaymentSummary() {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city') || 'tehran';

    const cityNames = {
        'tehran': 'تهران',
        'mashhad': 'مشهد',
        'shiraz': 'شیراز',
        'esfahan': 'اصفهان',
        'kish': 'کیش'
    };

    const tourDays = $('#tourDays option:selected').text();
    const groupType = $('#groupType option:selected').text();
    const transportType = $('#transportType option:selected').text();
    const companionCount = parseInt($('#companionCount').text()) || 0;
    const totalPassengers = 1 + companionCount;

    $('#summaryTour').text($('#selectedTourTitle').text());
    $('#summaryCity').text(cityNames[city] || 'تهران');
    $('#summaryDuration').text(tourDays || '---');
    $('#summaryGroupType').text(groupType || '---');
    $('#summaryTransport').text(transportType || '---');
    $('#summaryTotalPassengers').text(totalPassengers + ' نفر');
}

function handleNextStep(e) {
    e.preventDefault();
    const nextStep = $(this).data('next');

    if (!validateCurrentStep()) {
        return;
    }

    if (nextStep === 'step3') {
        updateCompanionsSummary();
        updatePaymentSummary();
        loadTourFutureInfo(new URLSearchParams(window.location.search).get('city') || 'tehran');
    }

    $('.booking-form-step').removeClass('active');
    $('#' + nextStep).addClass('active');
    updateStepDisplay(nextStep);
}

function handlePrevStep(e) {
    e.preventDefault();
    const prevStep = $(this).data('prev');

    $('.booking-form-step').removeClass('active');
    $('#' + prevStep).addClass('active');
    updateStepDisplay(prevStep);
}

function validateCurrentStep() {
    const currentStep = $('.booking-form-step.active');
    let isValid = true;

    if (currentStep.attr('id') === 'step2') {
        const companionCount = parseInt($('#companionCount').text());

        for (let i = 1; i <= companionCount; i++) {
            const firstName = $(`#companion${i}FirstName`).val();
            const lastName = $(`#companion${i}LastName`).val();
            const nationalCode = $(`#companion${i}NationalCode`).val();

            if (!firstName || !lastName || !nationalCode) {
                isValid = false;
                $(`#companion${i}FirstName, #companion${i}LastName, #companion${i}NationalCode`).addClass('is-invalid');
            } else {
                $(`#companion${i}FirstName, #companion${i}LastName, #companion${i}NationalCode`).removeClass('is-invalid');
            }
        }
    }

    currentStep.find('input[required], select[required]').each(function () {
        if (!$(this).val().trim()) {
            $(this).addClass('is-invalid');
            isValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    if (!isValid) {
        showNotification('لطفا تمام فیلدهای ضروری را پر کنید', 'warning');
        return false;
    }

    return true;
}

function applyDiscount() {
    if (localStorage.getItem('bookingConfirmed') !== 'true') {
        showNotification('لطفا ابتدا اطلاعات تور را تکمیل کنید', 'warning');
        return;
    }

    const code = $('#discountCode').val().trim().toUpperCase();

    if (!code) {
        showNotification('لطفا کد تخفیف را وارد کنید', 'warning');
        $('#discountCode').focus();
        return;
    }

    const discounts = {
        'TOUR10': 0.10,
        'TRAVEL20': 0.20,
        'WELCOME15': 0.15,
        'GROUP25': 0.25,
        'FAMILY30': 0.30,
        'KISHSEA': 0.25,
        'FIRST5': 0.05
    };

    if (discounts[code]) {
        const discountPercent = discounts[code];
        const currentPriceNum = parsePrice($('#totalPrice').text());
        const discountAmount = Math.round(currentPriceNum * discountPercent);
        const finalPrice = currentPriceNum - discountAmount;

        $('#summaryFinalPrice').text(formatPrice(finalPrice) + ' تومان');
        $('#tourPrice').text(formatPrice(finalPrice));
        $('#totalPrice').text(formatPrice(finalPrice));

        $('#discountCode').prop('disabled', true);
        $('#applyDiscount').prop('disabled', true).text('تخفیف اعمال شد');

        showNotification(`تخفیف ${discountPercent * 100}% با موفقیت اعمال شد`, 'success');

        if (!$('#discountAmount').length) {
            $('.booking-price-details').append(`
                <div class="price-row discount">
                    <span>تخفیف:</span>
                    <span id="discountAmount">${formatPrice(discountAmount)}</span>
                </div>
            `);
        } else {
            $('#discountAmount').text(formatPrice(discountAmount));
        }

    } else {
        showNotification('کد تخفیف معتبر نیست', 'danger');
        $('#discountCode').addClass('is-invalid');
        $('#discountCode').focus();
    }
}

function formatPrice(price) {
    if (price === '---' || price === undefined || price === null) {
        return '---';
    }

    if (typeof price === 'number') {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    if (!isNaN(price)) {
        return parseInt(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return '---';
}

function parsePrice(priceString) {
    return parseInt(priceString.toString().replace(/,/g, '')) || 0;
}

function setDefaultDates() {
    const today = new Date();
    const persianDate = today.toLocaleDateString('fa-IR');
    $('#summaryDate').text(persianDate);
}

function showNotification(message, type = 'info') {
    const alertClass = 'alert-' + type;
    const icon = type === 'success' ? 'fa-check-circle' :
        type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

    $('.booking-notification').remove();

    const notification = $(`
        <div class="alert ${alertClass} alert-dismissible fade show booking-notification">
            <i class="fa ${icon} ml-2"></i>
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `);

    $('.booking-page').prepend(notification);

    setTimeout(() => {
        notification.alert('close');
    }, 3000);
}

function saveDraft() {
    const companionCount = parseInt($('#companionCount').text());
    const companions = [];

    for (let i = 1; i <= companionCount; i++) {
        companions.push({
            firstName: $(`#companion${i}FirstName`).val(),
            lastName: $(`#companion${i}LastName`).val(),
            nationalCode: $(`#companion${i}NationalCode`).val(),
            birthDate: $(`#companion${i}BirthDate`).val()
        });
    }

    const formData = {
        tourDetails: {
            days: $('#tourDays').val(),
            groupType: $('#groupType').val(),
            transportType: $('#transportType').val()
        },
        personalInfo: {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            nationalCode: $('#nationalCode').val(),
            phoneNumber: $('#phoneNumber').val(),
            email: $('#email').val(),
            birthDate: $('#birthDate').val(),
            address: $('#address').val()
        },
        companions: companions,
        companionsCount: companionCount,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('bookingDraft', JSON.stringify(formData));
    showNotification('پیش‌نویس ذخیره شد', 'success');
}

function loadDraft() {
    const draft = localStorage.getItem('bookingDraft');

    if (draft) {
        try {
            const formData = JSON.parse(draft);

            if (formData.tourDetails) {
                $('#tourDays').val(formData.tourDetails.days || '10');
                $('#groupType').val(formData.tourDetails.groupType || 'group');
                $('#transportType').val(formData.tourDetails.transportType || 'air');
            }

            if (formData.personalInfo) {
                $('#firstName').val(formData.personalInfo.firstName || '');
                $('#lastName').val(formData.personalInfo.lastName || '');
                $('#nationalCode').val(formData.personalInfo.nationalCode || '');
                $('#phoneNumber').val(formData.personalInfo.phoneNumber || '');
                $('#email').val(formData.personalInfo.email || '');
                $('#birthDate').val(formData.personalInfo.birthDate || '');
                $('#address').val(formData.personalInfo.address || '');
            }

            if (formData.companions && formData.companions.length > 0) {
                $('#companionCount').text(formData.companions.length);

                formData.companions.forEach((companion, index) => {
                    addCompanionForm(index + 1);

                    $(`#companion${index + 1}FirstName`).val(companion.firstName || '');
                    $(`#companion${index + 1}LastName`).val(companion.lastName || '');
                    $(`#companion${index + 1}NationalCode`).val(companion.nationalCode || '');
                    $(`#companion${index + 1}BirthDate`).val(companion.birthDate || '');
                });
            }

            const urlParams = new URLSearchParams(window.location.search);
            const city = urlParams.get('city');

            if (city) {
                updateTourDetails();
                calculateTourPrice(false);
            }

            showNotification('پیش‌نویس بارگذاری شد', 'info');
        } catch (error) {
            console.error('خطا در بارگذاری پیش‌نویس:', error);
        }
    }
}

function printBookingInfo() {
    window.print();
}

function showHelp() {
    alert(`راهنمای سیستم رزرو تور:

📋 مرحله ۱: اطلاعات تور و مسافر اصلی
- مشخصات تور را انتخاب کنید (روزها، نوع گروه، حمل و نقل)
- اطلاعات شخصی خود را وارد کنید
- تعداد نفرات به صورت خودکار محاسبه می‌شود (شما + همراهان)

👥 مرحله ۲: اطلاعات همراهان
- همراهان خود را اضافه کنید (حداکثر ۱۰ نفر)
- اطلاعات کامل هر همراه را وارد کنید
- تعداد کل مسافرین به روز می‌شود

💰 مرحله ۳: پرداخت
- اطلاعات تور ازفرم نمایش داده می‌شود
- خلاصه همراهان مشاهده می‌شود
- خلاصه نهایی رزرو و قیمت نمایش داده می‌شود
- روش پرداخت را انتخاب کنید

💡 نکات:
- قیمت بر اساس تعداد کل نفرات محاسبه می‌شود
- شما: قیمت کامل | همراهان: 15% تخفیف برای هر نفر
- حمل دریایی فقط برای تور کیش فعال است
- می‌توانید پیش‌نویس را ذخیره و بعداً ادامه دهید`);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const currentPrice = $('#totalPrice').data('calculated-price');
    if (!currentPrice || currentPrice === 0) {
        showNotification('لطفاً ابتدا اطلاعات تور را تکمیل کنید', 'warning');
        return;
    }

    if (!validateCurrentStep()) {
        return;
    }

    if (!$('#termsCheck').prop('checked')) {
        showNotification('لطفا قوانین را تایید کنید', 'warning');
        return;
    }

    showPriceSection();

    const totalPrice = $('#totalPrice').data('calculated-price');
    const basePrice = $('#basePrice').data('calculated-price');
    const taxAmount = $('#taxAmount').data('calculated-price');

    $('#basePrice').text(formatPrice(basePrice));
    $('#taxAmount').text(formatPrice(taxAmount));
    $('#totalPrice').text(formatPrice(totalPrice));
    $('#tourPrice').text(formatPrice(totalPrice));

    $('#applyDiscount').prop('disabled', false).text('اعمال');

    $('#completePaymentButton').removeClass('d-none');

    showNotification('اطلاعات تور تأیید شد. قیمت نهایی محاسبه گردید.', 'success');

    localStorage.setItem('bookingConfirmed', 'true');

    $('html, body').animate({
        scrollTop: 0
    }, 600);
}

function completePayment() {
    const discountCode = $('#discountCode').val().trim();
    if (discountCode) {
        applyDiscount();

        setTimeout(() => {
            proceedToPayment();
        }, 500);
    } else {
        proceedToPayment();
    }
}

function proceedToPayment() {
    showNotification('در حال اتصال به درگاه پرداخت...', 'info');

    setTimeout(() => {
        const trackingCode = 'TR' + Date.now().toString().slice(-8);
        const finalPrice = $('#totalPrice').text();
        const companionCount = parseInt($('#companionCount').text());
        const totalPassengers = 1 + companionCount;

        updatePriceSectionToBooked(trackingCode, finalPrice, totalPassengers);

        showNotification(`
            <div class="text-center">
                <h5 class="text-success"><i class="fa fa-check-circle"></i> پرداخت با موفقیت انجام شد!</h5>
                <p>کد رهگیری: <strong>${trackingCode}</strong></p>
                <p>تعداد مسافرین: <strong>${totalPassengers} نفر</strong></p>
                <p>مبلغ پرداخت شده: <strong>${finalPrice} تومان</strong></p>
                <p>جزئیات رزرو به ایمیل شما ارسال خواهد شد.</p>
            </div>
        `, 'success');

        localStorage.removeItem('bookingDraft');
        localStorage.setItem('bookingStatus', 'booked');
        localStorage.setItem('bookingTrackingCode', trackingCode);
        localStorage.setItem('finalPrice', finalPrice);

        $('#completePaymentButton').addClass('d-none');
        $('#bookingForm').addClass('form-disabled');
        $('.btn-next-step, .btn-prev-step').prop('disabled', true);

        $('#newBookingButton').removeClass('d-none');

        $('html, body').animate({
            scrollTop: 0
        }, 600);

    }, 2000);
}

function updatePriceSectionToBooked(trackingCode, finalPrice, totalPassengers) {
    $('.price-disclosure-message').remove();

    const bookedMessage = `
        <div class="booked-success-message">
            <div class="booked-icon">
                <i class="fa fa-check-circle"></i>
            </div>
            <div class="booked-content">
                <h5>رزرو شد</h5>
                <p class="booked-tracking">کد رهگیری: <strong>${trackingCode}</strong></p>
                <p class="booked-passengers">تعداد مسافرین: <strong>${totalPassengers} نفر</strong></p>
                <p class="booked-price">مبلغ پرداختی: <strong>${finalPrice} تومان</strong></p>
                <p class="booked-info">جزئیات رزرو به ایمیل شما ارسال شد.</p>
                <div class="booked-actions">
                    <button class="btn btn-outline-primary btn-sm" onclick="printBookingInfo()">
                        <i class="fa fa-print"></i> چاپ رسید
                    </button>
                    <button class="btn btn-outline-success btn-sm" onclick="downloadInvoice()">
                        <i class="fa fa-download"></i> دانلود فاکتور
                    </button>
                </div>
            </div>
        </div>
    `;

    $('.booking-price-section').prepend(bookedMessage);

    $('.booking-price-section').addClass('booked-section');
    $('.booking-price-header h5').text('رزرو تکمیل شد');

    $('.booking-discount').addClass('d-none');
}

function downloadInvoice() {
    showNotification('در حال آماده‌سازی فاکتور...', 'info');

    setTimeout(() => {
        const invoiceData = {
            trackingCode: localStorage.getItem('bookingTrackingCode'),
            tourTitle: $('#selectedTourTitle').text(),
            city: $('#selectedCity').text(),
            passengerCount: 1 + parseInt($('#companionCount').text()),
            price: $('#totalPrice').text(),
            date: $('#summaryDate').text()
        };

        const invoiceText = `
            فاکتور رزرو تور
            ====================
            کد رهگیری: ${invoiceData.trackingCode}
            عنوان تور: ${invoiceData.tourTitle}
            مقصد: ${invoiceData.city}
            تعداد نفرات: ${invoiceData.passengerCount}
            مبلغ: ${invoiceData.price} تومان
            تاریخ: ${invoiceData.date}
            ====================
            با تشکر از انتخاب شما
        `;

        const blob = new Blob([invoiceText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `فاکتور-${invoiceData.trackingCode}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showNotification('فاکتور با موفقیت دانلود شد', 'success');
    }, 1000);
}

function startNewBooking() {
    resetAllToDefault();
    $('#bookingForm')[0].reset();
    $('#bookingForm').removeClass('form-disabled');
    $('#companionsContainer').empty();
    $('#companionCount').text('0');
    $('#tourDays').val('10');
    $('#groupType').val('group');
    $('#transportType').val('air');
    $('#discountCode').val('');

    $('.booking-form-step').removeClass('active');
    $('#step1').addClass('active');
    updateStepDisplay('step1');

    $('.booked-success-message').remove();
    $('.booking-price-section').removeClass('booked-section');
    $('.booking-price-header h5').text('قیمت نهایی');

    $('.booking-discount').removeClass('d-none');

    $('#newBookingButton').addClass('d-none');

    $('#completePaymentButton').removeClass('d-none');
    $('.btn-next-step, .btn-prev-step').prop('disabled', false);

    // پاک کردن flagهای مودال
    localStorage.removeItem('modalClosedForTourSelection');
    localStorage.removeItem('modalClosedTime');

    localStorage.removeItem('bookingStatus');
    localStorage.removeItem('bookingTrackingCode');
    localStorage.removeItem('bookingConfirmed');
    localStorage.removeItem('finalPrice');

    updateTourDetails();
    calculateTourPrice(false);
    updateCompanionsSummary();

    showNotification('سیستم برای رزرو جدید آماده است', 'info');
}

function updateStepDisplay(step) {
    $('.booking-step').removeClass('active');
    if (step === 'step1') $('.booking-step').eq(0).addClass('active');
    else if (step === 'step2') $('.booking-step').eq(1).addClass('active');
    else if (step === 'step3') $('.booking-step').eq(2).addClass('active');
}