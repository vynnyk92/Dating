using DatingApp.API.Data;
using DatingApp.API.Interfaces;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace DatingApp.API.Implementations
{
    public class AuthRepository : IAuthRepository
    {
        public DataContext DataContext { get; set; }
        public IPasswordHashCreator passwordHashCreator { get; set; }
        public AuthRepository(DataContext dbContext, IPasswordHashCreator passwordHashCreator)
        {
            this.DataContext = dbContext;
            this.passwordHashCreator = passwordHashCreator;
        }

        public async Task<User> Login(string userName, string password)
        {
            var user = await DataContext.Users.FirstOrDefaultAsync(u=>u.Username==userName);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt)) {
                return null;
            }
            else
            {
                return user;
            }

        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHAsh = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHAsh.Length; i++)
                {
                    if (computedHAsh[i] !=passwordHash[i])
                        return false;
                }
                return true;
            }
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await DataContext.AddAsync(user);
            await DataContext.SaveChangesAsync();

            return user;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            passwordHashCreator.CreatePasswordHash(password, out passwordHash, out passwordSalt);
        }

        public async Task<bool> UserExist(string username)
        {
            return await DataContext.Users.AnyAsync(u => u.Username == username);
        }
    }
}
