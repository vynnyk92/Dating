using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Implementations
{
    public class DatingRepository : IDatingRepository
    {   
        public DataContext dataContext { get; set; }
        public DatingRepository(DataContext dataContext)
        {
            this.dataContext = dataContext;
        }

        public void AddAsync<T>(T entity) where T : class
        {
            this.dataContext.Add(entity);
        }

        public void DeleteAsync<T>(T entity) where T : class
        {
            this.dataContext.Remove(entity);
        }

        public async Task<User> GetUserAsync(int id)
        {
            var user = await this.dataContext.Users.Include(u=>u.Photos).FirstOrDefaultAsync(u=>u.Id==id);
            return user;
        }

        public async Task<PagedList<User>> GetUsersAsync(UserParams userParams)
        {
            var userQuery = this.dataContext.Users.Include(u => u.Photos).OrderByDescending(u=>u.LastActive).Where(u => u.Id != userParams.UserId && u.Gender == userParams.Gender);

            if(userParams.MinAge!=18 || userParams.MaxAge != 99)
            {
                userQuery = userQuery.Where(u=>u.DateOfBirth.CalculateAge()>=userParams.MinAge && u.DateOfBirth.CalculateAge() <= userParams.MaxAge);
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        userQuery = userQuery.OrderByDescending(u=>u.Created);
                        break;
                    default:
                        userQuery = userQuery.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            var users = await PagedList<User>.CreateAsync(userQuery, userParams.PageNumber, userParams.PageSize);
            return users;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await this.dataContext.SaveChangesAsync()>0;
        }


        public async Task<Photo> GetPhotoAsync(int id)
        {
            var photo = await this.dataContext.Photos.FirstOrDefaultAsync(u => u.Id == id);
            return photo;
        }

        public async Task<Photo> GetMainPhotoAsync(int userId)
        {
            var photo = await this.dataContext.Photos.Where(p => p.UserId == userId && p.MainPhoto == true).FirstOrDefaultAsync();
            return photo;
        }
    }
}
