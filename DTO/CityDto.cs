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

        [Required(ErrorMessage ="نام اجباری است ")]
        [StringLength(150)]
        public string Name { get; set; }

        [Required(ErrorMessage ="نام کشور اجباری است ")]
        [StringLength(150)]
        public string Country { get; set; }

        [Required(ErrorMessage ="لطفا توضیحات رو پر کنید")]
        [StringLength(500)]
        public string Description { get; set; }
    }
}
