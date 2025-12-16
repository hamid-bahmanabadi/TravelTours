using DTO.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class TourDto
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "عنوان تور الزامی است")]
        [StringLength(200, MinimumLength = 3, ErrorMessage = "عنوان تور باید بین 3 تا 200 کاراکتر باشد")]
        [Display(Name = "عنوان")]
        public string Title { get; set; }

        [Required(ErrorMessage = "آژانس الزامی است")]
        [Display(Name = "آژانس")]
        public long AgencyId { get; set; }

        [Required(ErrorMessage = "شهر الزامی است")]
        [Display(Name = "شهر")]
        public long CityId { get; set; }

        [Required(ErrorMessage = "دسته‌بندی الزامی است")]
        [Display(Name = "دسته‌بندی")]
        public long CategoryId { get; set; }

        [Required(ErrorMessage = "نوع تور الزامی است")]
        [Display(Name = "نوع تور")]
        public TourType TourType { get; set; } = TourType.زمینی;

        [Display(Name = "تایید شده")]
        public bool IsConfirm { get; set; }

        [Required(ErrorMessage = "قیمت الزامی است")]
        [DataType(DataType.Currency)]
        [Display(Name = "قیمت")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "تاریخ شروع الزامی است")]
        [DataType(DataType.DateTime)]
        [Display(Name = "تاریخ شروع")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "مدت زمان الزامی است")]
        [Range(1, 365, ErrorMessage = "مدت زمان باید بین 1 تا 365 روز باشد")]
        [Display(Name = "مدت زمان")]
        public int Duration { get; set; }

        [Display(Name = "ویژه")]
        public bool IsSpecial { get; set; }

        [StringLength(5000, MinimumLength = 10, ErrorMessage = "توضیحات باید بین 10 تا 5000 کاراکتر باشد")]
        [Display(Name = "توضیحات")]
        public string Description { get; set; }

        [Required(ErrorMessage = "ظرفیت الزامی است")]
        [Range(1, 1000, ErrorMessage = "ظرفیت باید بین 1 تا 1000 نفر باشد")]
        [Display(Name = "ظرفیت")]
        public int Capacity { get; set; }

        [Display(Name = "فعال")]
        public bool IsActive { get; set; }
    }
}
