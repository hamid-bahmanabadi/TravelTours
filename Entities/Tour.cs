using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Tour
    {
        [Key]
        public long Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; }

        [Required]
        public long AgencyId { get; set; }

        [Required]
        public long CityId { get; set; }

        [Required]
        public long CategoryId { get; set; }

        [Required]
        
        public decimal Price { get; set; } 

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public int Duration { get; set; } 

        [Required]
        public bool IsSpecial { get; set; } = false;

        [MaxLength(2000)]
        public string Description { get; set; }

        [Required]
        
        public int Capacity { get; set; }
        public bool IsActive { get; set; }=true;

        public IEnumerable<Image> Images { get; set; }
        public IEnumerable<Reservation> Reservations { get; set; }
        public IEnumerable<Review> Reviews { get; set; }        
        public City City { get; set; }        
        public Category Category { get; set; }        
        public Agency Agency { get; set; }
    }

}
