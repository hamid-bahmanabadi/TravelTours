using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class CategoryDto
    {
 

        public long? Id { get; set; }

        [Display(Name = "نام دسته ندی")]
        [Required(ErrorMessage = " {0} اجباری است ")]
        [StringLength(150)]
        public string Name { get; set; }

        [Display(Name = "توضیحات")]
        [Required(ErrorMessage = " {0} اجباری است ")]
        [StringLength(500)]
        public string Description { get; set; }
    }
}
