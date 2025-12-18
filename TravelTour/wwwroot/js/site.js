$(document).ready(function () {
 

    const dateFields = ['TourDatePicker', 'date-1', 'date-2', 'date-3', 'date-4'];

    dateFields.forEach(function (fieldId) {
        const field = document.getElementById(fieldId);
        if (field && !field.classList.contains('persian-date-input')) {
            field.classList.add('persian-date-input');
            field.setAttribute('readonly', 'readonly');
            field.setAttribute('placeholder', 'انتخاب تاریخ');
            console.log(`فیلد ${fieldId} برای تقویم فارسی آماده شد`);
        }
    });
});