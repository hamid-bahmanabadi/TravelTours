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
        public string Title { get; set; }
        public long AgencyId { get; set; }      
        public long CityId { get; set; }
        public long CategoryId { get; set; } 
        public decimal Price { get; set; }        
        public DateTime StartDate { get; set; }        
        public int Duration { get; set; }        
        public bool IsSpecial { get; set; } 
        public string Description { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }

    }
}
