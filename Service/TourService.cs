using DTO;
using Entities;
using Microsoft.EntityFrameworkCore;
using ServiceContract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class TourService : ITourService
    {
        readonly TravelContext _travelContext;

        public TourService(TravelContext travelContext)
        {
            _travelContext = travelContext;
        }

        public async Task<ResponsDto> Add(TourDto tourDto)
        {
            ResponsDto respons = new ResponsDto();
            var tour = new Tour()
            {
                Duration = tourDto.Duration,
                IsSpecial = tourDto.IsSpecial,
                CategoryId = tourDto.CategoryId,
                Description = tourDto.Description,
                CityId = tourDto.CityId,
                Price = tourDto.Price,
                StartDate = tourDto.StartDate,
                Title = tourDto.Title,
                AgencyId = tourDto.AgencyId,
                IsActive = tourDto.IsActive,
                Capacity = tourDto.Capacity,
                IsConfirm = tourDto.IsConfirm,
                TourType = tourDto.TourType,

            };
            await _travelContext.Tours.AddAsync(tour);
            var res = await _travelContext.SaveChangesAsync();
            respons.Succided = res > 0 ? true : false;
            respons.ErrorMessage = res > 0 ? "" : "مشکلی در اضافه کردن رکورد به وجود آمده است";
            return respons;

        }


        public async Task<ResponsDto> Delete(long id)
        {
            ResponsDto respons = new ResponsDto();

            var tour = await _travelContext.Tours.FirstOrDefaultAsync(x => x.Id == id);
            if (tour == null)
            {
                respons.Succided = false;
                respons.ErrorMessage = "رکورد یافت نشد";
                return respons;
            }
            _travelContext.Tours.Remove(tour);
            var res = await _travelContext.SaveChangesAsync();

            respons.Succided = res > 0 ? true : false;
            respons.ErrorMessage = res > 0 ? "" : "مشکلی در حدف رکورد به وجود آمده است";
            return respons;
        }


        public async Task<ResponsDto> Update(TourDto tourDto)
        {
            ResponsDto respons = new ResponsDto() { Succided = false, ErrorMessage = "رکورد مورد نظر یافت نشد" };
            var tour = await _travelContext.Tours.FirstOrDefaultAsync(x => x.Id == tourDto.Id);
            if (tour != null)
            {
                tour.Id= tourDto.Id;
                tour.Duration = tourDto.Duration;
                tour.StartDate = tourDto.StartDate;
                tour.Price = tourDto.Price;
                tour.AgencyId = tourDto.AgencyId;
                tour.Capacity = tourDto.Capacity;
                tour.CategoryId = tourDto.CategoryId;
                tour.CityId = tourDto.CityId;
                tour.Description = tourDto.Description;
                tour.IsSpecial = tourDto.IsSpecial;
                tour.Title = tourDto.Title;
                tour.IsActive = tourDto.IsActive;
                tour.IsConfirm = tourDto.IsConfirm;
                tour.TourType = tourDto.TourType;
                var res = await _travelContext.SaveChangesAsync();
                respons.Succided = res > 0 ? true : false;
                respons.ErrorMessage = res > 0 ? "" : "مشکلی در ویرایش رکورد به وجود آمده است";
                return respons;
            }

            return respons;

        }

        public async Task<List<TourDto>> GetAll()
        {
            return await _travelContext.Tours
                .Select(t => new TourDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    AgencyId = t.AgencyId,
                    CategoryId = t.CategoryId,
                    CityId = t.CityId,
                    Description = t.Description,
                    Price = t.Price,
                    Duration = t.Duration,
                    IsSpecial = t.IsSpecial,
                    StartDate = t.StartDate,
                    Capacity = t.Capacity,
                    IsActive = t.IsActive,
                    IsConfirm = t.IsConfirm,
                    TourType = t.TourType,
                    AgencyName = t.Agency.Name,
                    CategoryName = t.Category.Name,
                    CityName = t.City.Name
                }).ToListAsync();
        }

        public async Task<List<TourDto>> GetByAgency(long agencyid)
        {
            return await _travelContext.Tours.Where(x => x.AgencyId == agencyid).Select(t => new TourDto
            {
                Id = t.Id,
                Title = t.Title,
                AgencyId = t.AgencyId,
                CategoryId = t.CategoryId,
                CityId = t.CityId,
                Description = t.Description,
                Price = t.Price,
                Duration = t.Duration,
                IsSpecial = t.IsSpecial,
                StartDate = t.StartDate,
                Capacity = t.Capacity,
                IsActive = t.IsActive,
                IsConfirm = t.IsConfirm,
                TourType = t.TourType,
                AgencyName = t.Agency.Name,
                CategoryName = t.Category.Name,
                CityName = t.City.Name

            }).ToListAsync();


        }

        public async Task<List<TourDto>> GetByCategory(long categoryid)
        {
            return await _travelContext.Tours.Where(x => x.CategoryId == categoryid).Select(t => new TourDto
            {
                Id = t.Id,
                Title = t.Title,
                AgencyId = t.AgencyId,
                CategoryId = t.CategoryId,
                CityId = t.CityId,
                Description = t.Description,
                Price = t.Price,
                Duration = t.Duration,
                IsSpecial = t.IsSpecial,
                StartDate = t.StartDate,
                Capacity = t.Capacity,
                IsActive = t.IsActive,
                IsConfirm = t.IsConfirm,
                TourType = t.TourType,
                AgencyName = t.Agency.Name,
                CategoryName = t.Category.Name,
                CityName = t.City.Name
            }).ToListAsync();
        }

        public async Task<List<TourDto>> GetByCity(long cityid)
        {
            return await _travelContext.Tours
                .Where(x => x.CityId == cityid)
                .Select(t => new TourDto
                {
                    Id = t.Id,
                    Title = t.Title,
                    AgencyId = t.AgencyId,
                    CategoryId = t.CategoryId,
                    CityId = t.CityId,
                    Description = t.Description,
                    Price = t.Price,
                    Duration = t.Duration,
                    IsSpecial = t.IsSpecial,
                    StartDate = t.StartDate,
                    Capacity = t.Capacity,
                    IsActive = t.IsActive,
                    IsConfirm = t.IsConfirm,
                    TourType = t.TourType,
                    AgencyName = t.Agency.Name,
                    CategoryName = t.Category.Name,
                    CityName = t.City.Name

                }).ToListAsync();
        }

        public async Task<TourDto?> GetById(long id)
        {
            var tour = await _travelContext.Tours
                .Include(x => x.Agency)
                .Include(x => x.Category)
                .Include(x => x.City)
                .FirstOrDefaultAsync(t => t.Id == id);
            if (tour != null)
            {
                TourDto tourDto = new TourDto();
                tourDto.Id = tour.Id;
                tourDto.Title = tour.Title;
                tourDto.AgencyId = tour.AgencyId;
                tourDto.CategoryId = tour.CategoryId;
                tourDto.CityId = tour.CityId;
                tourDto.Description = tour.Description;
                tourDto.Price = tour.Price;
                tourDto.Duration = tour.Duration;
                tourDto.IsSpecial = tour.IsSpecial;
                tourDto.StartDate = tour.StartDate;
                tourDto.Capacity = tour.Capacity;
                tourDto.IsActive = tour.IsActive;
                tourDto.IsConfirm = tour.IsConfirm;
                tourDto.TourType = tour.TourType;
                tourDto.AgencyName = tour.Agency.Name;
                tourDto.CategoryName = tour.Category.Name;
                tourDto.CityName = tour.City.Name;

                return tourDto;
            }
            return null;
        }

        public async Task<ResponsDto> ActiveDeActive(long tourId)
        {
            var tour = await _travelContext.Tours.FirstOrDefaultAsync(t => t.Id == tourId);
            ResponsDto respons = new ResponsDto();
            if (tour == null)
            {
                respons.Succided = false;
                respons.ErrorMessage = "تور مورد نظر یافت نشد";
                return respons;
            }

            if (tour.IsActive)
            {
                DateTime endDate = tour.StartDate.AddDays(tour.Duration);
                bool isFinished = DateTime.Now.Date > endDate.Date;

                bool hasPayment = await _travelContext.Payments.Include(x => x.Reservation)
                    .AnyAsync(p => p.Reservation.TourId == tourId);

                if (!isFinished && hasPayment)
                {
                    respons.Succided = false;
                    respons.ErrorMessage = "امکان غیرفعال‌سازی تور وجود ندارد";
                    return respons;
                }

                tour.IsActive = false;
            }
            else
            {
                tour.IsActive = true;
            }
            var res = await _travelContext.SaveChangesAsync();
            respons.Succided = res > 0 ? true : false;
            respons.ErrorMessage = res > 0 ? "" : "مشکلی در اجرای عملیات مورد نظر  به وجود آمده است";
            return respons;



        }
    }
}
