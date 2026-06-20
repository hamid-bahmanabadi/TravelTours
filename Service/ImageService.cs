using Azure;
using DTO;
using Entities;
using ServiceContract;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service
{
    public class ImageService : IImageService
    {
        private readonly TravelContext _context;

        public ImageService(TravelContext context)
        {
            _context = context;
        }
        public async Task<List<ImageDto>> GetAllTourImages(long tourId)
        {
            List<ImageDto> imageDtos = new List<ImageDto>();
            var images= _context.Images.Where(i => i.TourId == tourId).ToList();
            if (images != null)
            {
                foreach (var image in images)
                {
                    imageDtos.Add(new ImageDto
                    {
                        Id = image.Id,
                        Path = image.Path,
                        TourId = image.TourId
                    });
                }
                return imageDtos;
            }

            return imageDtos;
        }
        public async Task AddToTour(List<ImageDto> imageDtos)
        {
            ResponsDto respons = new ResponsDto();
            List<Image> images = new List<Image>();
            foreach (var image in imageDtos) 
            { 
                images.Add(new Image
                {
                    Path = image.Path,
                    TourId = image.TourId
                });
            }            
           await _context.Images.AddRangeAsync(images);
           await _context.SaveChangesAsync();
        }

        public async Task<ResponsDto> RemoveFromTour(long imagId)
        {
            ResponsDto respons = new ResponsDto();
             var img=  await _context.Images.FindAsync(imagId);
            if (img != null)
            {
                _context.Images.Remove(img);
                var res = await _context.SaveChangesAsync();
                respons.Succided = res > 0 ? true : false;
                respons.ErrorMessage = res > 0 ? "" : "مشکلی در حذف کردن عکس به وجود آمده است";
                return respons;
            }
            respons.Succided = false;
            respons.ErrorMessage = "عکس مورد نظر یافت نشد";
            return respons;
        }
    }
}
