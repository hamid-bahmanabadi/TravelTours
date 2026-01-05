using DTO;
using DTO.Enums;
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

        public async Task<IActionResult> Index(int pageNumber = 1, int pageSize = 5, string filter = "all")
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 5;

            var tours = await _service.GetAll();
            var tourList = tours.ToList();

            // اعمال فیلتر
            var filteredList = ApplyFilter(tourList, filter);

            int totalCount = filteredList.Count;
            ViewBag.PageCount = (int)Math.Ceiling((decimal)totalCount / pageSize);
            ViewBag.PageNumber = pageNumber;
            ViewBag.CurrentFilter = filter;

            if (filter== "cheap" || filter == "expensive")
            {
                var paged = filteredList.Where(x => x.IsActive && x.IsConfirm && !x.IsRemoved)             
               .Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .ToList();
                return View(paged);
            }
            var paged2 = filteredList.Where(x => x.IsActive && x.IsConfirm)
               .OrderByDescending(x => x.StartDate)
               .Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
               .ToList();
            return View(paged2);


        }

        private List<TourDto> ApplyFilter(List<TourDto> tours, string filter)
        {
            return filter.ToLower() switch
            {
                "cheap" => tours.OrderBy(t => t.Price)
                    //.Take((int)Math.Ceiling(tours.Count * 0.25))
                    .ToList(),

                "expensive" => tours.OrderByDescending(t => t.Price)
                    //.Take((int)Math.Ceiling(tours.Count * 0.25))
                    .ToList(),

                "plane" => tours.Where(t => t.TourType == TourType.هوایی).ToList(),
                "train" => tours.Where(t => t.TourType == TourType.زمینی).ToList(),
                "sea" => tours.Where(t => t.TourType == TourType.دریایی).ToList(),
                "combo" => tours.Where(t => t.TourType == TourType.ترکیبی).ToList(),

                _ => tours
            };
        }
    }
        }

    

