using DTO;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ServiceContract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TravelTour.Controllers
{
    public class DestinationController : Controller
    {
        private readonly ICityService _cityService;

        public DestinationController(ICityService cityService)
        {
            _cityService = cityService;
        }

        [HttpGet("Destinations")]
        public async Task<IActionResult> Index()
        {
            return View(await _cityService.GetAllCities());
        }


        [HttpGet("DestinationDetail/{id}")]
        public async Task<IActionResult> Detail(long id)
        {
            var destination = await _cityService.GetCityById(id);
            return View(destination);
        }

        [HttpGet("Create-Destination")]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost("Create-Destination")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CityDto cityDto)
        {

            await _cityService.CreateCity(cityDto);

            return RedirectToAction("index");
        }

        // GET: Destination/Edit/5
        [HttpGet("Edit-Destination/{id}")]
        public async Task<IActionResult> Edit(long id)
        {
            var city = await _cityService.GetCityById(id);
            if (city == null)
            {
                return NotFound("کاربر مورد نظر یافت نشد");
            }
            return View(city);
        }

        [HttpPost("Edit-Destination/{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(CityDto cityDto)
        {
            if (ModelState.IsValid)
            {

                await _cityService.UpdateCity(cityDto);


                return RedirectToAction("index");
            }
            return View(cityDto);
        }



        public async Task<IActionResult> Delete(long id)
        {

            await _cityService.DeleteCity(id);


            return RedirectToAction("index");
        }
    }
}
