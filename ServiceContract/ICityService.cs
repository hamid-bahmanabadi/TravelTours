using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceContract
{
    public interface ICityService
    {
        Task<List<CityDto>> GetAllCities();
        Task<CityDto> GetCityById(long id);
        Task CreateCity(CityDto cityDto);
        Task UpdateCity(CityDto cityDto);
        Task DeleteCity(long id);

    }
}
