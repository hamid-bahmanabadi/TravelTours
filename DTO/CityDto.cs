using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class CityDto
    {
        
        public long Id { get; set; }

        [Display(Name = "نام مقصد")]
        [Required(ErrorMessage = "{0} اجباری است ")]
        [StringLength(150)]
        public string Name { get; set; }

        [Display(Name = "نام کشور")]
        [Required(ErrorMessage =" {0} اجباری است ")]
        [StringLength(150)]
        public string Country { get; set; }

        [Display(Name = "توضیحات")]
        [Required(ErrorMessage ="لطفا {0} رو پر کنید")]
        [StringLength(500)]
        public string Description { get; set; }
    }
}
