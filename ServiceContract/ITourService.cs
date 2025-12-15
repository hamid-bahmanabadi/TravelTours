using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceContract
{
    public interface ITourService
    {
        Task<List<TourDto>> GetAll();
        Task<TourDto?> GetById(long id);
        Task<ResponsDto> Add(TourDto tourDto);
        Task<ResponsDto> Delete(long id);
        Task<ResponsDto> Update(TourDto tourDto);
        Task<List<TourDto>> GetByAgency(long agencyid);
        Task<List<TourDto>> GetByCategory(long categoryid);
        Task<List<TourDto>> GetByCity(long cityid);
        Task<ResponsDto> ActiveDeActive(long tourId);
    }
}
