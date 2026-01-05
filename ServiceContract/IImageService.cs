using DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ServiceContract
{
    public interface IImageService
    {
        Task<List<ImageDto>> GetAllTourImages(long tourId);
        Task AddToTour(List<ImageDto> imageDtos);
        Task<ResponsDto> RemoveFromTour(long imagId);
    }
}
