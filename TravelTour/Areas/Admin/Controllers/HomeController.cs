using Microsoft.AspNetCore.Mvc;

namespace TravelTour.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("[Area]/[controller]/[action]")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
