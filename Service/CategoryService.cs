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
    public class CategoryService : ICategoryService
    {
        private readonly TravelContext _context;

        public CategoryService(TravelContext context)
        {
            _context = context;
        }

        public async Task CreateCategory(CategoryDto categoryDto)
        {
            var newCategory = new Category()
            {
                Name = categoryDto.Name,
                Description = categoryDto.Description,

            };

            await _context.AddAsync(newCategory);
            await _context.SaveChangesAsync();
        }


        public async Task DeleteCategory(long id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id);
            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();
        }

        public async Task<List<CategoryDto>> GetAllCategories()
        {
            return await _context.Categories.Select(x => new CategoryDto
            {
                Name = x.Name,
                Description = x.Description,
                Id = x.Id,


            }).ToListAsync();
        }

        public async Task<CategoryDto> GetCategoryById(long id)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == id);
            return new CategoryDto
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name,

            };
        }
      

        public async Task UpdateCategory(CategoryDto categoryDto)
        {
            var category = await _context.Categories.FirstOrDefaultAsync(x => x.Id == categoryDto.Id);

            category.Name = categoryDto.Name;
            category.Description = categoryDto.Description;

            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }
    }
}
