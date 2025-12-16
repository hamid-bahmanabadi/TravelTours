using DTO;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Service;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelTour.Controllers
{
    [Route("[controller]/[action]")]
    public class TourController : Controller
    {
       readonly TourService _service;

        public TourController(TourService service)
        {
            _service = service;
        }

        public async Task<IActionResult> Index(int pageNumber=1,int pageSize = 5)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1) pageSize = 5;

            var tours = await _service.GetAll();
            var tourList = tours.ToList();

            int totalCount = tourList.Count;
            ViewBag.PageCount = (int)Math.Ceiling((decimal)totalCount / pageSize);
            ViewBag.PageNumber = pageNumber;
            var paged = tourList
                .OrderBy(x => x.StartDate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return View(paged);
        }
        [HttpGet]
        public async Task<IActionResult> Delete(long TourId)
        {
            var Tour =await _service.GetById(TourId);
            if (Tour == null)
            {
                ViewBag.Errors = "تور مورد نظر یافت نشد";
                return RedirectToAction("Index");

            }
            return View(Tour);
        }
        [HttpPost]
        public async Task<IActionResult> Delete(TourDto tourDto)
        {
           var result=await _service.Delete(tourDto.Id);
            if (result.Succided)
            {
                return RedirectToAction("Index");
            }
            ViewBag.Errors= result.ErrorMessage;
            return View(tourDto);
        }
        [HttpGet]
        public async Task<IActionResult> Create()
        {
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
                    foreach (var error  in item.Errors)
                    {
                        ErrorList.Add(error.ErrorMessage);
                    }
                }
                ViewBag.Errors = ErrorList;
                return View();
            }
         var result=  await _service.Add(tourDto);
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
           var Tour=await _service.GetById(TourId);
              if (Tour == null)
            {
                ViewBag.Errors= "تور مورد نظر یافت نشد";
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
                return View(tourDto);
            }
            return RedirectToAction("Index");
        }
    }
}
