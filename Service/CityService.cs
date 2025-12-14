using DTO;
using Entities;
using Microsoft.EntityFrameworkCore;
using ServiceContract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class CityService : ICityService
    {
        private readonly TravelContext _context;

        public CityService(TravelContext context)
        {
            _context = context;
        }

        public async Task CreateCity(CityDto cityDto)
        {
            var newCity = new City()
            {
                Country = cityDto.Country,
                Description = cityDto.Description,
                 Name = cityDto.Name,              
            };
            await _context.Cities.AddAsync(newCity);
            await _context.SaveChangesAsync();

        }

        public async Task DeleteCity(CityDto cityDto)
        {
            var city = await _context.Cities.FirstOrDefaultAsync(x=>x.Id == cityDto.Id);
             _context.Cities.Remove(city);
            await _context.SaveChangesAsync();
        }

        public async Task<List<CityDto>> GetAllCities()
        {
            return await _context.Cities.Select(c => new CityDto
            {
                Country = c.Country,
                Description = c.Description,
                Name = c.Name,
                Id = c.Id
            }).ToListAsync();
        }

        public async Task<CityDto> GetCityById(long id)
        {
          var city = await _context.Cities.FirstOrDefaultAsync(c => c.Id == id);

            return new CityDto
            {
                Country = city.Country,
                Description = city.Description,
                Name = city.Name,
                Id = city.Id
            };
        }

        public async Task UpdateCity(CityDto cityDto)
        {
            var city = await _context.Cities.FirstOrDefaultAsync(x=>x.Id ==cityDto.Id);

            city.Name = cityDto.Name;
            city.Id = cityDto.Id;
            city.Country = cityDto.Country;
            city.Description = cityDto.Description;

            _context.Cities.Update(city);
            await _context.SaveChangesAsync();

        }
    }
}
