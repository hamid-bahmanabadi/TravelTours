using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TravelTour.Models;

namespace TravelTour.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
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

        public IActionResult Tours()
        {
            return View();
        }
        public IActionResult Favorites()
        {
            return View();
        }

        public IActionResult TravelGuide()
        {
            ViewData["Title"] = "راهنمای سفر ایران";
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}