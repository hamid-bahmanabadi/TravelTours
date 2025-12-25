using DTO;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Service;
using ServiceContract;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelTour.Controllers
{
    [Route("[controller]/[action]")]
    public class TourController : Controller
    {
        readonly ITourService _service;
        readonly ICityService _Cityservice;

        public TourController(ITourService service, ICityService cityservice)
        {
            _service = service;
            _Cityservice = cityservice;
        }

        public async Task<IActionResult> Index(int pageNumber = 1, int pageSize = 5)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 5;

            var tours = await _service.GetAll();
            var tourList = tours.ToList();

            int totalCount = tourList.Count;
            ViewBag.PageCount = (int)Math.Ceiling((decimal)totalCount / pageSize);
            ViewBag.PageNumber = pageNumber;
            var paged = tourList.Where(x => x.IsActive && x.IsConfirm)
                .OrderByDescending(x => x.StartDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return View(paged);
        }
        
    }
}
