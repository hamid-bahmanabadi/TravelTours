using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using ServiceContract;

namespace TravelTour.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("[area]/[controller]/[action]")]
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
            var paged = tourList.OrderByDescending(x => x.StartDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();


            return View(paged);
        }
        [HttpGet]
        public async Task<IActionResult> Delete(long TourId)
        {
            var Tourdto = await _service.GetById(TourId);
            var cities = await _Cityservice.GetAllCities();

            ViewBag.Cities = cities.Select(c => new SelectListItem
            {
                Value = c.Id.ToString(),
                Text = c.Name
            }).ToList();
            if (Tourdto == null)
            {
                ViewBag.Errors = "تور مورد نظر یافت نشد";
                return View(Tourdto);
            }
            await _service.Delete(TourId);
            return RedirectToAction("Index");
        }
        [HttpPost]
        public async Task<IActionResult> Delete(TourDto tourDto)
        {
            var result = await _service.Delete(tourDto.Id);
            if (result.Succided)
            {
                return RedirectToAction("Index");
            }
            ViewBag.Errors = result.ErrorMessage;
            return View(tourDto);
        }
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var cities = await _Cityservice.GetAllCities();

            ViewBag.Cities = cities.Select(c => new SelectListItem
            {
                Value = c.Id.ToString(),
                Text = c.Name
            }).ToList();

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create(TourDto tourDto)
        {
            List<string> ErrorList = new List<string>();
            if (!ModelState.IsValid)
            {
                foreach (var item in ModelState.Values)
                {
                    foreach (var error in item.Errors)
                    {
                        ErrorList.Add(error.ErrorMessage);
                    }
                }
                ViewBag.Errors = ErrorList;
                return View(tourDto);
            }
            var result = await _service.Add(tourDto);
            if (!result.Succided)
            {
                ViewBag.Errors = result.ErrorMessage;
                return View();
            }
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Edit(long TourId)
        {
            var cities = await _Cityservice.GetAllCities();

            ViewBag.Cities = cities.Select(c => new SelectListItem
            {
                Value = c.Id.ToString(),
                Text = c.Name
            }).ToList();

            var Tour = await _service.GetById(TourId);
            if (Tour == null)
            {
                ViewBag.Errors = "تور مورد نظر یافت نشد";
                return RedirectToAction("Index");

            }
            return View(Tour);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(TourDto tourDto)
        {
            List<string> ErrorList = new List<string>();
            if (!ModelState.IsValid)
            {
                foreach (var item in ModelState.Values)
                {
                    foreach (var error in item.Errors)
                    {
                        ErrorList.Add(error.ErrorMessage);
                    }
                }
                ViewBag.Errors = ErrorList;
                return View(tourDto);
            }
            var result = await _service.Update(tourDto);
            if (!result.Succided)
            {
                ViewBag.Errors = result.ErrorMessage;
                var cities = await _Cityservice.GetAllCities();

                ViewBag.Cities = cities.Select(c => new SelectListItem
                {
                    Value = c.Id.ToString(),
                    Text = c.Name
                }).ToList();
                return View(tourDto);
            }
            return RedirectToAction("Index");
        }
    }
}
