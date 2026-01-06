using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO
{
    public class ImageDto
    {
        public long Id { get; set; }

        [Required]
        [MaxLength(255)]
        [Display(Name = "مسیر عکس")]
        public string Path { get; set; }

        [Required]
        [Display(Name = "تور")]
        public long TourId { get; set; }
        public bool IsRemoved { get; set; } = false;
    }
}
