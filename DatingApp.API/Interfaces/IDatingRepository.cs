using DatingApp.API.Helpers;
using DatingApp.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.API.Interfaces
{
    public interface IDatingRepository
    {
        void AddAsync<T>(T entity) where T : class;

        void DeleteAsync<T>(T entity) where T : class;

        Task<bool> SaveAllAsync();

        Task<PagedList<User>> GetUsersAsync(UserParams userParams);

        Task<User> GetUserAsync(int id);

        Task<Photo> GetPhotoAsync(int id);

        Task<Photo> GetMainPhotoAsync(int userId);

        Task<Like> GetLikeAsync(int senderId, int recieverId);
    }
}
