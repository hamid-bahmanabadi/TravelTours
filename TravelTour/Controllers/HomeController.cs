using Microsoft.AspNetCore.Mvc;
using ServiceContract;
using System.Diagnostics;
using TravelTour.Models;

namespace TravelTour.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        readonly ITourService _service;
       
        public HomeController(ILogger<HomeController> logger, ITourService service)
        {
            _logger = logger;
            _service = service;
        }

        public async Task<IActionResult>  Index()
        {
            var tours = await _service.GetAll();
            var tourList = tours
                .Where(x => x.IsActive && x.IsConfirm)
                .OrderByDescending(x => x.StartDate)
                .Take(5).ToList();
            return View(tourList);
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult Amenities()
        {
            return View();
        }

        public IActionResult Booking()
        {
            return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult Room()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}